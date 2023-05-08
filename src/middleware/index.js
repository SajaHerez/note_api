// Create application/x-www-form-urlencoded parser
var bodyParser = require("body-parser");
module.exports = (app) => {
// Parse JSON request body
app.use(bodyParser.json());
// Parse URL-encoded form request body
app.use(bodyParser.urlencoded({ extended: false }));


}