// Normalize Brazilian phone numbers for UazapiGO
// UazapiGO expects: 5511999999999 (country code + DDD + number, no spaces/hyphens)
export function normalizePhone(raw: string): string | null {
  if (!raw) return null;
  // Remove all non-digits
  let digits = raw.replace(/\D/g, '');
  // Remove leading zeros
  digits = digits.replace(/^0+/, '');
  // If starts with 55 and has 12-13 digits, it's already formatted
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }
  // If 10-11 digits (DDD + number), add 55
  if (digits.length === 10 || digits.length === 11) {
    return '55' + digits;
  }
  return null;
}

// Parse multiple phones from a field like "055 3225 1468, 55 9979-1163"
export function parsePhones(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map(p => normalizePhone(p.trim()))
    .filter((p): p is string => p !== null);
}

// Pick primary phone — prefer mobile (9 digits after DDD)
export function pickPrimaryPhone(phones: string[]): string | null {
  if (!phones.length) return null;
  // Mobile: 55 + 2 DDD digits + 9 + 8 digits = 13 digits total
  const mobile = phones.find(p => p.length === 13 && p[4] === '9');
  return mobile || phones[0];
}
