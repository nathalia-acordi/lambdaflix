import { describe, it, expect, vi } from 'vitest';
import * as db from '../src/db/mongoClient.mjs';
import { handler } from '../src/handlers/createMovie.mjs';
import * as validate from '../src/utils/validate.mjs';

vi.mock('../src/db/mongoClient.mjs');
vi.mock('../src/utils/validate.mjs');

describe('handler createMovie', () => {
  it('cria filme novo', async () => {
    validate.validateMovie.mockImplementation(() => true);
    db.getMongoClient.mockResolvedValue({
      db: () => ({
        collection: () => ({
          findOne: () => Promise.resolve(null),
          insertOne: (data) => Promise.resolve({ insertedId: 'abc123' })
        })
      })
    });
    const event = { body: JSON.stringify({ title: 'Matrix', year: 1999, genre: 'Sci-Fi' }) };
    const result = await handler(event);
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({ id: 'abc123' });
  });

  it('retorna 409 se filme já existe', async () => {
    validate.validateMovie.mockImplementation(() => true);
    db.getMongoClient.mockResolvedValue({
      db: () => ({
        collection: () => ({
          findOne: () => Promise.resolve({ title: 'Matrix', year: 1999 }),
          insertOne: () => Promise.resolve({})
        })
      })
    });
    const event = { body: JSON.stringify({ title: 'Matrix', year: 1999, genre: 'Sci-Fi' }) };
    const result = await handler(event);
    expect(result.statusCode).toBe(409);
  });
});
