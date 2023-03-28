const pool = require("../pool")
const express = require("express")
const router = express.Router()
const authentication = require("./authentication")

/**
 * API-3.1: User Fee
 */
router.get("/list", authentication, (req, res, next) => {
  let sql =
    "SELECT type,sum(amount) AS amount FROM zh_fee WHERE userId=? GROUP BY type ORDER BY type"
  pool.query(sql, req.token.uid, (err, result) => {
    if (err) {
      next(err)
      return
    }
    let output = {
      shui: result[0].amount,
      dian: result[1].amount,
      ranqi: result[2].amount,
      wuye: result[3].amount,
      tingche: result[4].amount,
      kuandai: result[5].amount,
    }
    res.send(output)
  })
})

/**
 * API-3.2: Fee Collector
 */
router.get("/collector", (req, res, next) => {
  let type = req.query.type
  if (!type) {
    res.send({ code: 4001, msg: "type required" })
    return
  }
  let sql =
    "SELECT cid,cname,addr,phone FROM zh_fee_collector WHERE type=? ORDER BY cid"
  pool.query(sql, type, (err, result) => {
    if (err) {
      next(err)
      return
    }
    res.send(result)
  })
})

/**
 * API-3.3: Fee Add
 */
router.post("/add", authentication, (req, res, next) => {
  let type = req.body.type
  if (!type) {
    res.send({ code: 4006, msg: "type required" })
    return
  }
  let collectorId = req.body.collectorId
  if (!collectorId) {
    res.send({ code: 4001, msg: "collectorId required" })
    return
  }
  let householdId = req.body.householdId
  if (!householdId) {
    res.send({ code: 4002, msg: "householdId required" })
    return
  }
  let amount = req.body.amount
  if (!amount) {
    res.send({ code: 4005, msg: "amount required" })
    return
  }
  let sql = "INSERT INTO zh_fee VALUES(NULL, ?,?,?,?,0,?,?)"
  pool.query(
    sql,
    [req.token.uid, type, collectorId, householdId, Date.now(), amount],
    (err, result) => {
      if (err) {
        next(err)
        return
      }
      res.send({ code: 2000, msg: "add succ", fee_id: result.insertedId })
    }
  )
})

/**
 * API-3.4: Fee Record
 */
router.get("/record", authentication, (req, res, next) => {
  let type = req.query.type //"-1"
  let startTime = req.query.startTime
  let endTime = req.query.endTime
  let sql =
    "SELECT fid, f.type AS type,cname AS collectorName,f.householdId,h.householdName,h.householdAddr,paidTime,amount FROM zh_fee AS f, zh_fee_collector AS c, zh_household AS h WHERE c.cid=f.collectorId AND f.householdId=h.householdId AND f.paidTime>0 AND f.userId=? "
  let params = [req.token.uid]
  if (type && type > 0) {
    sql += " AND f.type=? "
    params.push(type)
  }
  if (startTime && endTime && startTime > 0 && endTime > 0) {
    sql += " AND f.paidTime>=? AND f.paidTime<=? "
    params.push(startTime, endTime)
  }
  sql += " ORDER BY fid DESC "
  pool.query(sql, params, (err, result) => {
    if (err) {
      next(err)
      return
    }
    res.send(result)
  })
})

module.exports = router
