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
bot.start((ctx) => ctx.reply('Welcome! Send me a sticker'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears('add', (ctx) => ctx.reply('Forward message from a channel and I will sub it'))
bot.hears('del', (ctx) => {
	ctx.session.subscribed_channels = ctx.session.subscribed_channels || []
	ctx.reply('Select a channel to unsub: ' + 
		JSON.stringify(ctx.session.subscribed_channels.map(it=>it.title)))
})
bot.hears('list', (ctx) =>{
	console.log(ctx.message)
	ctx.reply('Channels ' + JSON.stringify(ctx.session.subscribed_channels))
})
bot.hears('flush', (ctx) => {
	console.log(ctx.message)
	ctx.session.subscribed_channels  = []
	ctx.reply('Removed all subs')
})

bot.on('forward', (ctx) => {
  console.log(ctx.message)
  if(!ctx.message.forward_from_chat
  	|| ctx.message.forward_from_chat.type != 'channel') 
  	ctx.reply('Forward message from channel please')
  ctx.session.subscribed_channels = ctx.session.subscribed_channels || []

  console.log(ctx.message)
  if (ctx.session.subscribed_channels.includes(ctx.message.forward_from_chat)){
  	  ctx.session.subscribed_channels = ctx.session.subscribed_channels
  	    .filter(item => item !== ctx.message.forward_from_chat)
  	  return ctx.reply('Unsubscribed on channel ' + 
  	  	JSON.stringify(ctx.message.forward_from_chat))
  	} else {
  	  ctx.session.subscribed_channels.push(ctx.message.forward_from_chat)
  	  return ctx.reply('Subscribed on channel ' + 
  	  	JSON.stringify(ctx.message.forward_from_chat))
  	}
  })

bot.launch()
