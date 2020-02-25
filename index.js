const http = require("http");
const https = require("https");
const fs = require("fs");

const MICROSITE_ORIGIN = "https://example.staging.web.wlloyalty.net";
const CLIENT_ID = "";

if (!MICROSITE_ORIGIN.length) {
  throw new Error("MICROSITE_ORIGIN must be set to your microsite domain");
} else if (MICROSITE_ORIGIN.includes("example.staging")) {
  throw new Error("MICROSITE_ORIGIN must be set to your microsite domain");
} else if (!CLIENT_ID.length) {
  throw new Error("CLIENT_ID must be set to your microsite client ID");
}

const server = http.createServer((request, response) => {
  // request the WLL auth token
  requestAuthToken("YOUR-UID-HERE", {
    familyName: "Doe",
    givenName: "Jane",
    emailAddress: "jane.doe@example.com",
  })
    .then(token => {
      // set the token in a simple cookie for this parent website to read.
      response.setHeader("Set-Cookie", `WLLTOKEN=${token}`);
      // render the website as normal
      response.setHeader("Content-Type", "text/html");
      const template = fs.readFileSync("./page.html");
      const html = template
        .toString("utf8")
        .replace(
          /https:\/\/example.staging.web.wlloyalty.net/g,
          MICROSITE_ORIGIN
        );
      response.end(html);
    })
    .catch(error => {
      // render a simple error message
      response.setHeader("Content-Type", "text/plain");
      response.end("WLL Auth request failed:\n" + error.message);
    });
});

server.listen(5000, () => {
  console.log("Demo site availbable at http://localhost:5000");
});

function requestAuthToken(uid, profile) {
  return new Promise((resolve, reject) => {
    const request = https.request(MICROSITE_ORIGIN + "/api/auth", {
      method: "POST",
      headers: { "X-Client-ID": CLIENT_ID, "Content-Type": "application/json" },
    });

    request.on("error", reject);
    request.on("response", response => {
      response.setEncoding("utf8");
      response.once("data", raw => {
        const { status, data } = JSON.parse(raw);
        if (status !== "success") reject(raw);
        resolve(data.session);
      });
    });

    const body = JSON.stringify({
      selector: { authIdentifier: uid },
      profile,
    });

    request.write(body);
    request.end();
  });
}
