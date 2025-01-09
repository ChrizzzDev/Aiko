import { AikoOptions, CommandCategory } from '@lib/functions/Decorator';
import { Command, Declare, GroupsT, AutoLoad, Groups } from 'seyfert';

@Declare({
	name: 'developer',
	description: 'Developer commands.',
})
@AikoOptions({
	category: CommandCategory.Developer,
	onlyDeveloper: true,
})
@GroupsT({
	blacklist: {
		description: 'commands.dev.blacklist.description',
		defaultDescription: "Blacklist submodule's commands",
	},
})
@AutoLoad()
export default class extends Command {}
