import * as express from "express";
import { Server } from "http";
import { readFileSync } from "fs";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as connectEnsureLogin from "connect-ensure-login";
import * as passport from "passport";
import {Strategy} from "passport-local";

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // The object req.body will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true)

app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: true,
  saveUninitialized: true}));
// Configure More Middleware

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy(
  function(username, password, done) {
    if(username === "karishma"){
      if(password === "ghiya"){
        console.log("success login");
        return done(null,{username:"karishma"});
      }
      else{
        console.log("incorrect pwd");
      return done(new Error("Incorrect password!"), false);
      }
    }
    else{
      console.log("incorrect username");
      return done(new Error("Username doesn't exist!"), false);
    }

  }
));
//logs every request
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Server:", req.url);
    next();
  }
);

// To use with sessions
passport.serializeUser(function(user){
  console.log(user);
  console.log(JSON.stringify(user,null,2));
 return JSON.stringify(user,null,2);
});
passport.deserializeUser(function(user){ return JSON.parse(user)});

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
   console.log("get login");
  const indexContent = readFileSync("./login.html", { encoding: "utf8" });
  res.send(indexContent);
});

app.post('/login', function(req, res, next) {
 passport.authenticate('local', function(err, user, info, status) {
  if (err) { return next(err) }
    if (!user) { 
      console.log(`This ${user} seems invalid!`);
      return res.redirect('/login') }
    res.redirect('/dashboard');
  })(req, res, next);
});

// TODO not-imp: for some reason this approach did not work. The login page was stuck.
// app.post('/login', passport.authenticate('local',{failureRedirect: '/login', successReturnToOrRedirect: '/dashboard'})); 

app.get('/dashboard', (req, res) => {
  console.log("get dashboard");
  res.send(`Hello! Your authentication was successful. Your session ID is ${req.sessionID} 
   and your session expires in ${req.session.cookie.maxAge} 
   milliseconds.<br><br>
   <a href="/logout">Log Out</a><br><br>
   <a href="/secret">Members Only</a>`);
});

app.get('/secret', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile(__dirname + './userSession.html');
});

app.get('/logout', function(req: express.Request, res: express.Response) {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Unable to log out')
      } else {
        res.send('Logout successful! Go back to login here - <a href="/login">Please Login Here!</a>')
      }
    });
  } else {
    res.end()
  }
});

app.get('/browserAuthenticate.js',connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile()
})
let server: Server | undefined = undefined;
server = app.listen(8080, () => {
  console.log(`Authorization code redirect server listening on port 8080`);
});

