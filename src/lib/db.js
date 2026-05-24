import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@vercel/kv";
import Redis from "ioredis";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "database.json");

const isVercel = !!process.env.VERCEL;

// Support Vercel KV, Upstash Redis Integration, and direct Upstash credentials
const restUrl = process.env.KV_REST_API_URL || process.env.REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
const restToken = process.env.KV_REST_API_TOKEN || process.env.REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const tcpUrl = process.env.REDIS_URL;

const isKvMode = !!restUrl && !!restToken;
const isTcpMode = !isKvMode && !!tcpUrl;

let kv = null;
let redis = null;

if (isKvMode) {
  kv = createClient({
    url: restUrl,
    token: restToken,
  });
  console.log("Database initialized in Vercel KV/Redis mode using REST API.");
} else if (isTcpMode) {
  try {
    redis = new Redis(tcpUrl);
    console.log("Database initialized in Vercel KV/Redis mode using TCP Client (ioredis).");
  } catch (err) {
    console.error("Failed to initialize ioredis connection:", err);
  }
} else if (isVercel) {
  console.warn("Database running on Vercel but KV/Redis credentials (REST or TCP) are not connected yet. Running in safe fallback mode.");
} else {
  console.log("Database initialized in local JSON file mode.");
}

// Initialize database file if it doesn't exist (Only used in local JSON file mode)
function initDb() {
  if (isVercel) return; // Safeguard
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
  if (isVercel) return { users: [], history: [] }; // Safeguard
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
  if (isVercel) return; // Safeguard
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
        console.error("Failed to find user from Vercel KV REST:", error);
        return null;
      }
    }
    
    if (isTcpMode && redis) {
      try {
        const userStr = await redis.get(`user:${email.toLowerCase()}`);
        return userStr ? JSON.parse(userStr) : null;
      } catch (error) {
        console.error("Failed to find user from Redis TCP:", error);
        return null;
      }
    }
    
    if (isVercel) {
      console.warn("Vercel KV/Redis is not configured. findUserByEmail returning null.");
      return null;
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

    if (isTcpMode && redis) {
      const normalizedEmail = email.toLowerCase();
      const existingStr = await redis.get(`user:${normalizedEmail}`);
      if (existingStr) {
        throw new Error("Email already registered");
      }
      await redis.set(`user:${normalizedEmail}`, JSON.stringify(newUser));
      const { passwordHash: _, salt: __, ...userResponse } = newUser;
      return userResponse;
    }

    if (isVercel) {
      throw new Error("Cơ sở dữ liệu Vercel KV/Redis chưa được kết nối. Vui lòng kích hoạt trong tab Storage của dự án trên Vercel.");
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
        console.error("Failed to add history entry to Vercel KV REST:", error);
      }
    }

    if (isTcpMode && redis) {
      try {
        await redis.lpush(`history:${email.toLowerCase()}`, JSON.stringify(newEntry));
        return newEntry;
      } catch (error) {
        console.error("Failed to add history entry to Redis TCP:", error);
      }
    }

    if (isVercel) {
      console.warn("Vercel KV/Redis is not configured. addHistoryEntry returning without saving.");
      return newEntry;
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
        console.error("Failed to get history from Vercel KV REST:", error);
        return [];
      }
    }

    if (isTcpMode && redis) {
      try {
        const historyList = await redis.lrange(`history:${email.toLowerCase()}`, 0, -1);
        return historyList ? historyList.map((item) => JSON.parse(item)) : [];
      } catch (error) {
        console.error("Failed to get history from Redis TCP:", error);
        return [];
      }
    }

    if (isVercel) {
      console.warn("Vercel KV/Redis is not configured. getHistory returning empty array.");
      return [];
    }

    const { history } = readDb();
    return history
      .filter((h) => h.email.toLowerCase() === email.toLowerCase())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },
};
