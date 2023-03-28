const pool = require("../pool")
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const authentication = require("./authentication")

const tokenSecret = "tedu@2014" //See @/router/authentication.js

/**
 * API-1.1: User Register
 */
router.post("/register", (req, res, next) => {
  let phone = req.body.phone
  if (!phone) {
    res.send({ code: 4001, msg: "phone required" })
    return
  }
  phone = String(phone).trim()
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    res.send({ code: 4003, msg: "phone invalid" })
    return
  }
  let pwd = req.body.pwd
  if (!pwd) {
    res.send({ code: 4002, msg: "pwd required" })
    return
  }
  pwd = String(pwd).trim()
  let sql = "SELECT uid FROM zh_user WHERE phone=?"
  pool.query(sql, phone, (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.length > 0) {
      res.send({ code: 4004, msg: "user already exists" })
      return
    }
    let sql = "INSERT INTO zh_user(phone,pwd) VALUES(?,password(?))"
    pool.query(sql, [phone, pwd], (err, result) => {
      if (err) {
        next(err)
        return
      }
      res.send({ code: 2000, msg: "register succ" })
    })
  })
})

/**
 * API-1.2: User Login
 */
router.post("/login", (req, res, next) => {
  let phone = req.body.phone
  if (!phone) {
    res.send({ code: 4001, msg: "phone required" })
    return
  }
  let pwd = req.body.pwd
  if (!pwd) {
    res.send({ code: 4002, msg: "pwd required" })
    return
  }
  phone = phone.trim()
  pwd = pwd.trim()
  let sql = "SELECT uid FROM zh_user WHERE phone=? AND pwd=password(?)"
  pool.query(sql, [phone, pwd], (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (!result.length) {
      res.send({ code: 4003, msg: "phone or pwd error" })
      return
    }
    let payload = {
      uid: result[0].uid,
      phone: phone,
      created: Date.now(),
      expires: Date.now() + 3600000 * 24,
    }
    let token = jwt.sign(payload, tokenSecret)
    res.send({ code: 2000, msg: "login succ", token })
  })
})

/**
 * API-1.3: User Profile
 */
router.get("/profile", authentication, (req, res, next) => {
  let sql =
    "SELECT uid,phone,uname,email,avatar,gender FROM zh_user WHERE uid=?"
  pool.query(sql, req.token.uid, (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.length > 0) {
      res.send(result[0])
    } else {
      res.send({ code: 505, msg: "user not found" })
    }
  })
})

/**
 * API-1.4: User List —— TEST ONLY!
 */
router.get("/list", (req, res, next) => {
  let sql =
    "SELECT uid,phone,uname,email,avatar,gender FROM zh_user ORDER BY uid DESC LIMIT 100"
  pool.query(sql, (err, result) => {
    if (err) {
      next(err)
      return
    }
    res.send(result)
  })
})

/**
 * API-1.5：修改当前登录用户头像
 */
router.post("/update/avatar", authentication, (req, res, next) => {
  let fileName = "img/" + Date.now() + ".png"
  let sql = "UPDATE zh_user SET avatar=? WHERE uid=?"
  pool.query(sql, [fileName, req.token.uid], (err, result) => {
    if (err) {
      next(err)
      return
    }
    res.send({ code: 2000, msg: "update succ" })
  })
})

/**
 * API-1.6：修改当前登录用户密码
 */
router.post("/update/pwd", authentication, (req, res, next) => {
  let oldPwd = req.body.oldPwd
  if (!oldPwd) {
    res.send({ code: 4001, msg: "old pwd required" })
    return
  }
  let newPwd = req.body.newPwd
  if (!newPwd) {
    res.send({ code: 4002, msg: "new pwd required" })
    return
  }
  if (newPwd == oldPwd) {
    res.send({ code: 4004, msg: "pwd no change" })
    return
  }
  let sql = "UPDATE zh_user SET pwd=password(?) WHERE uid=? AND pwd=password(?)"
  pool.query(sql, [newPwd, req.token.uid, oldPwd], (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.affectedRows == 0) {
      res.send({ code: 4003, msg: "old pwd err" })
    } else {
      res.send({ code: 2000, msg: "update succ" })
    }
  })
})

/**
 * API-1.7: 检测邮箱是否存在
 */
router.get("/check/email", (req, res, next) => {
  let email = req.query.email
  if (!email) {
    res.send({ code: 4001, msg: "email required" })
    return
  }
  if (!/^\w+[@][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+$/.test(email)) {
    res.send({ code: 4002, msg: "email invalid" })
    return
  }
  let sql = "SELECT uid FROM zh_user WHERE email=?"
  pool.query(sql, email, (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.length > 0) {
      res.send({ code: 2001, msg: "exists" })
    } else {
      res.send({ code: 2000, msg: "non exists" })
    }
  })
})

/**
 * API-1.8: 检测手机号是否存在
 */
router.get("/check/phone", (req, res, next) => {
  let phone = req.query.phone
  if (!phone) {
    res.send({ code: 4001, msg: "phone required" })
    return
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    res.send({ code: 4002, msg: "phone invalid" })
    return
  }
  let sql = "SELECT uid FROM zh_user WHERE phone=?"
  pool.query(sql, phone, (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.length > 0) {
      res.send({ code: 2001, msg: "exists" })
    } else {
      res.send({ code: 2000, msg: "non exists" })
    }
  })
})

/**
 * API-1.9: 检测用户名是否存在
 */
router.get("/check/uname", (req, res, next) => {
  let uname = req.query.uname
  if (!uname) {
    res.send({ code: 4001, msg: "uname required" })
    return
  }
  let sql = "SELECT uid FROM zh_user WHERE uname=?"
  pool.query(sql, uname, (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.length > 0) {
      res.send({ code: 2001, msg: "exists" })
    } else {
      res.send({ code: 2000, msg: "non exists" })
    }
  })
})

/**
 * API-1.10: 退出登录
 */
router.get("/logout", authentication, (req, res, next) => {
  res.send({ code: 2000, msg: "logout succ" })
})

module.exports = router
