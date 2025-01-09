import { unique } from 'es-next-tools';
import type { UsingClient } from 'seyfert';
import type { LocaleString } from 'seyfert/lib/types';
import { EntityType, type Blacklist, PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();
export class AikoDatabase {
	private client: UsingClient;
	public prisma: PrismaClient;

	public connected: boolean = false;

	constructor(client: UsingClient) {
		this.client = client;
		this.prisma = prismaClient;
	}

	public isConnected(): boolean {
		return this.connected;
	}

	public async connect(): Promise<void> {
		return this.prisma
			.$connect()
			.then(() => {
				this.connected = true;
				this.client.logger.info(
					'[🐬] Database - Aiko is now connected to the database.',
				);
			})
			.catch((err) => this.client.logger.error(`[🚨] Database - ${err}`));
	}

	public async getLocale(guildId: string): Promise<string> {
		const data = await this.prisma.guild.findUnique({
			where: { Id: guildId },
			select: { Locale: true },
		});

		return data?.Locale ?? this.client.config.defaultLocale;
	}

	public async getPrefix(guildId: string): Promise<string> {
		const data = await this.prisma.guild.findUnique({
			where: { Id: guildId },
			select: { Prefix: true },
		});

		return data?.Prefix ?? this.client.config.defaultPrefix;
	}

	public async setLocale(guildId: string, locale: LocaleString) {
		await this.prisma.guild.upsert({
			where: { Id: guildId },
			update: { Locale: locale },
			create: {
				Id: guildId,
				Locale: locale,
				Prefix: this.client.config.defaultPrefix,
			},
		});
	}

	public async setPrefix(
		guildId: string,
		prefix: string,
		patch: boolean = false,
	) {
		if (patch) {
			const data = await this.prisma.guild.findUnique({
				where: { Id: guildId },
				select: { Prefix: true },
			});

			const prefixes = unique([...(data?.Prefix ?? []), prefix]).join(', ');

			await this.prisma.guild.upsert({
				where: { Id: guildId },
				update: { Prefix: prefixes },
				create: {
					Id: guildId,
					Locale: this.client.config.defaultLocale,
					Prefix: prefixes,
				},
			});
		} else {
			await this.prisma.guild.upsert({
				where: { Id: guildId },
				update: { Prefix: prefix },
				create: {
					Id: guildId,
					Locale: this.client.config.defaultLocale,
					Prefix: prefix,
				},
			});
		}
	}

	public async isInBlacklist(
		entityId: string,
	): Promise<{ in: boolean; entity: EntityType }> {
		const entry = await this.prisma.blacklist.findFirst({
			where: {
				OR: [
					{
						EntityId: entityId,
						EntityType: EntityType.USER,
					},
					{
						EntityId: entityId,
						EntityType: EntityType.GUILD,
					},
				],
			},
		});

		return {
			in: entry !== null,
			entity: entry?.EntityType ?? EntityType.USER,
		};
	}

	public async getBlacklist(entityId: string): Promise<Blacklist | null> {
		const entry = await this.prisma.blacklist.findFirst({
			where: {
				OR: [
					{
						EntityId: entityId,
						EntityType: EntityType.USER,
					},
					{
						EntityId: entityId,
						EntityType: EntityType.GUILD,
					},
				],
			},
		});

		return entry;
	}

	public async setBlacklist(
		entityId: string,
		entityType: EntityType = EntityType.USER,
		reason?: string,
	) {
		const entry = await this.prisma.blacklist.upsert({
			where: {
				EntityId: entityId,
				EntityType: entityType,
			},
			update: {
				Reason: reason,
			},
			create: {
				EntityId: entityId,
				EntityType: entityType,
				Reason: reason,
			},
		});

		return entry !== null;
	}

	public async removeBlacklist(
		entityId: string,
		entityType: EntityType = EntityType.USER,
	): Promise<boolean> {
		const attempt = await this.prisma.blacklist.delete({
			where: {
				EntityId: entityId,
				EntityType: entityType,
			},
		});

		return attempt !== null;
	}
}
