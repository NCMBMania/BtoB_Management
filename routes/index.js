var express = require('express');
var router = express.Router();
let ncmb = require('../libs/ncmb');

router.get('/', function(req, res, next) {
  let user = req.session.user || null;
  res.render('index', { user: user });
});

let localStorage = new require("node-localstorage").LocalStorage("./scratch");
router.post('/logout', function(req, res, next) {
  delete req.session['user'];
  localStorage.removeItem(`NCMB/${ncmb.application_key}/currentUser`);
  res.redirect('/');
});

module.exports = router;
