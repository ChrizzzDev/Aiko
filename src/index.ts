import type { ParseClient, ParseLocales, ParseMiddlewares } from 'seyfert';
import English from './languages/en';
import { Aiko, customContext } from './classes/Aiko';
import { CooldownManager } from '@cooldown';
import type { Config } from '@typ/CommandConfig';
import { middlewares } from './middlewares';

new Aiko();

declare module 'seyfert' {
	interface RegisteredMiddlewares
		extends ParseMiddlewares<typeof middlewares> {}
	interface DefaultLocale extends ParseLocales<typeof English> {}
	interface ExtendContext extends ReturnType<typeof customContext> {}

	interface Command extends Config {}
	interface SubCommand extends Config {}
	interface ComponentCommand extends Config {}
	interface ModalCommand extends Config {}
	interface ContextMenuCommand extends Config {}
	interface EntryPointCommand extends Config {}

	interface UsingClient extends ParseClient<Aiko> {
		cooldown: CooldownManager;
	}

	interface InternalOptions {
		withPrefix: true;
	}
}
