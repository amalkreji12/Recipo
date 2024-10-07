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
  const loginError = req.flash('loginError');
  res.render('user/login',{user:true,isLoginSignupPage: true,loginError});
});

router.post('/login',(req,res)=>{
  recipeHelper.doLogin(req.body).then((response)=>{
    if(response.emailNotFound){
      req.flash('loginError', 'No account found with this email !')
      res.redirect('/login');
    }else if(response.passwordIncorrect){
      req.flash('loginError', 'Invalid password !')
      res.redirect('/login');
    }else if(response.status){
      req.session.user = response.user;
      req.session.user.loggedIn = true;
      res.redirect('/');
    }
    // if(response.status){
    //   req.session.user = response.user;
    //   req.session.user.loggedIn = true;
    //   res.redirect('/');
    // }else{
    //   req.flash('loginError', 'Invalid email or password')
    //   res.redirect('/login');
    // }
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
  let userId = req.session.user._id;
  recipeHelper.submitRecipe(req.body,userId).then((result)=>{
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
});

router.get('/profile',verifyLogin,async(req,res)=>{
  let user = req.session.user;  
  let userId = req.session.user._id;

  const deleteMessage = req.flash('deleteUpdate')[0] || null;
  const updateMessage = req.flash('successUpdate')[0] || null;

  recipeHelper.getUserDetails(userId).then((userDetails)=>{
    const dateFormatted = new Date(userDetails.createdAt).toLocaleDateString('en-US',{
      year:'numeric',
      month:'long',
      day:'numeric',
    });
    userDetails.createdAt = dateFormatted;
    recipeHelper.getUserUploadedRecipe(userId).then((recipes)=>{
      res.render('user/profile',{user,userDetails,recipes,deleteMessage,updateMessage});
    });
  });
});

router.get('/edit-recipe/:id',verifyLogin,(req,res)=>{
  let user = req.session.user;
  let recipeId = req.params.id;
  recipeHelper.getRecipeDetails(recipeId).then((recipe)=>{
    res.render('user/edit-recipe',{user,recipe})
  })
});

router.post('/update-recipe/:id',(req,res)=>{
  let recipeId = req.params.id;
  let userId = req.session.user._id;
  recipeHelper.updateRecipeByUser(recipeId,req.body,userId).then((result)=>{
    req.flash('successUpdate','Recipe updated successfully');
    res.redirect('/profile');
  })
});

router.get('/delete-recipe/:id',(req,res)=>{
  let recipeId = req.params.id;
  let userId = req.session.user._id;
  recipeHelper.getRecipeDetails(recipeId).then((recipe)=>{
    recipeHelper.deleteRecipeByUser(recipeId,recipe,userId).then((result)=>{
      req.flash('deleteUpdate','Recipe deleted successfully');
      res.redirect('/profile');
    })
  });
});

router.get('/change-password',verifyLogin,(req,res)=>{
  let user = req.session.user;
  res.render('user/change-password',{'passwordError':req.session.passwordError,user})
  req.session.passwordError = false;
})

router.post('/change-password',(req,res)=>{
  let userId = req.session.user._id;
  recipeHelper.changePassword(userId,req.body).then((result)=>{
    if(result.status){
      console.log(result);
      req.flash('Passwordsuccess','Password changed successfully');
      res.redirect('/settings');
    }else{
      req.session.passwordError = 'Old password is incorrect';
      res.redirect('/change-password');
    }
  })
});

router.get('/settings',verifyLogin,(req,res)=>{
  const passwordUpdateMessage = req.flash('Passwordsuccess')[0] || null;
  const usernameUpdateMessage = req.flash('usernameUpdatesuccess')[0] || null;
  const emailUpdateMessage = req.flash('emailUpdatesuccess')[0] || null;
  const alertMessage = {passwordUpdateMessage,usernameUpdateMessage,emailUpdateMessage}
  res.render('user/settings',{user:req.session.user,alertMessage});
});

router.post('/update-username',(req,res)=>{
  let userId = req.session.user._id;
  recipeHelper.updateUserName(userId,req.body).then((result)=>{
    req.flash('usernameUpdatesuccess','Username updated successfully');
    res.redirect('/settings');
  });  
});

router.post('/update-email',(req,res)=>{
  let userId = req.session.user._id;
  recipeHelper.updateEmail(userId,req.body).then((result)=>{
    req.flash('emailUpdatesuccess','Email updated successfully');
    res.redirect('/settings');
  })
});

router.post('/delete-account',(req,res)=>{
  let userId = req.session.user._id;
  recipeHelper.deleteAccount(userId).then((result)=>{
    console.log(result);
    
    req.session.destroy();
    res.redirect('/');
  })
})


module.exports = router;
