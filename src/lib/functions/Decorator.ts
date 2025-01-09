import type { BaseCommand } from 'seyfert';
import type { Config } from '@typ/CommandConfig';
export { CommandCategory } from '@typ/CommandConfig';

type NonCommandOptions = Omit<Config, 'category'>;
type Instantiable<T> = new (...arg: any[]) => T;

export function AikoOptions<T extends Instantiable<any>>(
	options: T extends Instantiable<BaseCommand> ? Config : NonCommandOptions,
) {
	return (target: T) => {
		class DecoratorClass extends target {
			constructor(...args: any[]) {
				super(...args);
				Object.assign(this, options);
			}
		}
	};
}
