// Unsplash image helper — fixed photo IDs, no API key required.
export function img(id: string, w = 600, h?: number, fit: string = 'crop'): string {
  const params = `w=${w}${h ? `&h=${h}` : ''}&fit=${fit}&q=80&auto=format`;
  return `https://images.unsplash.com/${id}?${params}`;
}
