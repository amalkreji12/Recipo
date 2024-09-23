var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin-home',{admin:true});
});

router.get('/add-category',(req,res)=>{
  res.render('admin/add-category');
})

module.exports = router;
