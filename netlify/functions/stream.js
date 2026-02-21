const fetch = require("isomorphic-fetch");
const { https } = require("follow-redirects");
const url = require("url");

// gets a signed mp3 url
exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    if (!body.url || typeof body.url !== "string") {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Invalid url supplied" }),
      };
    }
    let res = await fetch(body.url, {
      headers: { 
        Accept: "application/json; charset=utf-8",
        Authorization: `OAuth ${body.access_token}` 
      },
    });

    if (res.status === 200 && res.headers.get("content-type").includes("application/json")) {
      const streams = await res.json();
      const streamUrl = streams.http_mp3_128_url || streams.preview_mp3_128_url;
      if (streamUrl) {
        res = await fetch(streamUrl, {
          headers: { 
            Authorization: `OAuth ${body.access_token}` 
          },
        });
      }
    }

    if (!res.url) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed fetching stream",
        }),
      };
    }
    return {
      headers: {
        /* Required for CORS support to work */
        "Access-Control-Allow-Origin":
          "*" /* Required for cookies, authorization headers with HTTPS */,
        "Access-Control-Allow-Credentials": true,
      },
      statusCode: 200,
      body: JSON.stringify({ url: res.url }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
