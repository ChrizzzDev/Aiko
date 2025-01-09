import { createMiddleware } from 'seyfert';
import { EntityType } from '@prisma/client';

export default createMiddleware<void>(async ({ context, next, stop }) => {
	const entry = await (context.client.database.isInBlacklist(
		context.author.id,
	) || context.client.database.isInBlacklist(context.guildId!));

	const { errors } = await context.getLocale();

	if (entry.in) {
		entry.entity === EntityType.USER ?
			stop(errors.blacklist.user)
		:	stop(errors.blacklist.guild);
	}

	next();
});
