const pool = require("../pool")
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const authentication = require("./authentication")

const tokenSecret = "tedu@2014"

/**
 * API-8.1: admin login
 */
router.post("/login", (req, res, next) => {
  let aname = req.body.aname
  if (!aname) {
    res.send({ code: 4001, msg: "aname required" })
    return
  }
  let apwd = req.body.apwd
  if (!apwd) {
    res.send({ code: 4002, msg: "apwd required" })
    return
  }
  aname = aname.trim()
  apwd = apwd.trim()
  let sql = "SELECT aid FROM zh_admin WHERE aname=? AND apwd=password(?)"
  pool.query(sql, [aname, apwd], (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (!result.length) {
      res.send({ code: 4003, msg: "aname or apwd error" })
      return
    }
    let payload = {
      aid: result[0].aid,
      created: Date.now(),
      expires: Date.now() + 3600000 * 24,
    }
    let token = jwt.sign(payload, tokenSecret)
    res.send({ code: 2000, msg: "login succ", token })
  })
})

/**
 * API-8.2: current admin info
 */
router.get("/info", authentication, (req, res, next) => {
  let aid = req.token.aid
  let sql =
    "SELECT aname,avatar,userName,phone,notes,rname FROM zh_admin, zh_role WHERE aid=? AND roleId=rid; SELECT pid,pname,path,icon,parentId FROM zh_privilege AS p,zh_role_privilege AS rp WHERE rp.roleId=(SELECT roleId FROM zh_admin WHERE aid=?) AND rp.privilegeId=p.pid"
  pool.query(sql, [aid, aid], (err, results) => {
    if (err) {
      next(err)
      return
    }
    let admin = results[0][0]
    let plist = results[1]
    admin.privileges = []
    plist.forEach((p, i) => {
      p.children = []
      if (p.parentId === 0) {
        admin.privileges.push(p)
      }
    })
    admin.privileges.forEach((p1, i) => {
      plist.forEach((p2, j) => {
        if (p1.pid === p2.parentId) {
          p1.children.push(p2)
        }
      })
    })
    admin.privileges.forEach((p1, i) => {
      p1.children.forEach((p2, j) => {
        plist.forEach((p3, j) => {
          if (p2.pid === p3.parentId) {
            p2.children.push(p3)
          }
        })
      })
    })

    res.send(admin)
  })
})

/**
 * API-8.3：修改当前登录用户密码
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
  let sql =
    "UPDATE zh_admin SET apwd=password(?) WHERE aid=? AND apwd=password(?)"
  pool.query(sql, [newPwd, req.token.aid, oldPwd], (err, result) => {
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
 * API-8.4：居民列表
 */
router.get("/household/list", authentication, (req, res, next) => {
  let pageNum = req.query.pageNum
  if (pageNum) {
    pageNum = Number(pageNum)
  } else {
    pageNum = 1
  }
  let kw = req.query.kw
  let pager = {
    pageSize: 6,
    recordCount: 0,
    pageCount: 0,
    pageNum,
    data: [],
  }
  let params1 = []
  let sql1 = "SELECT count(*) AS c FROM zh_household "
  if (kw) {
    sql1 += " WHERE householdName LIKE ? "
    params1.push("%" + kw + "%")
  }
  pool.query(sql1, params1, (err, result1) => {
    if (err) {
      next(err)
      return
    }
    pager.recordCount = result1[0].c
    pager.pageCount = Math.ceil(pager.recordCount / pager.pageSize)

    let sql2 =
      "SELECT hid,householdId,householdName,CONVERT(gender, CHAR) AS gender,phone FROM zh_household "
    let params2 = []
    if (kw) {
      sql2 += " WHERE householdName LIKE ? "
      params2.push("%" + kw + "%")
    }
    sql2 += " ORDER BY hid DESC LIMIT ?, ?"
    params2.push((pager.pageNum - 1) * pager.pageSize)
    params2.push(pager.pageSize)
    pool.query(sql2, params2, (err, result2) => {
      if (err) {
        next(err)
        return
      }
      pager.data = result2
      res.send(pager)
    })
  })
})

/**
 * API-8.5: Household Details
 */
router.get("/household/details", authentication, (req, res, next) => {
  let aid = req.token.aid
  let hid = req.query.hid
  if (!hid) {
    res.send({ code: 4000, msg: "hid required" })
    return
  }
  let sql =
    "SELECT hid,householdId,householdName,CONVERT(gender, CHAR) AS gender,phone,householdAddr,idNum FROM zh_household WHERE hid=?"
  pool.query(sql, [hid], (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.length > 0) {
      res.send(result[0])
    } else {
      res.send({ code: 4001, msg: "hid not exists" })
    }
  })
})

/**
 * API-8.6: Delete Household
 */
router.get("/household/delete", authentication, (req, res, next) => {
  let aid = req.token.aid
  let hid = req.query.hid
  if (!hid) {
    res.send({ code: 4000, msg: "hid required" })
    return
  }
  let sql = "DELETE FROM zh_household WHERE hid=?"
  pool.query(sql, [hid], (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.affectedRows == 0) {
      res.send({ code: 4001, msg: "hid not exists" })
    } else {
      res.send({ code: 2000, msg: "delete succ" })
    }
  })
})

