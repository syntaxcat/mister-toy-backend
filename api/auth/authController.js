const authService = require("./authService");
const logger = require("../../services/loggerService");

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await authService.login(username, password);
    req.session.user = user;
    res.json(user);
  } catch (err) {
    logger.error("Failed to Login " + err);
    res.status(401).send({ err: "Failed to Login" });
  }
}

async function logout(req, res) {
  try {
    req.session.destroy();
    res.send({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).send({ err: "Failed to logout" });
  }
}

module.exports = {
  login,
  logout,
};
