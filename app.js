const express = require("express");
const app = express();
const middleware = require('./src/middleware')
const router=require('./src/routes')
middleware(app)
router(app)

module.exports = app;
