import { createEvent } from 'seyfert';

import { BOT_VERSION } from '@lib/constants';
import { changePresence } from '@lib/functions/presence';
import { join } from 'path';

export default createEvent({
	data: { name: 'botReady', once: true },
	run: async (user, client): Promise<void> => {
		client.readyTimestamp = Date.now();

		const clientName = `${user.username} v${BOT_VERSION}`;

		client.logger.info(`[⚙] API - Logged in as: ${user.username}`);
		client.logger.info(`[✨] Client - ${clientName} is now ready.`);

		await client.database.connect();
		await client.uploadCommands();

		changePresence(client);
	},
});
