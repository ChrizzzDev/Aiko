export interface Config {
	/**
	 * Only the bot owner can use the command
	 * @default false
	 */
	onlyDeveloper?: boolean;
	/**
	 * Only the guild owner can use the command
	 * @default false
	 */
	onlyGuildOwner?: boolean;
	/**
	 * The command category
	 * @default {CommandCategory.Unknown}
	 */
	category?: CommandCategory;
}

export enum CommandCategory {
	Unknown,
	General,
	Moderation,
	Configuration,
	Music,
	Fun,
	Utility,
	Owner,
	Developer,
}
