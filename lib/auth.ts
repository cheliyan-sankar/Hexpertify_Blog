export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

export function setAdminSession(email: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('admin_email', email);
    sessionStorage.setItem('admin_logged_in', 'true');
  }
}

export function getAdminSession() {
  if (typeof window !== 'undefined') {
    return {
      email: sessionStorage.getItem('admin_email'),
      isLoggedIn: sessionStorage.getItem('admin_logged_in') === 'true',
    };
  }
  return { email: null, isLoggedIn: false };
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('admin_email');
    sessionStorage.removeItem('admin_logged_in');
  }
}
