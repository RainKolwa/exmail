import prompts from "prompts";
import axios from "axios";
import config from "./config";
import api from "./api";
import User from "./user";

const { corpId, corpSecret } = config;

const getToken = async () => {
  const { data } = await api({
    method: "get",
    url: `gettoken?corpid=${corpId}&corpsecret=${corpSecret}`
  });
  console.log("token", data.access_token);
  return data.access_token;
};

const app = async () => {
  const token = await getToken();

  // create user
  const user = new User();
  user.create(token);
};

app();
