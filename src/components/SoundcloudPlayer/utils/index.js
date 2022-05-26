export const API_BASE = '/.netlify/functions';

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
  const existingToken = localStorage.getItem('access_token');
  const expiry = localStorage.getItem('token_expiry');
  if (existingToken && expiry && expiry > Date.now()) return existingToken;

  const res = await fetchWrapper(`${API_BASE}/token`);
  if (!res) return;

  const { data } = res;

  const { access_token, expires_in, refresh_token, error } = data;

  console.log(access_token, expires_in, refresh_token);
  if (!access_token || error) {
    this.setState({
      error: error ?? 'Could not authenticate with SoundCloud.',
    });
    return;
  }

  localStorage.setItem('access_token', access_token);
  localStorage.setItem('token_expiry', Date.now() + expires_in * 1000);
};
