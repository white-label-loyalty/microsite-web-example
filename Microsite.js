const https = require("https");

class Microsite {
  /**
   *
   * @param {string} hostname - the URL hostname where your microsite is live
   * @param {string} clientId- your client ID, this is given to you by WLL
   */
  constructor(hostname, clientId) {
    if (!hostname.length) {
      throw new Error("Please set your microsite hostname.");
    } else if (hostname.includes("example.staging")) {
      throw new Error("Please set your own microsite hostname.");
    } else if (!clientId.length) {
      throw new Error("Please set your microsite client ID.");
    }

    this.clientId = clientId;
    if (hostname.includes("://")) {
      this.origin = hostname;
    } else {
      this.origin = "https://" + hostname;
    }
  }

  /**
   * Request an auth token from WLL to authenticate a specific user when loading the microsite.
   * @param {string} uid - the user ID as known to the integrating system
   * @param {Object} profile - the latest user profile data held by the integrating system
   * @param {string} profile.emailAddress - the user's email address
   * @param {string} profile.givenName - the user's given name
   * @param {string} profile.familyName - the user's family name (surname)
   * @param {"UNKNOWN"|"FEMALE"|"MALE"|"OTHER"} [profile.gender] - the user's gender
   * @param {string} [profile.birthdate] - the user's date of birth in yyyy-mm-dd format
   * @param {string} [profile.pictureUrl] - a URL to an image file which represents the user
   * @param {string} [profile.telephoneNumber] - the user's telephone number
   * @param {string} [profile.country] - the user's country in ISO 3166-1 alpha-2 format
   * @param {string} [profile.region] - the user's postal region in the UK this would be a county
   * @param {string} [profile.city] - the user's city
   * @param {string} [profile.postcode] - the user's postcode
   * @param {string} [profile.streetAddress] - the user's street address
   */
  requestAuthToken(uid, profile) {
    return new Promise((resolve, reject) => {
      const request = https.request(this.origin + "/api/auth", {
        method: "POST",
        headers: {
          "X-Client-ID": this.clientId,
          "Content-Type": "application/json",
        },
      });

      request.on("error", reject);
      request.on("response", (response) => {
        response.setEncoding("utf8");
        response.once("data", (raw) => {
          console.info("Auth response:", raw);
          try {
            const { status, data } = JSON.parse(raw);
            if (status !== "success") reject(data);
            resolve(data.session);
          } catch (error) {
            reject(error);
          }
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
}

module.exports = Microsite;
