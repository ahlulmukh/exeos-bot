const { v4: uuidv4 } = require("uuid");
module.exports = class generator {
  extensionId() {
    return `node:ext:${uuidv4()}`;
  }
};
