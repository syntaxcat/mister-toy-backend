const logger = require("../services/loggerService");

async function requireAuth(req, res, next) {
  console.log("@@@@@@");
  console.log(req.session.user);
  if (!req.session || !req.session.user) {
    res.status(401).end("Unauthorized!");
    return;
  }
  next();
}

async function requireAdmin(req, res, next) {
  const user = req.session.user;
  if (!user.isAdmin) {
    logger.warn(user.fullname + " Attempt to perform admin action");
    res.status(403).end("Unauthorized Enough..");
    return;
  }
  next();
}

// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin,
};
