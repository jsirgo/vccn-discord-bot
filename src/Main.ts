import { Bot } from './Bot'
import auth from './config/auth.json';

const bot: Bot = new Bot(auth.token);
bot.start();