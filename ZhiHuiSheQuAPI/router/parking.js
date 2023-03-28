const pool = require("../pool")
const express = require("express")
const router = express.Router()
const authentication = require("./authentication")

/**
 * API-5.1: Parking Zones List
 */
router.get("/zone/list", (req, res, next) => {
  let sql = "SELECT * FROM zh_parking_zone"
  pool.query(sql, (err, result) => {
    if (err) {
      next(err)
      return
    }
    res.send(result)
  })
})

module.exports = router
