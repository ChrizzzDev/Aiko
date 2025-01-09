import { createMiddleware } from 'seyfert';

export default createMiddleware<void>(async ({ context: ctx, next, pass }) => {
	const { client, author, member, command } = ctx;
	const { devsId } = client.config;
	const guild = await ctx.guild();

	if (!(member && guild && command)) return pass();

	const { errors } = await ctx.getLocale();

	if (command.onlyDeveloper && !devsId.includes(author.id)) {
		ctx.editOrReply({ content: errors.onlyDev });
		return pass();
	}

	if (command.onlyGuildOwner && guild.ownerId !== author.id) {
		ctx.editOrReply({ content: errors.onlyOwner });
		return pass();
	}

	return next();
});
