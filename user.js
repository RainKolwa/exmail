import axios from "axios";
import prompts from "prompts";
import api from "./api";
import config from "./config";
import store from "./store";

const { domain, defaultPassword } = config;

const questions = [
  {
    type: "text",
    name: "name",
    message: "What is your name?"
  },
  {
    type: "text",
    name: "userid",
    message: "What is your English name?"
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
    const response = await prompts(questions);
    const params = {
      department: [1],
      position: "",
      tel: "",
      extid: "",
      slaves: [],
      password: defaultPassword,
      cpwd_login: 1,
      ...response,
      userid: `${response.userid}@${domain}`
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
  }

  async delete() {
    const users = await this.list();
    const questions = users.map(user => ({
      title: `${user.name}-${user.userid}`,
      value: user.userid
    }));
    const form = await prompts([
      {
        type: "select",
        name: "user",
        message: "Select a user",
        choices: questions
      },
      {
        type: "select",
        name: "confirm",
        message: "Are you sure to delete?",
        choices: [{ title: "Yes", value: 1 }, { title: "No", value: 0 }]
      }
    ]);
    if (form.user && form.confirm) {
      // excute deletion
      const res = await api({
        method: "get",
        url: `user/delete?access_token=${store.accessToken}&userid=${form.user}`
      });
      if (res.data.errcode === 0) {
        console.log("Successfully deleted");
      } else {
        console.log(res.data.errmsg);
      }
    }
  }
}

export default User;
