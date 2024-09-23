var express = require('express');
var router = express.Router();
var adminHelper = require('../controllers/admin-helper');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin-home',{admin:true});
});

router.get('/add-category',(req,res)=>{
  res.render('admin/add-category');
});

router.post('/add-category',(req,res)=>{
  console.log(req.body);
  adminHelper.addCategory(req.body).then((result)=>{
    console.log(result);
    res.redirect('/admin/add-category');
  })
  .catch((err)=>{
    console.log(err);
  })
})


module.exports = router;
