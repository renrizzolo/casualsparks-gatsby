const API_ENDPOINT = "https://api.soundcloud.com/oauth2/token";
const fetch = require("isomorphic-fetch");

let cachedData;

// gets an access_token for OAUTH requests
exports.handler = async (event, context) => {
  try {

    const { access_token, expires_at } = cachedData || {}
    if (access_token && (expires_at * 1000) < Date.now()) {
      return {
        statusCode: 200,
        body: JSON.stringify({ data: cachedData, cached: true }),
      };
    }

    console.log({
      grant_type: "client_credentials",
      client_id: process.env.SOUNDCLOUD_CLIENT_ID,
      client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    });
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SOUNDCLOUD_CLIENT_ID,
        client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET,
      }),
    });

    const data = await response.json();

    if (data.code && data.code !== 200) {
      console.log(data);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed fetching data",
        }),
      };
    }

    console.log("returning", data);
    cachedData = data;

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600'
      },
      body: JSON.stringify({ data }),
    };

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