/**
 * API-8.7: Update Household
 */
router.post("/household/update", authentication, (req, res, next) => {
  let aid = req.token.aid
  let hid = req.body.hid
  if (!hid) {
    res.send({ code: 4000, msg: "hid required" })
    return
  }
  let sql = "UPDATE zh_household SET hid=? "
  let params = [hid]
  if (req.body.householdId) {
    sql += ", householdId=? "
    params.push(req.body.householdId)
  }
  if (req.body.householdName) {
    sql += ", householdName=? "
    params.push(req.body.householdName)
  }
  if (req.body.gender === "0" || req.body.gender === "1") {
    sql += ", gender=? "
    params.push(req.body.gender)
  }
  if (req.body.householdAddr) {
    sql += ", householdAddr=? "
    params.push(req.body.householdAddr)
  }
  if (req.body.phone) {
    sql += ", phone=? "
    params.push(req.body.phone)
  }
  if (req.body.idNum) {
    sql += ", idNum=? "
    params.push(req.body.idNum)
  }
  sql += " WHERE hid=?"
  params.push(hid)
  pool.query(sql, params, (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.affectedRows == 0) {
      res.send({ code: 4001, msg: "hid not exists" })
    } else {
      res.send({ code: 2000, msg: "update succ" })
    }
  })
})

/**
 * API-8.8: Add Household
 */
router.post("/household/add", authentication, (req, res, next) => {
  let aid = req.token.aid
  if (!req.body.householdId) {
    res.send({ code: 4001, msg: "householdId required" })
    return
  }
  if (!req.body.householdName) {
    res.send({ code: 4002, msg: "householdName required" })
    return
  }
  if (!req.body.gender) {
    res.send({ code: 4003, msg: "gender required" })
    return
  }
  if (!req.body.phone) {
    res.send({ code: 4004, msg: "phone required" })
    return
  }
  let sql = "INSERT INTO zh_household SET ? "

  pool.query(sql, req.body, (err, result) => {
    if (err) {
      next(err)
      return
    }
    res.send({ code: 2000, msg: "add succ", hid: result.insertId })
  })
})

/**
 * API-8.9: Batch Delete Household
 */
router.post("/household/batch/delete", authentication, (req, res, next) => {
  let aid = req.token.aid
  let list = req.body
  if (!(list instanceof Array) || list.length === 0) {
    res.send({ code: 4001, msg: "hid array required" })
    return
  }
  let sql = `DELETE FROM zh_household WHERE hid IN (${list.join(",")})`

  pool.query(sql, (err, result) => {
    if (err) {
      next(err)
      return
    }
    res.send({ code: 2000, msg: "delete succ", affected: result.affectedRows })
  })
})

/**
 * API-8.10: Batch Add Household
 */
const multer = require("multer")
const xlsx = require("node-xlsx")
const upload = multer({ dest: "uploads/" })
router.post(
  "/household/batch/add",
  [authentication, upload.single("residents")],
  (req, res, next) => {
    let aid = req.token.aid
    let sheets = xlsx.parse(req.file.path)
    let sql = `INSERT INTO zh_household(householdId, householdName,gender, householdAddr, phone, idNum) VALUES ?  `
    pool.query(sql, [sheets[0].data], (err, result) => {
      if (err) {
        next(err)
        return
      }
      res.send({ code: 2000, msg: "add succ", affected: result.affectedRows })
    })
  }
)

/**
 * API-8.11: Batch Export Household
 */
let fs = require("fs")
router.post("/household/batch/export", authentication, (req, res, next) => {
  let aid = req.token.aid
  let list = req.body
  if (!(list instanceof Array) || list.length === 0) {
    res.send({ code: 4001, msg: "hid array required" })
    return
  }
  let sql = `SELECT hid, householdId, householdName,gender, phone, householdAddr,idNum FROM zh_household WHERE hid IN (${list.join(
    ","
  )})`
  pool.query(sql, (err, result) => {
    if (err) {
      next(err)
      return
    }
    let data = []
    result.forEach((r) => {
      data.push(Object.values(r))
    })
    let buf = xlsx.build([{ name: "Residents", data }])
    res.set("Content-Type", "application/octet-stream")
    res.set("Content-Disposition", "attachment; filename=residents.xlsx")
    res.end(buf)
  })
})

/**
 * API-8.12: Full Export Household
 */
router.get("/household/full/export", authentication, (req, res, next) => {
  let aid = req.token.aid
  let sql = `SELECT hid, householdId,householdName,gender, phone, householdAddr,idNum FROM zh_household`
  pool.query(sql, (err, result) => {
    if (err) {
      next(err)
      return
    }
    let data = []
    result.forEach((r) => {
      data.push(Object.values(r))
    })
    let buf = xlsx.build([{ name: "Residents", data }])
    res.set("Content-Type", "application/octet-stream")
    res.set("Content-Disposition", "attachment; filename=residents.xlsx")
    res.end(buf)
  })
})

module.exports = router
