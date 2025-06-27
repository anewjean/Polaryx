const BASE_URL = 'http://localhost:8000';

export async function get() {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
}

export async function workspace() {
  const res = await fetch(`${BASE_URL}/{workspace_id}`);
  return res.json();
}