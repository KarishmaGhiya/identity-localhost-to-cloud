import * as express from "express";
import { Server } from "http";

const app = express();
//logs every request
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Server:", req.url);
    next();
  }
);

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

let server: Server | undefined = undefined;
server = app.listen(8080, () => {
  console.log(`Authorization code redirect server listening on port 8080`);
});
function readFileSync(arg0: string, arg1: { encoding: string; }) {
    throw new Error("Function not implemented.");
}

