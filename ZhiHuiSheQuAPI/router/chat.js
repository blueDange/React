const pool = require("../pool")
const express = require("express")
const router = express.Router()
const authentication = require("./authentication")
const multer = require("multer")
const fs = require("fs")

let upload = multer({
  dest: "uploads/",
  limits: { fileSize: 8000000, files: 1 },
})

/**
 * API-6.1: Chat Pic Upload
 */
router.post("/pic/upload", upload.single("pic"), (req, res, next) => {
  console.log(req.file)
  if (!req.file) {
    res.send({ code: 4000, msg: "upload error" })
    return
  }
  let ext = req.file.originalname.substring(
    req.file.originalname.lastIndexOf(".")
  )
  let fileName = "img/chat/" + Date.now() + ext
  let fullName = __dirname + "/../public/" + fileName
  let content = fs.readFileSync(req.file.path)
  fs.writeFile(fullName, content, (err, data) => {
    if (err) {
      next(err)
      return
    }
    res.send({ code: 2000, msg: "upload succ", fileName })
  })
})

/**
 * API-6.2: Chat Add
 */
router.post("/add", authentication, (req, res, next) => {
  let location = req.body.location
  let content = req.body.content
  let picList = req.body.picList
  let sql =
    "INSERT INTO zh_chat_msg(userId,location,content,pubTime) VALUE(?,?,?,?)"
  pool.query(
    sql,
    [req.token.uid, location, content, Date.now()],
    (err, result) => {
      if (err) {
        next(err)
        return
      }
      let mid = result.insertId
      let count = 0
      for (let i = 0; i < picList.length; i++) {
        let sql = "INSERT INTO zh_chat_pic VALUES(NULL, ?, ?)"
        pool.query(sql, [mid, picList[i].fileName], (err, result) => {
          if (err) {
            next(err)
            return
          }
          count++
          if (count == picList.length) {
            res.send({ code: 2000, msg: "msg inserted succ" })
          }
        })
      }
    }
  )
})

/**
 * API-6.3: Chat Query
 */
router.get("/query", (req, res, next) => {
  let pageNum = req.query.pageNum
  if (pageNum) {
    pageNum = Number(pageNum)
  } else {
    pageNum = 1
  }
  let pager = {
    pageSize: 9,
    recordCount: 0,
    pageCount: 0,
    pageNum,
    data: [],
  }
  let sql1 = "SELECT count(*) AS c FROM zh_chat_msg"
  pool.query(sql1, (err, result1) => {
    if (err) {
      next(err)
      return
    }
    pager.recordCount = result1[0].c
    pager.pageCount = Math.ceil(pager.recordCount / pager.pageSize)

    let sql2 =
      "SELECT mid,uid,location,content,pubTime,likeCount,replyCount,uname,email,avatar,gender FROM zh_user AS u, zh_chat_msg AS m WHERE m.userId=u.uid ORDER BY pubTime DESC LIMIT ?, ?"
    pool.query(
      sql2,
      [(pager.pageNum - 1) * pager.pageSize, pager.pageSize],
      (err, result2) => {
        if (err) {
          next(err)
          return
        }
        pager.data = result2
        let count = 0
        for (let i = 0; i < pager.data.length; i++) {
          let msg = pager.data[i]
          let sql3 = "SELECT pid, url FROM zh_chat_pic WHERE msgId=?"
          pool.query(sql3, msg.mid, (err, result3) => {
            if (err) {
              next(err)
              return
            }
            pager.data[i].picList = result3
            count++
            if (count === pager.data.length) {
              res.send(pager)
            }
          })
        }
      }
    )
  })
})

module.exports = router
