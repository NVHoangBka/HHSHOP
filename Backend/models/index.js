// models/index.js
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

require("./User");
require("./Order");
require("./Products");
require("./Title");
require("./Address");
require("./Banner");
require("./Cart");
