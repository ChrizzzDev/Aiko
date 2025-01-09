import type { PermissionStrings } from 'seyfert';

export type AikoConfig = {
	defaultPrefix: string;
	defaultLocale: string;
	prefixes: string[];
	devsId: string[];
	guildsIds: string[];
	channels?: string[];
	colors: Color;
	// Essencial permissions
	permissions: PermissionStrings;
};

type Color = {
	[key: string]: `#${string}`;
};
