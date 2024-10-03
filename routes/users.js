var express = require('express');
const recipeHelper = require('../controllers/recipe-helper');
var router = express.Router();


/* GET home page. */
const verifyLogin = (req,res,next)=>{
  if( req.session.user && req.session.user.loggedIn){
    next();
  }else{
    res.render('user/login-required');
  }
};

router.get('/',  function(req, res,next) {
  let user = req.session.user;
  console.log('User :',user);
  
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
    
    res.render('user/home',{user,food});
  })  
});

router.get('/signup',(req,res)=>{
  res.render('user/signup',{user:true,isLoginSignupPage: true});
})

router.post('/signup',(req,res)=>{
  recipeHelper.doSignUp(req.body).then((userData)=>{
    req.session.user = userData;
    req.session.user.loggedIn = true;
    res.redirect('/')
  })
})




router.get('/login',(req,res)=>{
  res.render('user/login',{user:true,isLoginSignupPage: true});
});

router.post('/login',(req,res)=>{
  recipeHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.user = response.user;
      req.session.user.loggedIn = true;
      res.redirect('/');
    }else{
      res.redirect('/login');
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/')
})

router.get('/explore-all-category',(req,res)=>{
  let user = req.session.user;
  category = recipeHelper.getCategory().then((category)=>{
    res.render('user/all-category',{user,category});
  }) 
});

router.get('/recipe/:id',(req,res)=>{
  let user = req.session.user;
  let recipeid = req.params.id;
  console.log('Recipe ID :',recipeid);
  recipeHelper.getRecipeDetails(recipeid).then((recipe)=>{
    //console.log(recipe);
    res.render('user/recipe-details',{user,recipe});
  })
});

router.get('/category/:id',(req,res)=>{
  let user = req.session.user;
  //let categoryid = req.body.categoryid;
  let categoryid = req.params.id;
  console.log('Category ID :',categoryid);
  recipeHelper.getRecipeByCategory(categoryid).then((recipe)=>{
    //console.log(recipe);
    res.render('user/category',{user,categoryid,recipe});
  })
});

router.get('/explore-latest',(req,res)=>{
  let user = req.session.user;
  recipeHelper.getLatest().then((latest)=>{
    res.render('user/explore-latest',{user,latest});
  })
});

router.get('/search-recipe',(req,res)=>{
  let user = req.session.user;
  recipeHelper.getLatest().then((latest)=>{
    res.render('user/search-recipe',{user,latest});
  });
  
});


router.get('/submit-recipe',verifyLogin,(req,res)=>{
  let user = req.session.user;
  res.render('user/submit-recipe',{user,success:req.flash('success')});
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
  let user = req.session.user;
  res.render('user/about',{user})
});

router.get('/contact',(req,res)=>{
  let user = req.session.user;
  res.render('user/contact',{user})
})



module.exports = router;
