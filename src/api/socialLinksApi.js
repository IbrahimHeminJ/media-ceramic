import { client } from './client';

export async function getAllSocialLinks() {
  const { data } = await client.get('/api/social-links');
  return data;
}

export async function createSocialLink(payload) {
  const { data } = await client.post('/api/social-links', payload);
  return data;
}

export async function deleteSocialLink(id) {
  const { data } = await client.delete(`/api/social-links/${id}`);
  return data;
}
