import prompts from "prompts";
import axios from "axios";
import config from "./config";
import api from "./api";
import User from "./user";
import store from "./store";
import Department from "./department";

const { corpId, corpSecret } = config;

const MENU = [
  {
    type: "select",
    name: "menu",
    message: "What can I do for you?",
    choices: [
      { title: "User management", value: "1" },
      { title: "Department management", value: "2" }
    ]
  },
  {
    type: "select",
    name: "submenu",
    message: "And?",
    choices: prev =>
      prev === "1"
        ? [
            { title: "Create user", value: "11" },
            { title: "Delete user", value: "12" }
          ]
        : [
            { title: "Create department", value: "21" },
            { title: "Delete department", value: "22" }
          ]
  }
];

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
  const res = await prompts(MENU);
  let user;
  let department;
  const { menu, submenu } = res || {};
  if (menu === "1") {
    user = new User();
  } else {
    department = new Department();
  }

  switch (submenu) {
    case "11":
      user.create();
      return false;
    case "12":
      user.delete();
      return false;
    case "21":
      department.create();
      return false;
    case "22":
      department.delete();
      return false;
    default:
      return false;
  }
};

app();
