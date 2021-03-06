import axios from "axios";
import prompts from "prompts";
import JSONbig from "json-bigint";
import api from "./api";
import config from "./config";
import store from "./store";
import Menu from "./menu";

const { domain, defaultPassword } = config;

const CREATE_DEPARTMENT_FORM = () => [
  {
    type: "text",
    name: "name",
    message: "What is the name of it?"
  }
];

class Department {
  async list() {
    const res = await api({
      method: "get",
      url: `department/list?access_token=${store.accessToken}&id=1`,
      transformResponse: [data => JSONbig.parse(data)]
    });
    return res.data.department;
  }

  async create() {
    const response = await prompts(CREATE_DEPARTMENT_FORM());

    const params = {
      parentid: 1,
      ...response
    };

    console.log("creating department...");
    const res = await api({
      method: "post",
      url: `department/create?access_token=${store.accessToken}`,
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
    const department = await this.list();
    const questions = department.map(item => {
      const id = item.id;
      return {
        title: `${item.name}-${id}`,
        value: id
      };
    });
    const form = await prompts([
      {
        type: "autocomplete",
        name: "item",
        message: "Select a department",
        choices: questions,
        limit: 100
      },
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure to delete?"
      }
    ]);
    if (form.item && form.confirm) {
      // excute deletion
      const res = await api({
        method: "get",
        url: `department/delete?access_token=${store.accessToken}&id=${
          form.item
        }`
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

export default Department;
