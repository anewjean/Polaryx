const BASE_URL = 'http://localhost:8000';

export async function get() {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
}