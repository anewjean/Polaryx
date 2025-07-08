const BASE_URL = process.env.NEXT_PUBLIC_BASE;

export async function get() {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
}

export async function workspace() {
  const res = await fetch(`${BASE_URL}/{workspace_id}`);
  return res.json();
}