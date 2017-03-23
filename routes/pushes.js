let express = require('express');
let router = express.Router();
let config = require('../config');
let ncmb = require('../libs/ncmb');

let user = null;

// 認証済みかチェック
router.all('*', (req, res, next) => {
  user = req.session.user || null;
  if (!user) {
    return res.redirect('/');
  }else{
    ncmb.sessionToken = user.sessionToken;
    next();
  }
});

// 画面表示
router.get('/', (req, res, next) => {
  res.render('pushes/index', {user: user});
});

// プッシュ通知を登録する
router.post('/', (req, res, next) => {
  var push = new ncmb.Push();
  push.set("immediateDeliveryFlag", true)
    .set("message", req.body.message)
    .set("target",  req.body.target)
    .set("title",   req.body.title)
    .set("contentAvailable", false)
    .set("searchCondition", {"channels": [user.Company]})
  push.send()
    .then(data => {
      console.log(data)
      res.redirect("/pushes")
    })
    .catch(error => {
      console.log(error)
      res.status(401).render('error', {error: error});
    })
});

module.exports = router;

