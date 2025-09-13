import { getMongoClient } from '../db/mongoClient.mjs';
import { log } from '../utils/logger.mjs';
import { ObjectId } from 'mongodb';

export async function handler(event) {
  try {
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'ID não informado' }) };
    }
    const client = await getMongoClient();
    const db = client.db(process.env.DB_NAME);
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });
    if (!movie) {
      log('Filme não encontrado', { id });
      return { statusCode: 404, body: JSON.stringify({ error: 'Filme não encontrado' }) };
    }
    log('Filme encontrado', { id });
    return { statusCode: 200, body: JSON.stringify(movie) };
  } catch (err) {
    log('Erro ao buscar filme', { error: err.message });
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
