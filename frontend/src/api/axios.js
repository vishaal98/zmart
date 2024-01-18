import Axios from "axios";

function authRequestInterceptor(config) {
  const token = JSON.parse(localStorage.getItem("token"));

  config.headers.authorization = "Bearer " + token;
  // config.headers.Accept = "application/json";
  config.headers.Accept =
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";

  return config;
}
/* eslint-enable no-param-reassign */

const axios = Axios.create({
  baseURL: "http://127.0.0.1:8080/",
});

axios.interceptors.request.use(authRequestInterceptor);

export default axios;
