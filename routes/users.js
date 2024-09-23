var express = require('express');
const recipeHelper = require('../controllers/recipe-helper');
var router = express.Router();


/* GET home page. */
router.get('/',  function(req, res, next) {
  categories = recipeHelper.getCategory().then((categories)=>{
    //console.log('Categoty',categories);
    const limitCategory = categories.slice(0,5);
    res.render('user/home',{user:true,limitCategory});
  });
  
});


router.get('/explore-all-category',(req,res)=>{
  category = recipeHelper.getCategory().then((category)=>{
    res.render('user/all-category',{user:true,category});
  })
  
})

module.exports = router;
