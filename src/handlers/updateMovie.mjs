import { getMongoClient } from '../db/mongoClient.mjs';
import { log } from '../utils/logger.mjs';
import { ObjectId } from 'mongodb';
import { validateMovie } from '../utils/validate.mjs';

export async function handler(event) {
  try {
    const id = event.pathParameters && event.pathParameters.id;
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'ID não informado' }) };
    }
    const data = JSON.parse(event.body || '{}');
    validateMovie(data, true); // true = modo atualização (pode ser parcial, se quiser)
    const client = await getMongoClient();
    const db = client.db(process.env.DB_NAME);
    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    if (result.matchedCount === 0) {
      log('Filme para atualizar não encontrado', { id });
      return { statusCode: 404, body: JSON.stringify({ error: 'Filme não encontrado' }) };
    }
    log('Filme atualizado', { id, data });
    return { statusCode: 200, body: JSON.stringify({ message: 'Filme atualizado com sucesso' }, null, 2) };
  } catch (err) {
    log('Erro ao atualizar filme', { error: err.message });
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
