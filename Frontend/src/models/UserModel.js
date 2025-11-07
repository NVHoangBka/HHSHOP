class UserModel {
  constructor() {
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  clearCurrentUser() {
    this.currentUser = null;
  }
}

export default UserModel;
