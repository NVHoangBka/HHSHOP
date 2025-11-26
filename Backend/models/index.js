// models/index.js
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

require("./User");
require("./Order");
require("./Product");
require("./Title");
require("./Address");
require("./Banner");
require("./Cart");
