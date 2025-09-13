import { describe, it, expect, vi } from 'vitest';
import * as db from '../src/db/mongoClient.mjs';
import { handler } from '../src/handlers/listMovies.mjs';

vi.mock('../src/db/mongoClient.mjs');

describe('handler listMovies', () => {
  it('retorna lista de filmes', async () => {
    const fakeMovies = [{ title: 'Matrix', year: 1999, genre: 'Sci-Fi' }];
    db.getMongoClient.mockResolvedValue({
      db: () => ({
        collection: () => ({
          find: () => ({ toArray: () => Promise.resolve(fakeMovies) })
        })
      })
    });

    const result = await handler({});
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(fakeMovies);
  });
});
