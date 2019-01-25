export const appendQueryParam = (url, param, value) => {
  console.log(url, param, value);
  
  const U = parseURL(url);
  const regex = /\?(?:.*)$/;
  const chr = regex.test(U.search) ? '&' : '?';
  const result =
    U.protocol +
    '//' +
    U.host +
    U.port +
    U.pathname +
    U.search +
    chr +
    param +
    '=' +
    value +
    U.hash;

  return result;
}
let anchor;
export const parseURL = (url) => {
  const keys = 'protocol hostname host pathname port search hash href'.split(' ');
  if (!anchor) {
    anchor = document.createElement('a');
  }

  let result = {};

  anchor.href = url || '';

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i];
    result[key] = anchor[key];
  }

  return result;
}

export const fetchUrl = async (url) => {
  try {
    const data = await fetch(url);
    const res = await data.json();
    return res;
  } catch (err) {
    console.error(err);
  }
}