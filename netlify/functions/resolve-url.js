const fetch = require("isomorphic-fetch");

const API_ENDPOINT = "https://api.soundcloud.com/resolve.json";

// resolve a soundcloud url
exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  if (!body.url || !body.access_token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing url" }),
    };
  }

  try {
    const response = await fetch(`${API_ENDPOINT}?url=${body.url}`, {
      headers: {
        Authorization: `OAuth ${body.access_token}`,
      },
    });

    const data = await response.json();

    if (data.errors) {
      console.log(data.errors);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed fetching data" }),
      };
    }
    return {
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        "Access-Control-Allow-Origin":
          "*" /* Required for cookies, authorization headers with HTTPS */,
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        data,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};
