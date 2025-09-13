import { describe, it, expect } from 'vitest';
import { validateMovie } from '../src/utils/validate.mjs';

// Testes para a função validateMovie

describe('validateMovie', () => {
  it('valida um filme válido', () => {
    expect(() =>
      validateMovie({ title: 'Matrix', year: 1999, genre: 'Sci-Fi', description: '...' })
    ).not.toThrow();
  });

  it('lança erro se faltar campo obrigatório', () => {
    expect(() =>
      validateMovie({ year: 1999, genre: 'Sci-Fi' })
    ).toThrow(/Campo obrigatório ausente/);
  });

  it('lança erro se tipo estiver errado', () => {
    expect(() =>
      validateMovie({ title: 'Matrix', year: '1999', genre: 'Sci-Fi' })
    ).toThrow(/Tipo inválido para year/);
  });
});
