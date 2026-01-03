
export interface ApiKey {
  id: string;
  key: string;
  note: string;
  createdAt: number;
  expiresAt: number | null; // null means Lifetime
}

export interface GeneratorOptions {
  length: number;
  quantity: number;
  note: string;
  durationDays: number; // 0 means Lifetime
}

export type Tab = 'dashboard' | 'generate' | 'lua-setup' | 'simulate';
