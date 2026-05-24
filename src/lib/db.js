import fs from "fs";
import path from "path";
import crypto from "crypto";
import { kv } from "@vercel/kv";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "database.json");

const isKvMode = !!process.env.KV_REST_API_URL;

if (isKvMode) {
  console.log("Database initialized in Vercel KV mode.");
} else {
  console.log("Database initialized in local JSON file mode.");
}

// Initialize database file if it doesn't exist (Only used in local JSON file mode)
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
  async findUserByEmail(email) {
    if (isKvMode) {
      try {
        const user = await kv.get(`user:${email.toLowerCase()}`);
        return user || null;
      } catch (error) {
        console.error("Failed to find user from Vercel KV:", error);
        return null;
      }
    }
    
    const { users } = readDb();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  // Register a new user
  async registerUser(email, password, name) {
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

    if (isKvMode) {
      const normalizedEmail = email.toLowerCase();
      const existing = await kv.get(`user:${normalizedEmail}`);
      if (existing) {
        throw new Error("Email already registered");
      }
      await kv.set(`user:${normalizedEmail}`, newUser);
      const { passwordHash: _, salt: __, ...userResponse } = newUser;
      return userResponse;
    }

    const database = readDb();
    // Check if user already exists
    const existing = database.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      throw new Error("Email already registered");
    }

    database.users.push(newUser);
    writeDb(database);

    // Return user without sensitive data
    const { passwordHash: _, salt: __, ...userResponse } = newUser;
    return userResponse;
  },

  // Login verification
  async verifyUser(email, password) {
    const user = await this.findUserByEmail(email);
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
  async addHistoryEntry(email, data) {
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

    if (isKvMode) {
      try {
        // Push to the list (Lpush inserts at head so newest is first)
        await kv.lpush(`history:${email.toLowerCase()}`, newEntry);
        return newEntry;
      } catch (error) {
        console.error("Failed to add history entry to Vercel KV:", error);
      }
    }

    const database = readDb();
    database.history.push(newEntry);
    writeDb(database);
    return newEntry;
  },

  // Get history list for a user
  async getHistory(email) {
    if (isKvMode) {
      try {
        const history = await kv.lrange(`history:${email.toLowerCase()}`, 0, -1);
        return history || [];
      } catch (error) {
        console.error("Failed to get history from Vercel KV:", error);
        return [];
      }
    }

    const { history } = readDb();
    return history
      .filter((h) => h.email.toLowerCase() === email.toLowerCase())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },
};
