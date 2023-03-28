const port = 9005
const express = require("express")
const bodyParser = require("body-parser")
const routerUser = require("./router/user")
const routerHome = require("./router/home")
const routerFee = require("./router/fee")
const routerHousehold = require("./router/household")
const routerParking = require("./router/parking")
const routerChat = require("./router/chat")
const routerMall = require("./router/mall")
const routerAdmin = require("./router/admin")

let app = express()
app.listen(port, () => {
  console.log("ZHSQ Server Listening On", port)
})

/**
 * Static Resources
 */
app.use(express.static("public"))

/**
 * CORS & Preflight request
 */
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": req.headers.origin || "*",
    "Access-Control-Allow-Headers":
      "X-Requested-With,Content-Type,Authentication,Token,x-requested-with,content-type,authentication,token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  })
  req.method === "OPTIONS" ? res.status(204).end() : next()
})

/**
 * Body Parser
 */
app.use(bodyParser.json())

/**
 * Routers
 */
app.use("/user", routerUser)
app.use("/index", routerHome)
app.use("/fee", routerFee)
app.use("/household", routerHousehold)
app.use("/parking", routerParking)
app.use("/chat", routerChat)
app.use("/mall", routerMall)
app.use("/admin", routerAdmin)

/**
 * Error Handling
 */
app.use((req, res, next) => {
  res.send({ code: 4040, msg: "url not found or request method err" })
})

app.use(function (err, req, res, next) {
  // console.error(err.stack)
  res.send({ code: 5000, msg: "server side error", stack: err.stack })
})
