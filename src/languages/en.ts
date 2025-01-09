import type { AikoDatabase } from '@classes/AikoDatabase';
import { CommandCategory, type PermissionNames } from '@typ/index';
import { slice } from '@lib/functions/functions';
import { ms } from '@utils/Time';
import { capitalize } from 'es-next-tools';
import { Formatter, type PermissionStrings } from 'seyfert';
import { TimestampStyle } from 'seyfert/lib/common';
import type { APIEmbedField } from 'seyfert/lib/types';

export default {
	metadata: {
		name: 'English',
		aliases: ['en'],
		emoji: '🇺🇸',
		translators: ['753158579053264907'],
	},
	commands: {
		dev: {
			blacklist: {
				description: "Blacklist submodule's commands.",
				create: {
					description: 'Create a new blacklist entry.',
					title: '`✅` - Blacklist Entry Created',
					content: async ({
						entity,
						duration,
						reason,
						database,
					}: IBL & { database: AikoDatabase }) => {
						const entityType = (await database.isInBlacklist(entity)).entity;
						return [
							`\`${capitalize(entityType)}\` has been added to blacklist.`,
							{
								name: '\`⌛\` » Duration',
								value:
									duration ?
										`${duration} (${Formatter.timestamp(new Date(Date.now() + ms(duration)), TimestampStyle.LongTime)})`
									:	'undetermined',
							},
							{
								name: '\`❓\` » Reason',
								value: reason ? slice(reason, 100) : 'No reason provided.',
							},
						] as string[] & APIEmbedField[];
					},
				},
				delete: 'Delete a blacklist entry.',
				list: 'List all blacklist entries.',
				edit: 'Edit a blacklist entry.',
				options: {
					entity: 'The entity to blacklist.',
					'entity-type': 'The entity type to blacklis, either user or guild.',
					reason: 'The reason for blacklisting the entity.',
					duration: 'The duration of the blacklist.',
				},
			},
			eval: {
				description: 'Evaluate JavaScript code.',
				invalid: '\`❌\` » Invalid code.',
				error: '\`❌\` » An error occurred while evaluating the code.',
				success: '\`✅\` » Code evaluated successfully.',
				options: {
					code: 'Code to evaluate.',
					depth: 'Depth.',
				},
			},
		},
		ping: (api: number, bot: number) => {
			return {
				api: `\`📡\` » **API Latency:** \`${api}ms\``,
				bot: `\`✨\` » **Bot Latency:** \`${bot}ms\``,
			};
		},

		setlocale: {
			invalid: ({ locale, available }: { locale: string; available: string }) =>
				`\`❌\` » The locale: ${locale} is invalid. Available locales: ${available}`,
			success: ({ locale }: { locale: string }) =>
				`\`✅\` » Guild locale set to: ${locale}`,
		},

		help: {
			noCommand: (command: string) => `\`❌\` » Command ${command} not found.`,
			noCategory: (category: string) =>
				`\`❌\` » Category ${category} not found.`,
			title: (clientName: string) => `${clientName} - Help Menu`,
			aliases: {
				[CommandCategory.General]: 'General',
				[CommandCategory.Fun]: 'Entertainment',
				[CommandCategory.Moderation]: 'Moderation',
				[CommandCategory.Utility]: 'Utility',
				[CommandCategory.Developer]: 'Developer',
				[CommandCategory.Owner]: 'Owner',
				[CommandCategory.Music]: 'Music',
				[CommandCategory.Unknown]: 'Unknown',
				[CommandCategory.Configuration]: 'Configuration',
			} satisfies Record<CommandCategory, string>,
		},
	},
	errors: {
		wrong: '`⚠` » Something went wrong.',
		blacklist: {
			user: '\`❌\` » You are blacklisted from using the bot.',
			guild: '\`❌\` » This server is blacklisted from using the bot.',
			alreadyCreated:
				'\`❌\` » This entity is already blacklisted from using the bot.',
		},

		eval: {
			missingArgs: '`❌` » Try typing some code...',
		},

		cooldown: {
			user: '\`⌛\` » You are on cooldown for this command. Try again in {cooldown}.',
			channel:
				'\`⌛\` » This command is on cooldown in this channel. Try again in {cooldown}.',
			global: '\`⌛\` » This command is on cooldown. Try again in {cooldown}.',
		},

		setlocale: {
			already: (locale: string) =>
				`\`✅\` » Locale ${locale} is already guild locale.`,
		},

		onlyDev: '\`❌\` » This command is only available for developers.',
		onlyOwner: '\`❌\` » This command is only available for the server owner.',
	},
	permissions: {
		list: {
			AddReactions: 'Add Reactions',
			Administrator: 'Administrator',
			AttachFiles: 'Attach Files',
			BanMembers: 'Ban Members',
			ChangeNickname: 'Change Nickname',
			Connect: 'Connect',
			CreateInstantInvite: 'Create Invites',
			CreatePrivateThreads: 'Create Private Threads',
			CreatePublicThreads: 'Create Public Threads',
			DeafenMembers: 'Deafen Members',
			EmbedLinks: 'Embed Links',
			KickMembers: 'Kick Members',
			ManageChannels: 'Manage Channels',
			ManageEvents: 'Manage Events',
			ManageGuild: 'Manage Server',
			ManageMessages: 'Manage Messages',
			ManageNicknames: 'Manage Nicknames',
			ManageRoles: 'Manage Roles',
			ManageThreads: 'Manage Threads',
			ManageWebhooks: 'Manage Webhooks',
			MentionEveryone: 'Mention Everyone',
			ModerateMembers: 'Moderate Members',
			MoveMembers: 'Move Members',
			MuteMembers: 'Mute Members',
			PrioritySpeaker: 'Priority Speaker',
			ReadMessageHistory: 'Read Message History',
			RequestToSpeak: 'Request To Speak',
			SendMessages: 'Send Messages',
			SendMessagesInThreads: 'Send Messages In Threads',
			SendTTSMessages: 'Send TTS Messages',
			Speak: 'Speak',
			Stream: 'Stream',
			UseApplicationCommands: 'Use Application Commands',
			UseEmbeddedActivities: 'Use Activities',
			UseExternalEmojis: 'Use External Emojis',
			UseExternalStickers: 'Use External Stickers',
			UseVAD: 'Use VAD',
			ViewAuditLog: 'View Audit Logs',
			ViewChannel: 'View Channel',
			ViewGuildInsights: 'View Guild Insights',
			ManageGuildExpressions: 'Manage Guild Expressions',
			ViewCreatorMonetizationAnalytics: 'View Creator Monetization Analytics',
			UseSoundboard: 'Use Sound Board',
			UseExternalSounds: 'Use External Sounds',
			SendVoiceMessages: 'Send Voice Messages',
			CreateEvents: 'Create Events',
			CreateGuildExpressions: 'Create Guild Expressions',
			SendPolls: 'Send Polls',
			UseExternalApps: 'Use External Apps',
		} satisfies Record<PermissionNames, string>,

		user: (permissions: PermissionStrings) =>
			`\`❌\` » Hey! You're not allowed to use this command. You need the following permissions: ${permissions}`,
		bot: (permissions: PermissionStrings) =>
			`\`⚠\` » Hey! I'm not allowed to use this command. I need the following permissions: ${permissions}`,
	},

	SECRET_MESSAGES: [
		"Hey! That's... secret.",
		"Hey, you can't see that!",
		"I won't let you see that...",
		'...',
		'I will restrict you if you keep doing that.',
		'ENOUGH!',
		'Dadada-dadada-dadada',
	],
};

export type IBL = {
	entity: string;
	reason?: string;
	duration?: string;
};
