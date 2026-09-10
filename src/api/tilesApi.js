import { client } from './client';

export async function getAllTiles() {
  const { data } = await client.get('/api/tiles');
  return data;
}

export async function createTile(formData) {
  const { data } = await client.post('/api/tiles', formData);
  return data;
}

export async function updateTile(id, formData) {
  const { data } = await client.patch(`/api/tiles/${id}`, formData);
  return data;
}

export async function deleteTile(id) {
  const { data } = await client.delete(`/api/tiles/${id}`);
  return data;
}
