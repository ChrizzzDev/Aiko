import { createMiddleware, Formatter } from 'seyfert';
import { TimestampStyle } from 'seyfert/lib/common';

const { timestamp } = Formatter,
	{ RelativeTime } = TimestampStyle;
export default createMiddleware<void>(async ({ context: ctx, next, pass }) => {
	if (ctx.isComponent()) return next();

	const inCooldown = ctx.client.cooldown.context(ctx);
	const locale = await ctx.client.database.getLocale(ctx.guildId!);

	if (typeof inCooldown !== 'boolean' && inCooldown.use !== true) {
		ctx.editOrReply({
			// @ts-expect-error
			content: ctx.t
				.get(locale)
				.errors.cooldown[
					inCooldown.type
				].replaceAll('{cooldown}', timestamp(new Date(Date.now() + inCooldown.use), RelativeTime)),
		});

		return pass();
	}

	return next();
});
