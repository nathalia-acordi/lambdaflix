import { requiredFields, schema } from '../models/movie.mjs';

export function validateMovie(data, partial = false) {
  if (!partial) {
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Campo obrigatório ausente: ${field}`);
      }
      if (typeof data[field] !== schema[field]) {
        throw new Error(`Tipo inválido para ${field}: esperado ${schema[field]}`);
      }
    }
  }
  // No modo parcial, só valida os campos presentes
  for (const key in data) {
    if (schema[key] && typeof data[key] !== schema[key]) {
      throw new Error(`Tipo inválido para ${key}: esperado ${schema[key]}`);
    }
  }
  return true;
}
