/** Decodes the payload of a JWT. Does not verify the signature (the backend does). */
export function decodeJwtPayload<T>(token: string): T {
  const part = token.split('.')[1];
  if (!part) throw new Error('Invalid JWT');

  const base64 = part
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(part.length / 4) * 4, '=');
  // atob returns a binary string; re-encode it so accented names decode as UTF-8.
  const utf8 = atob(base64)
    .split('')
    .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');

  return JSON.parse(decodeURIComponent(utf8)) as T;
}
