import type { PermissionFlagsBits } from 'seyfert/lib/types';

export * from './AikoConfig';
export * from './CommandConfig';

export type PermissionNames = keyof typeof PermissionFlagsBits;
