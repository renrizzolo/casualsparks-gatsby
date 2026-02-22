export const API_BASE = "/.netlify/functions";

export const fetchWrapper = async (url, params, onError) => {
  try {
    const data = await fetch(url, params);
    const res = await data.json();
    return res;
  } catch (err) {
    console.error(err);
    onError && onError();
  }
};

export const getToken = async () => {
  try {
    const existingToken = localStorage.getItem("access_token");
    const expiry = localStorage.getItem("token_expiry");
    if (existingToken && expiry && expiry > Date.now()) return existingToken;

    const res = await fetchWrapper(`${API_BASE}/token`);
    if (!res) return;

    const { data } = res;

    if (!data || !data.access_token || data.error) {
      console.error(
        "Could not authenticate with SoundCloud:",
        data?.error || "No access token",
      );
      return;
    }

    const { access_token, expires_in } = data;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("token_expiry", Date.now() + expires_in * 1000);
    return access_token;
  } catch (err) {
    console.error("Error fetching SoundCloud token:", err);
  }
};
