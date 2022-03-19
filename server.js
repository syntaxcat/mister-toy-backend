const express = require("express");
const cors = require("cors");
const path = require("path");
const expressSession = require("express-session");

const app = express();
const http = require("http").createServer(app);

// session setup
const session = expressSession({
  secret: "coding is amazing",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

// Express App Config
app.use(express.json());
app.use(session);
app.use(express.static("public"));

if (process.env.NODE_ENV === "production") {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, "public")));
} else {
  // Configuring CORS

  const corsOptions = {
    // Make sure origin contains the url your frontend is running on
    origin: [
      "http://127.0.0.1:3030",
      "http://localhost:3030",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

const authRoutes = require("./api/auth/authRoutes");
const userRoutes = require("./api/user/userRoutes");
const toyRoutes = require("./api/toy/toyRoutes");

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/toy", toyRoutes);

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there
app.get("/**", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const logger = require("./services/loggerService");
const port = process.env.PORT || 3030;
http.listen(port, () => {
  logger.info("Server is running on port: " + port);
});
