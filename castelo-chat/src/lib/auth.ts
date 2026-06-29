// Auth desativada — acesso direto sem senha
export function isAuthenticated(_request: Request): boolean {
  return true;
}

export function validatePassword(_password: string): boolean {
  return true;
}

export function getAuthCookie(): string {
  return '';
}

export function clearAuthCookie(): string {
  return '';
}
