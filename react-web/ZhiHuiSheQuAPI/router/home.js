const pool = require("../pool")
const express = require("express")
const router = express.Router()
const authentication = require("./authentication")

/**
 * API-2.1: Home Data
 */
router.get("/data", authentication, (req, res, next) => {
  let sql =
    "SELECT * FROM zh_carousel  WHERE type=1; (SELECT iid,title,pic,href FROM zh_user AS u, zh_menu_item AS i, zh_user_menu_item AS ui WHERE u.uid=ui.userId AND i.iid=ui.itemId AND u.uid=? ORDER BY ui.uiid LIMIT 7) UNION (SELECT iid,title,pic,href FROM zh_menu_item WHERE iid=1);SELECT aid,title,left(replace(replace(content,'</p>',''),'<p>',''), 100) as content,startTime,pic FROM zh_activity WHERE unix_timestamp(now())*1000>startTime AND unix_timestamp(now())*1000<endTime ORDER BY startTime DESC LIMIT 10"
  pool.query(sql, req.token.uid, (err, results) => {
    if (err) {
      next(err)
      return
    }
    res.send({
      carousels: results[0],
      menuItems: results[1],
      activities: results[2],
    })
  })
})

module.exports = router
