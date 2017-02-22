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
  ncmb.File
    .where({'fileName': {"$regex": `${user.Company}_.*`}})
    .fetchAll()
    .then(files => {
      res.render('files/index', {user: user, files: files, config: config});
    })
});

// ファイルをアップロードする
router.post('/', (req, res, next) => {
  let acl = new ncmb.Acl;
  acl.setRoleWriteAccess(user.Company, true)
    .setRoleWriteAccess('Admin', true)
    .setPublicReadAccess(true);
  ncmb.File.upload(`${user.Company}_${req.files.photo.name}`, req.files.photo.data, acl)
  .then(file => {
    res.redirect('/files');
  })
  .catch(error => {
    res.status(401).render('error', {error: error});
  })
});

router.delete('/:fileName', (req, res, next) => {
  ncmb.File.delete(req.params.fileName)
  .then(file => {
    res.redirect('/files');
  })
  .catch(error => {
    res.status(401).render('error', {error: error});
  })
});

module.exports = router;

