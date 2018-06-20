import axios from "axios";
import api from "./api";
import config from "./config";

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
  async create({ token }) {
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
      url: `user/create?access_token=${token}`,
      data: params
    });
    // Done
    if (res.data.errcode === 0) {
      console.log("Successfully created");
    } else {
      console.log(res.data);
    }
  }
}

export default User;
