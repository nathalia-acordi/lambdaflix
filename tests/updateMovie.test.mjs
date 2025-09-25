import { describe, it, expect, beforeAll } from 'vitest';
import { handler as updateMovie } from '../src/handlers/updateMovie.mjs';
import { handler as createMovie } from '../src/handlers/createMovie.mjs';
import { handler as getMovie } from '../src/handlers/getMovie.mjs';
import { vi } from 'vitest';
import * as db from '../src/db/mongoClient.mjs';

vi.mock('../src/db/mongoClient.mjs');

describe('updateMovie', () => {
  let movieId;
  let fakeDb;
  const validId = '123456789012345678901234';

  beforeAll(() => {
    fakeDb = {
      [validId]: {
        _id: validId,
        title: 'Filme Original',
        year: 2001,
        genre: 'Drama',
        description: 'Descrição original.'
      }
    };
    db.getMongoClient.mockResolvedValue({
      db: () => ({
        collection: () => ({
          updateOne: ({ _id }, { $set }) => {
            if (fakeDb[_id]) {
              fakeDb[_id] = { ...fakeDb[_id], ...$set };
              return Promise.resolve({ matchedCount: 1 });
            }
            return Promise.resolve({ matchedCount: 0 });
          },
          findOne: ({ _id }) => Promise.resolve(fakeDb[_id] || null),
          insertOne: (doc) => {
            fakeDb[doc._id] = doc;
            return Promise.resolve({ insertedId: doc._id });
          }
        })
      })
    });
    movieId = validId;
  });

  it('atualiza um filme existente', async () => {
    const event = {
      pathParameters: { id: movieId },
      body: JSON.stringify({
        title: 'Filme Atualizado',
        year: 2022
      })
    };
    const res = await updateMovie(event);
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain('Filme atualizado com sucesso');

    // Confirma atualização
    const getRes = await getMovie({ pathParameters: { id: movieId } });
    const movie = JSON.parse(getRes.body);
    expect(movie.title).toBe('Filme Atualizado');
    expect(movie.year).toBe(2022);
  });

  it('retorna 404 para id inexistente', async () => {
    const event = {
      pathParameters: { id: '000000000000000000000000' },
      body: JSON.stringify({ title: 'Nada' })
    };
    const res = await updateMovie(event);
    expect(res.statusCode).toBe(404);
  });

  it('retorna 400 se id não informado', async () => {
    const event = { body: JSON.stringify({ title: 'Nada' }) };
    const res = await updateMovie(event);
    expect(res.statusCode).toBe(400);
  });
});
