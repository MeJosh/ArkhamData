const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export async function fetchJson<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText}: ${url}`);
  }
  return res.json() as Promise<T>;
}
