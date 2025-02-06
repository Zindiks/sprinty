require("ts-node/register");
const knexConfig = require("./src/db/knexFile").default;

module.exports = knexConfig;
