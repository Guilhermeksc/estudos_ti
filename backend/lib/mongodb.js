import { MongoClient } from 'mongodb';

let clientPromise;

/**
 * @returns {Promise<import('mongodb').MongoClient>}
 */
export async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri?.trim()) {
    throw new Error('MONGODB_URI não está configurado');
  }
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

/**
 * @returns {Promise<import('mongodb').Db>}
 */
export async function getDb() {
  const client = await getMongoClient();
  return client.db();
}
