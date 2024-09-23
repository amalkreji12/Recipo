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




module.exports = router;
