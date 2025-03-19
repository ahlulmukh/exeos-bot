const exeosBot = require("./main/exeosBot");
const chalk = require("chalk");
const generator = new (require("./utils/generator"))();
const { getRandomProxy, loadProxies } = require("./main/proxy");
const fs = require("fs");
const { logMessage, prompt } = require("./utils/logger");

async function main() {
  console.log(
    chalk.cyan(`
░█▀▀░█░█░█▀▀░█▀█░█▀▀
░█▀▀░▄▀▄░█▀▀░█░█░▀▀█
░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀▀▀
    By : El Puqus Airdrop
    github.com/ahlulmukh
 Use it at your own risk
  `)
  );

  try {
    const accounts = JSON.parse(fs.readFileSync("accounts.json", "utf8"));
    const aw = await prompt(
      chalk.yellow("Wanna add new extension Id? (y/n): ")
    );
    if (aw.toLowerCase() === "y") {
      const num = parseInt(
        await prompt(
          chalk.yellow("How many extension Ids do you want to add? ")
        )
      );
      if (!isNaN(num) && num > 0) {
        for (let i = 0; i < accounts.length; i++) {
          for (let j = 0; j < num; j++) {
            accounts[i].extensionId.push(generator.extensionId());
          }
        }
        fs.writeFileSync(
          "accounts.json",
          JSON.stringify(accounts, null, 4),
          "utf8"
        );
        console.log(
          chalk.green(`Successfully added ${num} extension Ids to each account`)
        );
      } else {
        console.log(
          chalk.red(
            "Invalid number, please run the bot again to add extension Ids"
          )
        );
      }
    } else {
      console.log(chalk.green("Ok, let's continue"));
    }

    const count = accounts.length;
    const proxiesLoaded = loadProxies();
    if (!proxiesLoaded) {
      logMessage(
        null,
        null,
        "Failed to load proxies, using default IP",
        "error"
      );
    }

    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      try {
        console.log(chalk.white("-".repeat(85)));
        const extensionIds = account.extensionId;
        for (let j = 0; j < extensionIds.length; j++) {
          const currentProxy = await getRandomProxy();
          const ex = new exeosBot(account, currentProxy.proxy, i + 1, count);
          console.log(chalk.green(`Using proxy ip: ${currentProxy.ip}`));
          await ex.singleProsess(currentProxy.ip, extensionIds[j]);
        }
      } catch (error) {
        logMessage(
          null,
          null,
          `Failed to process account: ${error.message}`,
          "error"
        );
      }
    }
  } catch (error) {
    logMessage(null, null, `Main process failed: ${error.message}`, "error");
  }
}

main();
