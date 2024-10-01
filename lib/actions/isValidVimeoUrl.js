export const isValidVimeoUrl = (url) => {
  try {
    const vimeoBaseUrl = "https://player.vimeo.com/";
    return url.startsWith(vimeoBaseUrl);
  } catch (e) {
    return false;
  }
};
