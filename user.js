import axios from "axios";
import prompts from "prompts";
import api from "./api";
import config from "./config";
import store from "./store";
import Menu from "./menu";

const { domain, defaultPassword } = config;

const CREATE_USER_FORM = () => [
  {
    type: "text",
    name: "name",
    message: "What is your name?"
  },
  {
    type: "text",
    name: "userid",
    message: "What is your English name?",
    format: val => `${val}@${domain}`
  },
  {
    type: "text",
    name: "mobile",
    message: "What is your phone number?"
  },
  {
    type: "select",
    name: "gender",
    message: "Pick a Gender",
    choices: [{ title: "Man", value: "1" }, { title: "Woman", value: "2" }]
  }
];

class User {
  async list() {
    const res = await api({
      method: "get",
      url: `user/simplelist?access_token=${
        store.accessToken
      }&department_id=1&fetch_child=1`
    });

    return res.data.userlist;
  }

  async create() {
    const response = await prompts(CREATE_USER_FORM());
    const params = {
      department: [1],
      position: "",
      tel: "",
      extid: "",
      slaves: [],
      password: defaultPassword,
      cpwd_login: 1,
      ...response
    };

    console.log("creating user...");
    const res = await api({
      method: "post",
      url: `user/create?access_token=${store.accessToken}`,
      data: params
    });
    // Done
    if (res.data.errcode === 0) {
      console.log("Successfully created");
    } else {
      console.log(res.data);
    }
    // 显示主菜单
    const menu = new Menu();
    menu.start();
  }

  async delete() {
    const users = await this.list();
    const questions = users.map(user => ({
      title: `${user.name}-${user.userid}`,
      value: user.userid
    }));
    const form = await prompts([
      {
        type: "autocomplete",
        name: "user",
        message: "Select a user",
        choices: questions,
        limit: 100
      },
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure to delete?"
      }
    ]);
    if (form.user && form.confirm) {
      const res = await api({
        method: "get",
        url: `user/delete?access_token=${store.accessToken}&userid=${form.user}`
      });

      if (res.data.errcode === 0) {
        console.log("Successfully deleted");
      } else {
        console.log(res.data.errmsg);
      }

      // 显示主菜单
      const menu = new Menu();
      menu.start();
    }
  }
}

export default User;
