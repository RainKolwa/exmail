import prompts from "prompts";
import User from "./user";
import Department from "./department";

const MENU = () => {
  return [
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
      message: (prev, values) => `assad ${prev}, ${values.menu}`,
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
};

class Menu {
  async start() {
    const qs = MENU();
    const res = await prompts(qs);
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
  }
}

export default Menu;
