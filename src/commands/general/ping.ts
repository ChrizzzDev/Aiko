import { Command, CommandContext, Declare, Embed } from 'seyfert';
import { Cooldown } from '@cooldown';
import { AikoOptions, CommandCategory } from '@lib/functions/Decorator';
import { ms } from '@utils/Time';

@Declare({
	name: 'ping',
	aliases: ['pong', 'p'],
	description: "Check Aiku's latency.",
})
@AikoOptions({
	category: CommandCategory.General,
})
@Cooldown({
	interval: ms('3s'),
	type: 'user',
	uses: {
		default: 2,
	},
})
export default class extends Command {
	async run(ctx: CommandContext) {
		const { colors } = ctx.client.config;
		const { commands } = await ctx.getLocale();

		const locale = await ctx.getLocaleString();
		const messageOrInteraction = ctx.message || ctx.interaction;

		const bot = ctx.client.latency | 0;
		const api =
			messageOrInteraction?.createdTimestamp ?
				Date.now() - messageOrInteraction.createdTimestamp
			:	0;

		const content = commands.ping(api, bot);
		const ms = Number(content.api.replaceAll(/\D/g, ''));
		let color;

		if (ms <= 100) color = colors.green;
		else if (ms <= 200) color = colors.yellow;
		else color = colors.red;

		return ctx.write({
			embeds: [
				new Embed()
					.setColor(color)
					// @ts-expect-error
					.setDescription(
						Object.keys(content)
							.map((key) => `${content[key]}`)
							.join('\n'),
					),
			],
			content: (locale === 'es' ? '¡Pong!' : 'Ping!') + ' 🏓',
		});
	}
}
