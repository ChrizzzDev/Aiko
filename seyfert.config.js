const { config } = require('seyfert');

module.exports = config.bot({
  locations: {
    base: 'src',
    commands: 'commands',
    events: 'events',
    langs: 'languages'
  },
  token: Bun.argv.includes('--dev')
    ? Bun.env.DISCORD_TOKEN_CANARY
    : Bun.env.DISCORD_TOKEN,
  intents: 3276799,
  debug: Bun.argv.includes('--debug')
});