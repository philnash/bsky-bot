import { bskyAccount, bskyService } from "./config.js";
import type {
  AtpAgentLoginOpts,
  AtpAgentOptions,
  AppBskyFeedPost,
} from "@atproto/api";
import { AtpAgent, RichText } from '@atproto/api';

type BotOptions = {
  service: string | URL;
  dryRun: boolean;
};

export default class Bot {
  #agent;

  static defaultOptions: BotOptions = {
    service: bskyService,
    dryRun: false,
  } as const;

  constructor(service: AtpAgentOptions["service"]) {
    this.#agent = new AtpAgent({ service });
  }

  login(loginOpts: AtpAgentLoginOpts) {
    return this.#agent.login(loginOpts);
  }

  async post(
    text:
      | string
      | (Partial<AppBskyFeedPost.Record> &
          Omit<AppBskyFeedPost.Record, "createdAt">)
  ) {
    if (typeof text === "string") {
      const richText = new RichText({ text });
      await richText.detectFacets(this.#agent);
      const record = {
        text: richText.text,
        facets: richText.facets,
      };
      return this.#agent.post(record);
    } else {
      return this.#agent.post(text);
    }
  }

  static async run(
    getPostText: () => Promise<string>,
    botOptions?: Partial<BotOptions>
  ) {
    const { service, dryRun } = botOptions
      ? Object.assign({}, this.defaultOptions, botOptions)
      : this.defaultOptions;
    const bot = new Bot(service);
    await bot.login(bskyAccount);
    const text = await getPostText();
    if (!dryRun) {
      await bot.post(text);
    }
    return text;
  }
}
