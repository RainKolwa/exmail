import prompts from "prompts";
import axios from "axios";
import config from "./config";
import api from "./api";
import store from "./store";
import Menu from "./menu";

const { corpId, corpSecret } = config;

const getToken = async () => {
  console.log("连接中...");
  const { data } = await api({
    method: "get",
    url: `gettoken?corpid=${corpId}&corpsecret=${corpSecret}`
  });
  if (data.errcode) {
    console.log("连接失败");
    console.log(data.errmsg);
    return false;
  } else {
    console.log("连接成功");
    store.accessToken = data.access_token;
    return data.access_token;
  }
};

const app = async () => {
  const token = await getToken();

  if (!token) return;

  // 显示主菜单
  const menu = new Menu();
  menu.start();
};

app();
