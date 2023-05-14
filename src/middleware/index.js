// Create application/x-www-form-urlencoded parser
var bodyParser = require("body-parser");
module.exports = (app) => {
// Parse JSON request body
app.use(bodyParser.json());
// Parse URL-encoded form request body
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

}