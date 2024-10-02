var express = require('express');
const recipeHelper = require('../controllers/recipe-helper');
var router = express.Router();


/* GET home page. */
router.get('/',  function(req, res, next) {
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

router.get('/login',(req,res)=>{
  res.render('user/login',{user:true});
});

router.get('/signup',(req,res)=>{
  res.render('user/signup',{user:true});
})


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
});

router.get('/explore-latest',(req,res)=>{
  recipeHelper.getLatest().then((latest)=>{
    res.render('user/explore-latest',{user:true,latest});
  })
});

router.get('/search-recipe',(req,res)=>{
  recipeHelper.getLatest().then((latest)=>{
    res.render('user/search-recipe',{user:true,latest});
  });
  
});


router.get('/submit-recipe',(req,res)=>{
  res.render('user/submit-recipe',{user:true,success:req.flash('success')});
});

router.post('/submit-recipe',(req,res)=>{
  //console.log(req.body);
  //console.log(req.files.image);
  recipeHelper.submitRecipe(req.body).then((result)=>{
    let image = req.files.image;
    let imageName = req.body.name;
    let id = result.insertedId.toString();
    image.mv('./public/uploads/recipes/'+imageName+'.png',((err,done)=>{
      if(!err){
        req.flash('success','Recipe submitted successfully');
        res.redirect('/submit-recipe');
      }else{
        console.log(err);
      }
    }));
  });
});

router.get('/about',(req,res)=>{
  res.render('user/about',{user:true})
});

router.get('/contact',(req,res)=>{
  res.render('user/contact',{user:true})
})



module.exports = router;
