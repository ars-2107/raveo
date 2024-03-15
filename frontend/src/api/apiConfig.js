const apiConfig = {
  baseUrl: "https://api.themoviedb.org/3/",
  apiKey: process.env.REACT_APP_TMDB_API_KEY,
  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
  w200Image: (imgPath) => `https://image.tmdb.org/t/p/w200/${imgPath}`,
  w185Image: (imgPath) => `https://image.tmdb.org/t/p/w185/${imgPath}`,
  YOUTUBE_PATH: 'https://www.youtube.com/watch?v=',
  getYoutubeThumbnail: (key) =>
  `https://img.youtube.com/vi/${key}/mqdefault.jpg`,
};

export default apiConfig;