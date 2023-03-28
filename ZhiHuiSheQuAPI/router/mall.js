const pool = require("../pool")
const express = require("express")
const router = express.Router()
const authentication = require("./authentication")

/**
 * API-7.1: Mall Index
 */
router.get("/index", authentication, (req, res, next) => {
  let sql =
    "SELECT uname,avatar,email,gender FROM zh_user WHERE uid=?;SELECT * FROM zh_carousel WHERE type=2 ORDER BY cid; SELECT tid,tname FROM zh_goods_type ORDER BY tid"
  pool.query(sql, req.token.uid, (err, results) => {
    if (err) {
      next(err)
      return
    }
    res.send({
      userInfo: results[0][0],
      carousels: results[1],
      goodsTypes: results[2],
    })
  })
})

/**
 * API-7.2: Mall Goods List
 */
router.get("/goods/list", (req, res, next) => {
  let sql =
    "SELECT gid,mainPic,goodsName,originalPrice,discount,soldCount FROM zh_goods "
  let tid = req.query.tid
  if (tid) {
    tid = parseInt(tid)
  } else {
    tid = 1
  }

  let params = []
  if (tid === 1) {
    sql += " WHERE discount<1 "
  } else if (tid === 2) {
    sql += " WHERE isNewYearSelection=1 "
  } else if (tid === 3) {
    sql += " WHERE isBrandSelection=1 "
  } else {
    sql += " WHERE typeId=?"
    params.push(tid)
  }

  let order = req.query.order
  if (order === "price-desc") {
    sql += " ORDER BY originalPrice*discount desc "
  } else if (order === "price-asc") {
    sql += " ORDER BY originalPrice*discount asc "
  } else {
    sql += " ORDER BY soldCount "
  }

  console.log(sql)
  pool.query(sql, params, (err, result) => {
    if (err) {
      next(err)
      return
    }
    res.send(result)
  })
})

/**
 * API-7.3: Mall Goods Details
 */
router.get("/goods/details", (req, res, next) => {
  let gid = req.query.gid
  if (!gid) {
    res.send({ code: 4001, msg: "gid required" })
    return
  }
  let sql =
    "SELECT gid,mainPic,shortTitle,goodsName,descriptions,originalPrice,discount,soldCount,details,isNewYearSelection,isBrandSelection FROM zh_goods WHERE gid=?"
  pool.query(sql, gid, (err, result) => {
    if (err) {
      next(err)
      return
    }
    if (result.length > 0) {
      res.send(result[0])
    } else {
      res.send({ code: 4002, msg: "gid not exists" })
    }
  })
})

module.exports = router
