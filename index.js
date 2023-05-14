const http = require('http')
const cors = require('cors')
const app = require('./app')

const server = http.createServer(app)
app.use(cors({   origin: '*',
optionsSuccessStatus: 200,
methods: "GET, PUT, DELETE,POST"}));
const port=80
server.listen(port, () => {
    console.log('Server is listening now')
})
