import { MongoClient } from 'mongodb';
let cachedClient = null;

export async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in environment variables');
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  cachedClient = client;
  return client;
}