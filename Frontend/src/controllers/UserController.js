import * as userService from "../services/userService";

export const getAllUsers = async () => {
  const users = await userService.fetchUsers();
  return users;
};
