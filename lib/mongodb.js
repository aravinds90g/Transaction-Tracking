import mongoose from "mongoose";

// Define the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Throw an error if MONGODB_URI is not defined
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Initialize the global mongoose cache if it doesn't exist
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

// Use the cached connection if available
const cached = global.mongoose;

async function connectToDatabase() {
  // Return the cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if it doesn't exist
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
    };

    cached.promise = mongoose
      .connect(
        "mongodb+srv://aravinds90g:aravinds90g@aravind.jwssnu7.mongodb.net/Data?retryWrites=true&w=majority&appName=Aravind",
        opts
      )
      .then((mongoose) => {
        return mongoose;
      });
  }

  // Await the connection promise and cache the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset the promise if the connection fails
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
