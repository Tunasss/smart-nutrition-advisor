import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "database.json");

// Initialize database file if it doesn't exist
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(
      DB_PATH,
      JSON.stringify({ users: [], history: [] }, null, 2),
      "utf-8"
    );
  }
}

// Read database
function readDb() {
  initDb();
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(data);
    return {
      users: parsed.users || [],
      history: parsed.history || []
    };
  } catch (error) {
    console.error("Failed to read database, resetting to default structure:", error);
    return { users: [], history: [] };
  }
}

// Write database
function writeDb(data) {
  initDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Password hashing helper
function hashPassword(password, salt) {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

// Export database operations
export const db = {
  // Find a user by email
  findUserByEmail(email) {
    const { users } = readDb();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  // Register a new user
  registerUser(email, password, name) {
    const database = readDb();
    
    // Check if user already exists
    const existing = database.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      throw new Error("Email already registered");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = hashPassword(password, salt);
    
    const newUser = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name: name ? name.trim() : email.split("@")[0],
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    };

    database.users.push(newUser);
    writeDb(database);

    // Return user without sensitive data
    const { passwordHash: _, salt: __, ...userResponse } = newUser;
    return userResponse;
  },

  // Login verification
  verifyUser(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const hash = hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      throw new Error("Invalid email or password");
    }

    // Return user without sensitive data
    const { passwordHash: _, salt: __, ...userResponse } = user;
    return userResponse;
  },

  // Add a history item for a user
  addHistoryEntry(email, data) {
    const database = readDb();
    const newEntry = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      timestamp: new Date().toISOString(),
      age: data.age,
      weight: data.weight,
      height: data.height,
      goal: data.goal,
      targetWeight: data.targetWeight || null,
      timeframe: data.timeframe || null,
      result: data.result || null,
    };

    database.history.push(newEntry);
    writeDb(database);
    return newEntry;
  },

  // Get history list for a user
  getHistory(email) {
    const { history } = readDb();
    return history
      .filter((h) => h.email.toLowerCase() === email.toLowerCase())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },
};
