import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://aravinds90g:aravinds90g@aravind.jwssnu7.mongodb.net/Data?retryWrites=true&w=majority&appName=Aravind";

if (!MONGODB_URI)
  throw new Error("Please define the MONGODB_URI environment variable");

// Use a module-level cache to survive Next.js hot-reloads
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectToDatabase() {
  // Already connected – return immediately
  if (cached.conn) return cached.conn;

  // If a connection is already being established, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "Data",          // explicit db name so it works with or without it in the URI
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset promise on failure so the next request can retry
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectToDatabase;
