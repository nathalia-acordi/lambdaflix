import { getMongoClient } from '../db/mongoClient.mjs';
import { log } from '../utils/logger.mjs';

export async function handler(event) {
  try {
    const client = await getMongoClient();
    const db = client.db(process.env.DB_NAME);
    const movies = await db.collection('movies').find({}).toArray();
    log('Listando filmes', { count: movies.length });
    return { statusCode: 200, body: JSON.stringify(movies) };
  } catch (err) {
    log('Erro ao listar filmes', { error: err.message });
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
