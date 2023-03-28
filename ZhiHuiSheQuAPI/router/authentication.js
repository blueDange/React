const jwt = require("jsonwebtoken")

const tokenSecret = "tedu@2014" //See @/router/user.js > login

module.exports = (req, res, next) => {
  let token =
    req.headers.token ||
    req.headers.Token ||
    req.headers.authentication ||
    req.headers.Authentication

  if (!token) {
    res.send({ code: 4100, msg: "token required" })
    return
  }
  try {
    let payload = jwt.verify(token, tokenSecret)
    if (Date.now() > payload.expires) {
      res.send({ code: 4102, msg: "token expires" })
    } else {
      req.token = payload
      next()
    }
  } catch (err) {
    res.send({ code: 4101, msg: "token invalid" })
  }
}
