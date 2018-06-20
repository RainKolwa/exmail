import axios from "axios";

export default ({ method, url, ...opts }) =>
  axios({
    baseURL: "https://api.exmail.qq.com/cgi-bin/",
    method,
    url,
    ...opts
  });
