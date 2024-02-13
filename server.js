const http = require("http");
const fs = require("fs");
const Microsite = require("./Microsite");

const microsite = new Microsite(
  "example.staging.web.wlloyalty.net",
  "CLIENT-ID-HERE"
);

async function requestHandler(request, response) {
  try {
    // request the WLL auth token
    const token = await microsite.requestAuthToken("USER-ID-HERE", {
      familyName: "Doe",
      givenName: "Jane",
      emailAddress: "jane.doe@example.com",
    });

    // set the token in a simple cookie for this parent website to read.
    response.setHeader("Set-Cookie", `WLLTOKEN=${token}`);
    // render the website as normal
    response.setHeader("Content-Type", "text/html");
    const template = fs.readFileSync("./page.html");
    const html = template
      .toString("utf8")
      .replace(
        /https:\/\/example.staging.web.wlloyalty.net/g,
        microsite.origin
      );

    response.end(html);
  } catch (error) {
    // render a simple error message
    response.setHeader("Content-Type", "text/plain");
    response.end("WLL Auth request failed:\n" + error.message);
  }
}

const port = 5000;
const server = http.createServer(requestHandler);

server.listen(port, () => {
  console.log(`Demo site availbable at http://localhost:${port}`);
});
