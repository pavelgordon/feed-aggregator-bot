require('dotenv').config()
const Telegraf = require('telegraf')
const RedisSession = require('telegraf-session-redis')

const bot = new Telegraf(process.env.BOT_TOKEN)
const session = new RedisSession({
  store: {
    host: process.env.TELEGRAM_SESSION_HOST || '127.0.0.1',
    port: process.env.TELEGRAM_SESSION_PORT || 6379,
    password: process.env.TELEGRAM_SESSION_PASSWORD
  }
})
 
bot.use(session)
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.on('text', (ctx) => {
  ctx.session.counter = ctx.session.counter || 0
  ctx.session.counter++
  return ctx.reply('Message counter:' + ctx.session.counter)
})
bot.launch()
