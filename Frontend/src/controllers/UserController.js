import UserService from "../services/UserService";

class UserController {
  constructor() {
    this.userService = new UserService();
  }
  async getAllUsers(userData) {
    const users = await this.userService.getAllUsers(userData);
    return users;
  }
}

export default UserController;
