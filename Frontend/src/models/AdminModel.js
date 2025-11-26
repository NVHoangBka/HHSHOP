class AdminModel {
  constructor() {
    this.currentAdmin = null;
  }

  setCurrentAdmin(user) {
    this.currentAdmin = user;
  }

  getCurrentAdmin() {
    return this.currentAdmin;
  }

  clearCurrentAdmin() {
    this.currentAdmin = null;
  }
}

export default AdminModel;
