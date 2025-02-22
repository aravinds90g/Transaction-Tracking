import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://aravinds90g:aravinds90g@aravind.jwssnu7.mongodb.net/Data?retryWrites=true&w=majority&appName=Aravind";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

let cached = global.mongoose;

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
