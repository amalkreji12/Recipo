var express = require('express');
const recipeHelper = require('../controllers/recipe-helper');
var router = express.Router();


/* GET home page. */
router.get('/',  function(req, res, next) {
  categories = recipeHelper.getCategory().then((categories)=>{
    //console.log('Categoty',categories);
    res.render('user/home',{user:true,categories});
  });
  
});




module.exports = router;
