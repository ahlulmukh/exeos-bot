const axios = require("axios");
const chalk = require("chalk");
const { getProxyAgent } = require("./proxy");
const UserAgent = require("user-agents");
const { logMessage } = require("../utils/logger");
const userAgent = new UserAgent().toString();

module.exports = class exeosBot {
  constructor(account, proxy = null, currentNum, total) {
    this.currentNum = currentNum;
    this.total = total;
    this.account = account;
    this.proxy = proxy;
    this.axiosConfig = {
      ...(this.proxy && { httpsAgent: getProxyAgent(this.proxy) }),
      timeout: 120000,
      headers: {
        "User-Agent": userAgent,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        Origin: "chrome-extension://ijapofapbjjfegefdmhhgijgkillnogl",
      },
    };
  }

  async makeRequest(method, url, config = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios({
          method,
          url,
          ...this.axiosConfig,
          ...config,
        });
        return response;
      } catch (error) {
        logMessage(
          this.currentNum,
          this.total,
          `Request Failed ${error.message}`,
          "error"
        );
        logMessage(
          this.currentNum,
          this.total,
          `Retrying... (${i + 1}/${retries})`,
          "process"
        );
        await new Promise((resolve) => setTimeout(resolve, 12000));
      }
    }
    return null;
  }

  async statsNode(extensionId) {
    logMessage(
      this.currentNum,
      this.total,
      "Trying Register ExtensionId...",
      "process"
    );
    const headers = {
      Authorization: `Bearer ${this.account.token}`,
    };

    const payload = {
      extensionId: extensionId,
    };

    try {
      const response = await this.makeRequest(
        "POST",
        "https://api.exeos.network/extension/stats",
        { data: payload, headers: headers }
      );
      if (response.data.status === "success") {
        logMessage(
          this.currentNum,
          this.total,
          "Successfully registered extensionId!",
          "success"
        );
        return response.data;
      }
      return null;
    } catch (error) {
      logMessage(
        this.currentNum,
        this.total,
        `Failed to get stats: ${error.message}`,
        "error"
      );
      return null;
    }
  }

  async connectNode(ip, extensionId) {
    logMessage(this.currentNum, this.total, "Connecting to node...", "process");
    const headers = {
      Authorization: `Bearer ${this.account.token}`,
    };

    const payload = {
      ip: ip,
      extensionId: extensionId,
    };

    try {
      const response = await this.makeRequest(
        "POST",
        "https://api.exeos.network/extension/connect",
        { data: payload, headers: headers }
      );
      if (response.data.status === "success") {
        logMessage(
          this.currentNum,
          this.total,
          "Successfully connected to node!",
          "success"
        );
        return response.data;
      }
      return null;
    } catch (error) {
      logMessage(
        this.currentNum,
        this.total,
        `Failed to connect: ${error.message}`,
        "error"
      );
      return null;
    }
  }

  async liveNessCheck(extensionId) {
    logMessage(
      this.currentNum,
      this.total,
      "Checking live-ness Check...",
      "process"
    );
    const headers = {
      Authorization: `Bearer ${this.account.token}`,
    };

    const payload = {
      extensionId: extensionId,
    };

    try {
      const response = await this.makeRequest(
        "POST",
        "https://api.exeos.network/extension/liveness",
        { data: payload, headers: headers }
      );
      if (response.data.status === "success") {
        return response.data;
      }
      return null;
    } catch (error) {
      logMessage(
        this.currentNum,
        this.total,
        `Failed to check live-ness: ${error.message}`,
        "error"
      );
      return null;
    }
  }

  async singleProsess(ip, extensionId) {
    logMessage(this.currentNum, this.total, "Processing account...", "process");
    await this.statsNode(extensionId);
    const connectNode = await this.connectNode(ip, extensionId);
    if (!connectNode) {
      return;
    }
    const checkLiveNess = async () => {
      try {
        const liveNessCheck = await this.liveNessCheck(extensionId);
        if (liveNessCheck) {
          logMessage(
            this.currentNum,
            this.total,
            "Successfully checked live-ness!",
            "success"
          );
          console.log(chalk.white("-".repeat(85)));
          logMessage(
            this.currentNum,
            this.total,
            `Uptime: ${liveNessCheck.updatedData.nodeExtension.uptimeTotal}`,
            "success"
          );
          logMessage(
            this.currentNum,
            this.total,
            `Today Reward: ${liveNessCheck.updatedData.nodeExtension.todayRewards}`,
            "success"
          );
          logMessage(
            this.currentNum,
            this.total,
            `Total Reward: ${liveNessCheck.updatedData.nodeExtension.totalRewards}`,
            "success"
          );
          logMessage(
            this.currentNum,
            this.total,
            `Is Active : ${liveNessCheck.updatedData.nodeExtension.isActive}`,
            "success"
          );
          console.log(chalk.white("-".repeat(85)));
        }
      } catch (error) {
        logMessage(
          this.currentNum,
          this.total,
          `Error during Livenesscheck: ${error.message}`,
          "error"
        );
      } finally {
        setTimeout(checkLiveNess, 60000);
      }
    };
    checkLiveNess();
  }
};
