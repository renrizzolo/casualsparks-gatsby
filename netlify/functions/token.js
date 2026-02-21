const API_ENDPOINT = "https://secure.soundcloud.com/oauth/token";
const fetch = require("isomorphic-fetch");

let cachedData;
let expiryTime;

// gets an access_token for OAUTH requests
exports.handler = async (event, context) => {
  try {
    if (cachedData && expiryTime > Date.now()) {
      return {
        statusCode: 200,
        body: JSON.stringify({ data: cachedData, cached: true }),
      };
    }

    const client_id = process.env.SOUNDCLOUD_CLIENT_ID;
    const client_secret = process.env.SOUNDCLOUD_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      throw new Error("Missing SOUNDCLOUD_CLIENT_ID or SOUNDCLOUD_CLIENT_SECRET");
    }

    const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Accept": "application/json; charset=utf-8",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${auth}`
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    const data = await response.json();

    if (data.error || (data.code && data.code !== 200)) {
      console.error("SoundCloud API error:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed fetching data",
        }),
      };
    }

    cachedData = data;
    // Set expiry time (data.expires_in is in seconds)
    if (data.expires_in) {
      expiryTime = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer
    }

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600'
      },
      body: JSON.stringify({ data }),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
