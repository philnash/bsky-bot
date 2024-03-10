# Build your own Bluesky bot 🦋

This is a template repo for building [Bluesky](https://bsky.app/) bots that post on their own schedule. It uses [TypeScript](https://www.typescriptlang.org/) to build the bot and [GitHub Actions](https://docs.github.com/en/actions) to schedule the posts.

* [How to use](#how-to-use)
  * [Things you will need](#things-you-will-need)
    * [A Bluesky account](#a-bluesky-account)
    * [Node.js](#nodejs)
  * [Create a new repository from this template](#create-a-new-repository-from-this-template)
  * [Running locally to test](#running-locally-to-test)
  * [Create your own posts](#create-your-own-posts)
  * [Deploy](#deploy)
    * [Schedule](#schedule)
    * [Environment variables](#environment-variables)
  * [Set it live](#set-it-live)


## How to use

### Things you will need

#### A Bluesky account

To use this repo you will need a [Bluesky account](https://bsky.app/). [Sign up for an invite here](https://bsky.app/).

Once you have an account for your bot, you will need to know your bot's handle and password (I recommend using an App Password, which you can create under your account's settings).

#### Node.js

To run this bot locally on your own machine you will need [Node.js](https://nodejs.org/en) version 18.16.0.

### Create a new repository from this template

Create your own project by clicking "Use this template" on GitHub and then "Create a new repository". Select an owner and give your new repository a name and an optional description. Then click "Create repository from template".

Clone your new repository to your own machine.

```sh
git clone git@github.com:${YOUR_USERNAME}/${YOUR_REPO_NAME}.git
cd ${YOUR_REPO_NAME}
```

### Running locally to test

To run the bot locally you will need to install the dependencies:

```sh
npm install
```

Copy the `.env.example` file to `.env`.

```sh
cp .env.example .env
```

Fill in `.env` with your Bluesky handle and password.

Build the project with:

```sh
npm run build
```

You can now run the bot locally with the command:

```sh
npm run dev
```

This will use your credentials to connect to Bluesky, but it *won't actually create a post yet*. If your credentials are correct, you should see the following printed to your terminal:

```
[TIMESTAMP] Posted: "Hello from the Bluesky API"
```

To have the bot create a post to your Bluesky account, in `index.ts` change line 4 to remove the `{ dryRun: true }` object:

```diff
- const text = await Bot.run(getPostText, { dryRun: true });
+ const text = await Bot.run(getPostText);
```

Build the project again, then run the command to create a post to actually create the post with the API:

```sh
npm run build
npm run dev
```

### Create your own posts

Currently the bot calls on the function [`getPostText`](./src/lib/getPostText.ts) to get the text that it should post. This function returns the text "Hello from the Bluesky API" every time.

To create your own posts you need to provide your own implementation of `getPostText`. You can do anything you want to generate posts, the `getPostText` function just needs to return a string or a Promise that resolves to a string.

### Deploy

Once you have built your bot, the only thing left to do is to choose the schedule and set up the environment variables in GitHub Actions.

#### Schedule

The schedule is controlled by the GitHub Actions workflow in [./.github/workflows/post.yml](./.github/workflows/post.yml). The [schedule trigger](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) uses cron syntax to schedule when the workflow runs and your bot posts. [Crontab Guru](https://crontab.guru/) is a good way to visualise it.

For example, the following YAML will schedule your bot to post at 5:30 and 17:30 every day.

```yml
on:
  schedule:
    - cron: "30 5,17 * * *"
```

Be warned that many GitHub Actions jobs are scheduled to happen on the hour, so that is a busy time and may see your workflow run later than expected or be dropped entirely.

#### Environment variables

In your repo's settings, under *Secrets and variables* > *Actions* you need to enter two Secrets to match your `.env` file. One secret should be called `BSKY_HANDLE` and contain your Bluesky username, and the other should be called `BSKY_PASSWORD` and contain your App Password that you generated for the bot account.

### Set it live

Once the schedule is set up and your Environment variables configured, push your changes to your repo and wait for the schedule to trigger the workflow. Your bot will start publishing posts based on your code.

If you have any issues with that, please [raise an issue in this repo](https://github.com/philnash/bsky-bot/issues) or send me a message on Bluesky [@philna.sh](https://staging.bsky.app/profile/philna.sh).
