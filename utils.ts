import { ApiKey } from './types';

// Characters allowed: a-z, 0-9
const CHARS_ALPHA = "abcdefghijklmnopqrstuvwxyz";
const CHARS_NUM = "0123456789";
const ALL_CHARS = CHARS_ALPHA + CHARS_NUM;

export const generateKeyString = (length: number = 15): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const char = ALL_CHARS.charAt(Math.floor(Math.random() * ALL_CHARS.length));
    
    // Logic: 50% chance to uppercase if it's a letter
    if (isNaN(parseInt(char, 10))) {
      // It's a letter
      if (Math.random() > 0.5) {
        result += char.toUpperCase();
      } else {
        result += char;
      }
    } else {
      // It's a number
      result += char;
    }
  }
  return result;
};

export const downloadKeys = (keys: ApiKey[]) => {
  const content = keys.map(k => {
    const exp = k.expiresAt ? new Date(k.expiresAt).toLocaleDateString() : 'Lifetime';
    return `Key: ${k.key} | Note: ${k.note || 'N/A'} | Expires: ${exp}`;
  }).join('\n');
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lua_auth_keys_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};