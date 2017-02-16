let express = require('express');
let router = express.Router();
let ncmb = require('../libs/ncmb');

router.post('/', (req, res, next) => {
  ncmb.User.login(req.body.userId, req.body.password)
    .then((user) => {
      req.session.user = user;
      res.redirect('/');
    })
    .catch(error => {
      res.status(401).render('error', {error: error});
    })
});

module.exports = router;

