import { getMongoClient } from '../db/mongoClient.js';
import { validateMovie } from '../utils/validate.js';
import { log } from '../utils/logger.mjs';

export async function handler(event) {
  try {
    const data = JSON.parse(event.body);
    validateMovie(data);
    const client = await getMongoClient();
    const db = client.db(process.env.DB_NAME);
    // Idempotência: não cria duplicado se já existir filme com mesmo título e ano
    const existing = await db.collection('movies').findOne({ title: data.title, year: data.year });
    if (existing) {
      log('Filme já existe', { title: data.title, year: data.year });
      return { statusCode: 409, body: JSON.stringify({ error: 'Filme já existe' }) };
    }
    const result = await db.collection('movies').insertOne(data);
    log('Filme criado', { id: result.insertedId });
    return { statusCode: 201, body: JSON.stringify({ id: result.insertedId }) };
  } catch (err) {
    log('Erro ao criar filme', { error: err.message });
    return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
  }
}
