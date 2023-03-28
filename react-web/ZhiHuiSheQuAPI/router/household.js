const pool = require("../pool")
const express = require("express")
const router = express.Router()
const authentication = require("./authentication")

/**
 * API-4.1: Household Query
 */
router.get("/query", (req, res, next) => {
  let householdId = req.query.hhid
  if (!householdId) {
    res.send({ code: 4001, msg: "hhid required" })
    return
  }
  let sql =
    "SELECT hid,householdId,INSERT(householdName, 2, 1, '*') AS householdName,householdAddr FROM zh_household WHERE householdId=?"
  pool.query(sql, householdId, (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.length === 0) {
      res.send({ code: 4002, msg: "householdId not exists" })
    } else {
      res.send({ code: 2000, msg: result[0] })
    }
  })
})

module.exports = router
