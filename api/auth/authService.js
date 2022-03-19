const bcrypt = require("bcrypt");
const userService = require("../user/userService");
const logger = require("../../services/loggerService");

async function login(username, password) {
  logger.debug(`auth.service - login with username: ${username}`);

  const user = await userService.getByUsername(username);
  if (!user) return Promise.reject("Invalid username or password");
  // TODO: un-comment for real login + TODO DONT STORE PASSWORD AS PLAIN TXT IN DB
  // const match = await bcrypt.compare(password, user.password);
  const match = password === user.password;
  if (!match) return Promise.reject("Invalid username or password");

  delete user.password;
  return user;
}

module.exports = {
  login,
};
