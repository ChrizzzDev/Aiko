import { readFile } from 'fs/promises';
import { join } from 'path';
import {
	ActivityType,
	type GatewayActivityUpdateData,
} from 'seyfert/lib/types';

export const pkg = JSON.parse(
	await readFile(join(process.cwd(), 'package.json'), 'utf-8'),
);

const argv = process.isBun ? Bun.argv : process.argv;

/**
 * Aiko's version.
 */
export const BOT_VERSION = pkg.version;

/**
 * Aiko's name. (I always forget it)
 */
export const BOT_NAME = 'Aiko Izuki';

/**
 * Checks if Aiko is running in debug mode.
 */
export const DEBUG_MODE = argv.includes('--debug');

/**
 * Checks if Aiko is running in dev mode.
 */
export const DEV_MODE = argv.includes('--dev');

/**
 * Aiko's presence activites.
 */
export const BOT_ACTIVITIES: GatewayActivityUpdateData[] = [
	{ name: 'Burnout 🔥', type: ActivityType.Listening }, // I like this album so much
	{ name: `v${BOT_VERSION}`, type: ActivityType.Watching },
	{ name: 'with {users} users.', type: ActivityType.Playing },
	{ name: 'in {guilds} guilds.', type: ActivityType.Playing },
];
