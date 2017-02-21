let express = require('express');
let router = express.Router();
let ncmb = require('../libs/ncmb');

let user = null;
let Config = ncmb.DataStore('Config');

router.all('*', (req, res, next) => {
  user = req.session.user || null;
  if (!user) {
    return res.redirect('/');
  }else{
    ncmb.sessionToken = user.sessionToken;
    next();
  }
});

router.get('/', (req, res, next) => {
  Config
    .where({Company: user.Company})
    .fetch()
    .then(config => {
      res.render('configs/index', { user: user, config: config });
    })
    .catch(error => {
      res.status(401).render('error', {error: error});
    })
});

router.post('/', (req, res, next) => {
  Config
    .where({Company: user.Company})
    .fetch()
    .then(config => {
      if (Object.keys(config).length === 0) {
        // 新規作成
        config = new Config;
        // Acl設定
        let acl = new ncmb.Acl;
        acl.setRoleWriteAccess(user.Company, true)
          .setRoleWriteAccess('Admin', true)
          .setPublicReadAccess(true);
        config.set('acl', acl);
        config.set('Company', user.Company);
      }
      
      let ary = ['appName', 'description'];
      for (let i in ary) {
        let name = ary[i];
        config.set(name, req.body[name]);
      }
      config.set('public', req.body.public === 'on');
      if (config.objectId) {
        return config.update();
      }else{
        return config.save();
      }
    })
    .catch(error => {
      res.status(401).render('error', {error: error});
    })
    .then(config => {
      res.render('configs/index', { user: user, config: config });
    })
});

module.exports = router;

