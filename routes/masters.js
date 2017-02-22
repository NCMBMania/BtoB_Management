let express = require('express');
let router = express.Router();
let ncmb = require('../libs/ncmb');

let user = null;
let Master = ncmb.DataStore('Master');

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
  res.render('masters/index', {user: user});
});

// 現在のデータをJSONで返す
router.get('/items', (req, res, next) => {
  Master
    .where({Company: user.Company})
    .fetch()
    .then(master => {
      if (Object.keys(master).length === 0) {
        master = new Master
        master.set('items', []);
      }
      res.json(master);
    })
    .catch(error => {
      res.status(401).render('error', {error: error});
    })
});

// データを更新する
router.post('/items', (req, res, next) => {
  Master
    .where({Company: user.Company})
    .fetch()
    .then(master => {
      if (Object.keys(master).length === 0) {
        // 新規作成
        master = new Master;
        // Acl設定
        let acl = new ncmb.Acl;
        acl.setRoleWriteAccess(user.Company, true)
          .setRoleWriteAccess('Admin', true)
          .setPublicReadAccess(true);
        master.set('acl', acl);
        master.set('Company', user.Company);
      }
      master.set('items', req.body['items[]'])
      if (master.objectId) {
        return master.update();
      }else{
        return master.save();
      }
    })
    .catch(error => {
      res.status(401).render('error', {error: error});
    })
    .then(master => {
      res.json(master);
    })
});

module.exports = router;

