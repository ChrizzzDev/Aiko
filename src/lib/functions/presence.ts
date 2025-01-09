import type { UsingClient } from 'seyfert';

import { PresenceUpdateStatus } from 'seyfert/lib/types';

import { BOT_ACTIVITIES } from '../constants';
import { randomArray } from '@lib/functions/functions';
import { ms } from '@utils/Time';

export function changePresence(client: UsingClient) {
	setInterval(() => {
		const guilds = client.cache.guilds!.count();
		const users = client.cache.users!.count();

		const randomActivity = randomArray(BOT_ACTIVITIES);

		client.gateway.setPresence({
			afk: false,
			since: Date.now(),
			status: PresenceUpdateStatus.Online,
			activities: [
				{
					...randomActivity,
					name: randomActivity.name
						.replaceAll('{guilds}', guilds.toString())
						.replaceAll('{users}', users.toString()),
				},
			],
		});
	}, ms('35s'));

	client.gateway.setPresence({
		activities: [BOT_ACTIVITIES[0]],
		afk: false,
		since: Date.now(),
		status: PresenceUpdateStatus.Online,
	});
}
