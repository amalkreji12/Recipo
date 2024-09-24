var express = require('express');
const recipeHelper = require('../controllers/recipe-helper');
var router = express.Router();


/* GET home page. */
router.get('/',  function(req, res, next) {
  // categories = recipeHelper.getCategory().then((categories)=>{
  //   //console.log('Categoty',categories);
  //   const limitCategory = categories.slice(0,5);
  //   res.render('user/home',{user:true,limitCategory});
  // });

  Promise.all([
    recipeHelper.getCategory(),
    recipeHelper.getLatest(),
    recipeHelper.getIndianRecipe(),
    recipeHelper.getAmericanRecipe(),
    recipeHelper.getItalianRecipe()
  ])
  .then(([category,latest,indian,american,italian])=>{
    const limitCategory = category.slice(0,5);
    const limitlatest = latest.slice(0,5);
    const indianlimit = indian.slice(0,5);
    const americanlimit = american.slice(0,5);
    const italianlimit = italian.slice(0,5);
    
    const food = {limitCategory,limitlatest,indianlimit,americanlimit,italianlimit};
    
    res.render('user/home',{user:true,food});
  })
  
  
});


router.get('/explore-all-category',(req,res)=>{
  category = recipeHelper.getCategory().then((category)=>{
    res.render('user/all-category',{user:true,category});
  })
  
});

router.get('/recipe/:id',(req,res)=>{
  let recipeid = req.params.id;
  console.log('Recipe ID :',recipeid);
  recipeHelper.getRecipeDetails(recipeid).then((recipe)=>{
    console.log(recipe);
    res.render('user/recipe-details',{user:true,recipe});
  })
});

router.get('/category/:id',(req,res)=>{
  //let categoryid = req.body.categoryid;
  let categoryid = req.params.id;
  console.log('Category ID :',categoryid);
  recipeHelper.getRecipeByCategory(categoryid).then((recipe)=>{
    //console.log(recipe);
    res.render('user/category',{user:true,categoryid,recipe});
  })
})



module.exports = router;
