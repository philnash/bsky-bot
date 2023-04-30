import Bot from "./lib/bot.js";
import getPostText from "./lib/getPostText.js";

const text = await Bot.run(getPostText, { dryRun: true });

console.log(`[${new Date().toISOString()}] Posted: "${text}"`);
