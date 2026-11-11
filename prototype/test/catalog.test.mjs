import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { films, categories, selectFilms, validSavedIds } from '../dist/data.js';

test('all catalog records have unique ids, valid categories, and available local posters', async () => {
  assert.equal(new Set(films.map(film => film.id)).size, films.length);
  for (const film of films) {
    assert.ok(categories.some(category => category.id === film.category));
    await access(new URL(`../dist/${film.poster}`, import.meta.url));
  }
});
test('Thai and English search trims input and ignores letter case', () => {
  assert.deepEqual(selectFilms({ query: '  PINKU  ' }).map(film => film.id), ['pinku-pastels']);
  assert.deepEqual(selectFilms({ query: 'ลมหายใจ' }).map(film => film.id), ['in-the-same-breath']);
  assert.equal(selectFilms({ query: 'ไม่มีชื่อเรื่องแบบนี้ในระบบ' }).length, 0);
});
test('category, duration and saved filters compose; unknown runtimes are excluded from duration limits', () => {
  const result = selectFilms({ category: 'romance', duration: '15', savedIds: ['somewhere-over-the-rainbow', 'lovely'] });
  assert.deepEqual(result.map(film => film.id), ['somewhere-over-the-rainbow']);
  assert.ok(selectFilms({ duration: '30' }).every(film => film.minutes != null));
  assert.deepEqual(selectFilms({ savedIds: [] }), []);
});
test('duration sort places unknown runtime last without mutating catalog order', () => {
  const original = films.map(film => film.id);
  const result = selectFilms({ sort: 'duration' });
  assert.equal(result[0].id, 'rim');
  assert.equal(result.at(-1).minutes, null);
  assert.deepEqual(films.map(film => film.id), original);
});
test('saved record validation rejects malformed and unknown ids and removes duplicates', () => {
  assert.deepEqual(validSavedIds(null), []);
  assert.deepEqual(validSavedIds({ id: 'rim' }), []);
  assert.deepEqual(validSavedIds(['rim', 'bad-id', 'rim', 123, 'pinku-pastels']), ['rim', 'pinku-pastels']);
});
