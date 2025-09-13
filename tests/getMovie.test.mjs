import { describe, it, expect, vi } from 'vitest';
import * as db from '../src/db/mongoClient.mjs';
import { handler } from '../src/handlers/getMovie.mjs';
import { ObjectId } from 'mongodb';

vi.mock('../src/db/mongoClient.mjs');

describe('handler getMovie', () => {
  it('retorna filme por id', async () => {
    const validId = new ObjectId('123456789012345678901234');
    const fakeMovie = { _id: validId, title: 'Matrix', year: 1999, genre: 'Sci-Fi' };
    db.getMongoClient.mockResolvedValue({
      db: () => ({
        collection: () => ({
          findOne: ({ _id }) => Promise.resolve(_id.equals(validId) ? fakeMovie : null)
        })
      })
    });
    const event = { pathParameters: { id: '123456789012345678901234' } };
    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    // Ajuste para comparar _id como string
    const movieReturned = JSON.parse(result.body);
    expect(movieReturned).toEqual({ ...fakeMovie, _id: validId.toString() });
  });

  it('retorna 404 se não encontrar', async () => {
    db.getMongoClient.mockResolvedValue({
      db: () => ({
        collection: () => ({
          findOne: () => Promise.resolve(null)
        })
      })
    });
    const event = { pathParameters: { id: 'ffffffffffffffffffffffff' } };
    const result = await handler(event);
    expect(result.statusCode).toBe(404);
  });
});
