import {
	Client,
	extendContext,
	type ClientOptions,
	type DefaultLocale,
} from 'seyfert';
import { ChannelType } from 'seyfert/lib/types';
import { DEBUG_MODE } from '@lib/constants';
import { Config } from '@lib/config';
import { AikoDatabase } from './AikoDatabase';
import { HandleCommand } from 'seyfert/lib/commands/handle';
import { Yuna } from 'yunaforseyfert';
import { unique } from 'es-next-tools';
import { CooldownManager } from '@cooldown';
import { middlewares } from '@/middlewares';
import type { AikoConfig } from '@typ/AikoConfig';
import { randomArray } from '@lib/functions/functions';

export const customContext = extendContext((i) => {
	return {
		getLocale: async (): Promise<DefaultLocale> =>
			i.client.t(await i.client.database.getLocale(i.guildId!)).get(),

		getLocaleString: async () => await i.client.database.getLocale(i.guildId!),
	};
});

export class Aiko extends Client<true> {
	public readonly config: AikoConfig = Config;
	public readonly database: AikoDatabase;
	public readyTimestamp: number = 0;
	public cooldown: CooldownManager;

	constructor(opts?: ClientOptions) {
		super({
			...opts,
			context: customContext,
			allowedMentions: {
				parse: ['roles', 'users'],
			},
			commands: {
				defaults: {
					async onPermissionsFail(context, permissions) {
						const { permissions: p } = await context.getLocale();

						try {
							context.message?.react(randomArray(['🛑', '❌', '⚠', '❗']));
						} catch {}

						return context.editOrReply({
							content: p.user(permissions),
						});
					},

					async onBotPermissionsFail(context, permissions) {
						const { permissions: p } = await context.getLocale();

						return context.editOrReply({
							content: p.bot(permissions),
						});
					},
				},
				prefix: async (message) => {
					if (message.guildId === null) return [this.config.defaultPrefix];
					const prefix = (await this.database.getPrefix(message.guildId!))
						.split(',')
						.map((p) => p.trim());
					return unique([
						...prefix,
						this.config.defaultPrefix,
						...this.config.prefixes,
					]);
				},
				reply: () => true,
			},
		});

		this.cooldown = new CooldownManager(this);
		this.database = new AikoDatabase(this);
		this.init();
	}

	public async init(): Promise<'✨'> {
		this.setServices({
			cache: {
				disabledCache: {
					stageInstances: true,
					stickers: true,
					bans: true,
					presences: true,
				},
			},
			handleCommand: class extends HandleCommand {
				override argsParser = Yuna.parser({
					logResult: DEBUG_MODE,
					useRepliedUserAsAnOption: {
						requirePing: true,
					},
				});

				override resolveCommandFromContent = Yuna.resolver({
					client: this.client,
					logResult: DEBUG_MODE,
				});
			},
			langs: {
				default: this.config.defaultLocale,
				aliases: {
					es: ['es-419', 'es-ES'],
					en: ['en-GB', 'en-US'],
				},
			},
			middlewares,
		});

		this.cache.channels!.filter = (channel) => {
			return ![ChannelType.DM, ChannelType.GroupDM].includes(channel.type);
		};

		await this.start();
		await this.database.connect();

		return '✨';
	}

	public async reload(): Promise<void> {
		this.logger.warn('[⚠] Attemping to reload...');

		try {
			await this.events.reloadAll();
			await this.commands.reloadAll();
			await this.components.reloadAll();
			await this.langs.reloadAll();

			this.logger.info('[✅] Aiko has been reloaded.');
		} catch (err) {
			this.logger.error(`[🚨] Error - ${err}`);
			throw err;
		}
	}
}
