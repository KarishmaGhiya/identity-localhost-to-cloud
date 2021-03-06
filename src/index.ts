import * as express from "express";
import { Server } from "http";
import { readFileSync } from "fs";
import * as bodyParser from "body-parser";
import * as session from "express-session";
// import * as passport from "passport";
// import {Strategy} from "passport-local";
import * as path from "path";
import { AuthorizationCodeCredential } from "@azure/identity";
import {setLogLevel} from "@azure/logger";
import * as dotenv from "dotenv";
// Initialize the environment
dotenv.config();
const app = express();

//app.use(bodyParser.urlencoded({ extended: false })); // The object req.body will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true)
app.use(bodyParser.json());
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: true,
  saveUninitialized: true}));
// Configure More Middleware

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new Strategy(
//   function(username, password, done) {
//     if(username === "karishma"){
//       if(password === "ghiya"){
//         console.log("success login");
//         return done(null,{username:"karishma"});
//       }
//       else{
//         console.log("incorrect pwd");
//       return done(new Error("Incorrect password!"), false);
//       }
//     }
//     else{
//       console.log("incorrect username");
//       return done(new Error("Username doesn't exist!"), false);
//     }

//   }
// ));

//logs every request
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Server:", req.url);
    next();
  }
);

// To use with sessions
// passport.serializeUser(function(user){
//   console.log(user);
//   console.log(JSON.stringify(user,null,2));
//  return JSON.stringify(user,null,2);
// });
// passport.deserializeUser(function(user){ return JSON.parse(user)});

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
console.log(req.body);
  if(req.body.username === "karishma"){
    if(req.body.password === "ghiya"){
      console.log("success login");
      (req.session as any).user = '{username:"karishma"}';
      res.send({"success": true});
    }
    else{
      console.log("incorrect pwd");
      res.status(401).send({errorMessage: "Incorrect password!"});
    }
  }
  else{
    console.log("incorrect username");
    res.status(401).send({errorMessage: "Username doesn't exist!"});
  }

//  passport.authenticate('local', function(err, user, info, status) {
//    console.log(user);
//    if(user){
//     (req.session as any).user = user;
//     res.redirect('/dashboard');
//    }
//   if (err) { return next(err) }
//   if (!user) { 
//     console.log(`This ${user} seems invalid!`);
//     return res.redirect('/login') 
//   }    
//   })(req, res, next);
});

// app.post('/login', passport.authenticate('local',{}));

// TODO not-imp: for some reason this approach did not work. The login page was stuck.
// app.post('/login', passport.authenticate('local',{failureRedirect: '/login', successReturnToOrRedirect: '/dashboard'})); 

app.get('/dashboard', (req, res) => {
  console.log((req.session as any).user);
  if(!(req.session as any).user){
    return res.redirect('/login');
  }
  console.log("get dashboard");
  res.send(`Hello! Your authentication was successful. Your session ID is ${req.sessionID} 
   and your session expires in ${req.session.cookie.maxAge} 
   milliseconds.<br><br>
   <a href="/logout">Log Out</a><br><br>
   <a href="/secret">Members Only</a>`);
});

app.get('/secret', (req, res) => {
  if(!(req.session as any).user){
    return res.redirect('/login');
  }
  res.sendFile(path.resolve("./userSession.html"));
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

app.get('/browserAuthenticate.js', (req, res) => {
  const browserPath = path.resolve(path.join(__dirname, '/../bundledBrowserCode'));
  res.sendFile(browserPath +'/dist/index.js');
});

app.get("/azureRedirect", async(req: any, res: any) => {
  // The redirect will either contain a "code" or an "error"
  const authorizationCode = req.query["code"];
  setLogLevel("verbose");
  console.log(`authorization code = ${authorizationCode}`);
  //for auth code cred, we need web for registering the redirect URIs
  console.log(process.env.CLIENT_SECRET);
   //"04b07795-8ddb-461a-bbee-02f9e1bf7b46", // the default public cleint id
   // "747a3a69-568f-4d40-9e9c-8f21472f246e", // type web
  const authCred = new AuthorizationCodeCredential(
    "27029f03-7c64-4ef6-88e4-14539e6c8d8c",
    "ed0e15fd-bb43-44e2-8d9c-b9c9758e0a46", //type public client
    authorizationCode,
    "http://localhost:8080/azureRedirect")
  try{
    const result = await authCred.getToken("https://graph.microsoft.com/.default");
    console.log(result);
    res.send("Ok");
  }
  catch(e){
 console.error(e);
 res.send("not-ok");
  }


});

let server: Server | undefined = undefined;
server = app.listen(8080, () => {
  console.log(`Authorization code redirect server listening on port 8080`);
});

