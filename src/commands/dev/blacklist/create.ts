import { EntityType } from '@prisma/client';
import {
	Options,
	Middlewares,
	SubCommand,
	CommandContext,
	Declare,
	LocalesT,
	createStringOption,
	Embed,
	Group,
} from 'seyfert';

const options = {
	entity: createStringOption({
		description: 'The entity to blacklist. (User or Guild)',
		required: true,
		locales: {
			description: 'commands.dev.blacklist.options.entity',
		},
	}),

	'entity-type': createStringOption({
		description: 'The entity type to blacklis, either user or guild.',
		choices: [
			{ name: 'user', value: EntityType.USER },
			{ name: 'guild', value: EntityType.GUILD },
		],
		locales: {
			description: 'commands.dev.blacklist.options.entity-type',
		},
	}),

	reason: createStringOption({
		description: 'The reason for blacklisting the entity.',
		locales: {
			description: 'commands.dev.blacklist.options.reason',
		},
	}),

	duration: createStringOption({
		description: 'The duration of the blacklist.',
		locales: {
			description: 'commands.dev.blacklist.options.duration',
		},
	}),
};

@Declare({
	name: 'create',
	aliases: ['add'],
	description: 'Create a new blacklist entry.',
})
@LocalesT(undefined, 'commands.dev.blacklist.create.description')
@Middlewares(['Verifications'])
@Options(options)
@Group('blacklist')
export default class extends SubCommand {
	async run(ctx: CommandContext<typeof options>) {
		const { commands, errors } = await ctx.getLocale();
		const database = ctx.client.database;
		const guild = await ctx.guild();

		const { entity, reason, duration } = ctx.options;
		let record = await database.isInBlacklist(entity);

		if (record.in) {
			return ctx.write({
				content: errors.blacklist.alreadyCreated,
			});
		}

		await database.setBlacklist(entity, ctx.options['entity-type'], reason);

		const create = commands.dev.blacklist.create;
		const content = await create.content({
			entity,
			reason,
			duration,
			database,
		});

		return ctx.write({
			embeds: [
				new Embed()
					.setTitle(create.title)
					.setColor('NotQuiteBlack')
					.setDescription(content.shift())
					.addFields(content),
			],
		});
	}
}
