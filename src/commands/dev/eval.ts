import {
	SubCommand,
	type CommandContext,
	Declare,
	Embed,
	Options,
	createIntegerOption,
	createStringOption,
	LocalesT,
	Group,
} from 'seyfert';

import { getDepth, randomArray, slice } from '@lib/functions/functions';

import {
	DeclareParserConfig,
	ParserRecommendedConfig,
	Watch,
	Yuna,
} from 'yunaforseyfert';
import { ms } from '@utils/Time';
import { EmbedColors, Formatter } from 'seyfert/lib/common';

const secretsRegex =
	/\b(?:client\.(?:config)|config|env|process\.(?:env|exit)|eval|atob|btoa)\b/;
const concatRegex = /".*?"\s*\+\s*".*?"(?:\s*\+\s*".*?")*/;

const options = {
	code: createStringOption({
		description: 'Code to evaluate.',
		locales: {
			description: 'commands.dev.eval.options.code',
		},
		required: true,
	}),

	depth: createIntegerOption({
		description: 'Depth.',
		locales: {
			description: 'commands.dev.eval.options.depth',
		},
	}),
};

@Declare({
	name: 'eval',
	aliases: ['ev'],
	description: 'Evaluate JavaScript code.',
	integrationTypes: ['GuildInstall'],
	contexts: ['Guild'],
})
@LocalesT(undefined, 'commands.dev.eval.description')
@DeclareParserConfig(ParserRecommendedConfig.Eval)
@Options(options)
export default class extends SubCommand {
	@Watch({
		idle: ms('1m'),
		beforeCreate(ctx) {
			const watcher = Yuna.watchers.find(ctx.client, {
				userId: ctx.author.id,
				command: this,
			});
			if (!watcher) return;

			watcher.stop('Another execution.');
		},
		onStop(reason) {
			this.ctx?.editOrReply({
				content: '',
				embeds: [
					{
						description: `\`🛑\` » Eval command ended by: \`${reason}\``,
					},
				],
			});
		},
	})
	public async run(ctx: CommandContext<typeof options>) {
		const { client, options, channelId } = ctx;
		const { errors, SECRET_MESSAGES } = await ctx.getLocale();

		const start = Date.now();
		const depth = options.depth;

		let code = options.code;
		let output = null;
		let typecode: any;

		await client.channels.typing(channelId);

		if (!code.length) {
			return ctx.write({
				embeds: [
					{
						description: errors.eval.missingArgs,
						color: EmbedColors.Red,
					},
				],
			});
		}

		try {
			if (
				secretsRegex.test(code.toLowerCase()) ||
				concatRegex.test(code.toLowerCase())
			)
				output = randomArray(SECRET_MESSAGES);
			else if (typeof output !== 'string') {
				if (/^(?:\(?)\s*await\b/.test(code.toLowerCase()))
					code = `(async () => ${code})();`;

				output = await eval(code);
				typecode = typeof output;
				output = getDepth(output, depth)
					.replaceAll(process.env.DISCORD_TOKEN!, '✨')
					.replaceAll(process.env.DISCORD_TOKEN_CANARY!, '✨')
					.replaceAll(process.env.DATABASE_URL!, '🐬');

				await ctx.editOrReply({
					embeds: [
						new Embed()
							.setColor(client.config.colors.green)
							.setDescription(
								`Code has been evaluated.\n\n${Formatter.codeBlock(slice(output, 1900), 'ts')}`,
							)
							.setThumbnail(client.me.avatarURL())
							.addFields(
								{
									name: '`📎` » Type',
									value: Formatter.codeBlock(typecode, 'ts'),
									inline: true,
								},
								{
									name: '',
									value: `\`${Math.floor(Date.now() - start)}ms\``,
									inline: true,
								},
								{
									name: '`📥` » Input',
									value: Formatter.codeBlock(slice(options.code, 1024), 'js'),
								},
							),
					],
				});
			}
		} catch (err) {
			if (err && err instanceof Error && err.message) {
				await ctx.editOrReply({
					embeds: [
						new Embed()
							.setTitle(errors.wrong)
							.setColor(client.config.colors.red)
							.setDescription(
								`**${err.name}**:\n${Formatter.codeBlock(slice(err.message, 1024), 'js')}`,
							),
					],
				});
			}
		}
	}
}
