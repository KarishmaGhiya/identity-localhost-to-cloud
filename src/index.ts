import * as express from "express";
import { Server } from "http";
import { readFileSync } from "fs";
import * as bodyParser from "body-parser";
import { verifyLogin } from "./loginVerification";
import * as session from "express-session";
import * as passport from "passport";
import * as connect-ensure-login from "connect-ensure-login";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
//logs every request
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Server:", req.url);
    next();
  }
);
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure More Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
/**
 * Endpoint that loads the index.js
 */
app.get("/index.js", async (req: express.Request, res: express.Response) => {
  const indexContent = readFileSync("./rollup/dist/index.js", {
    encoding: "utf8",
  });
  res.send(indexContent);
});

/**
 * Home URI
 */
app.get("/index", async (req: express.Request, res: express.Response) => {
  const indexContent = readFileSync("./index.html", { encoding: "utf8" });
  res.send(indexContent);
});

/**
 * Home URI
 */
 app.get("/login", async (req: express.Request, res: express.Response) => {
  const indexContent = readFileSync("./login.html", { encoding: "utf8" });
  res.send(indexContent);
});

app.post('/login', (req: express.Request, res: express.Response) => {
  // Insert Login Code Here
  let username = req.body.username;
  let password = req.body.password;
  res.send(verifyLogin(username,password));
});

let server: Server | undefined = undefined;
server = app.listen(8080, () => {
  console.log(`Authorization code redirect server listening on port 8080`);
});

