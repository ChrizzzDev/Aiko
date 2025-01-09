import { inspect } from 'util';

export const randomArray = <T>(array: T[]) =>
	array[Math.floor(Math.random() * array.length)];

export const getDepth = (error: any, depth: number = 0) =>
	inspect(error, { depth });

export const slice = (string: string, limit: number = 100) =>
	string.length > limit ? `${string.slice(0, limit)}...` : string;
