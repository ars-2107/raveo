import axiosClient from "./axiosClient";
import apiConfig from "./apiConfig";

export const category = {
  movie: "movie",
  tv: "tv",
  all: "all",
};

export const movieType = {
  popular: "popular",
  top_rated: "top_rated",
  upcoming: 'upcoming',
};

export const tvType = {
  popular: 'popular',
  top_rated: 'top_rated',
  on_the_air: 'on_the_air',
};

const apiType = {
  getTrendingList: (cate, time, params) => {
    const url = "trending/" + category[cate] + "/" + time + "?api_key=" + apiConfig.apiKey;
    return axiosClient.get(url, params);
  },

  getMoviesList: (type, params) => {
    const url = "movie/" + movieType[type];
    return axiosClient.get(url, params);
  },

  getTvList: (type, params) => {
    const url = "tv/" + tvType[type];
    return axiosClient.get(url, params);
  },

  getGenresList: () => {
    const url = "genre/movie/list";
    return axiosClient.get(url, { params: {} });
  },

  getExploreList: (cate, pageNum, filters) => {
    const url = "discover/" + category[cate] + "?page=" + pageNum + "?api_key=" + apiConfig.apiKey + filters;
    return axiosClient.get(url, { params: {} });
  },

  getVideos: (cate, id) => {
    const url = category[cate] + "/" + id + "/videos";
    return axiosClient.get(url, { params: {} });
  },

  searchResults: (keyword, page) => {
    const url = "search/multi?api_key=" + apiConfig.apiKey + "&query=" + keyword + "&page=" + page;
    return axiosClient.get(url);
  },

  detail: (cate, id, params) => {
    const url = category[cate] + "/" + id;
    return axiosClient.get(url, params);
  },

  credits: (cate, id) => {
    const url = category[cate] + "/" + id + "/credits";
    return axiosClient.get(url, { params: {} });
  },

  similar: (cate, id) => {
    const url = category[cate] + "/" + id + "/similar";
    return axiosClient.get(url, { params: {} });
  },

  person: (id, params) => {
    const url = "person/" + id;
    return axiosClient.get(url, params);
  },

  personCredits: (id, params) => {
    const url = "person/" + id +"/credits";
    return axiosClient.get(url, params);
  },
  
};

export default apiType;