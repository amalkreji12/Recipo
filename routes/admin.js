var express = require('express');
var router = express.Router();
var adminHelper = require('../controllers/admin-helper');

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  Promise.all([
    adminHelper.getTotalRecipes(),
    adminHelper.getTotalCategory(),
    adminHelper.getRecentActivites()
  ])
  .then(([recipeCount,categoryCount,activity])=>{
    const limitActivity = activity.reverse().slice(0,4);

    const total = {recipeCount,categoryCount,limitActivity};
    res.render('admin/admin-home',{admin:true,total});
  });

});

router.get('/add-category',(req,res)=>{
  res.render('admin/add-category',{success:req.flash('success')});
});

router.post('/add-category',(req,res)=>{
  console.log(req.body);
  adminHelper.addCategory(req.body).then((result)=>{
    console.log(result);
    req.flash('success','New Category Added')
    res.redirect('/admin/add-category');
  })
  .catch((err)=>{
    console.log(err);
  })
});

router.get('/add-recipe',(req,res)=>{
  res.render('admin/add-recipe',{success:req.flash('success')});
});

router.post('/add-recipe',(req,res)=>{
  //console.log(req.files.image);
  adminHelper.addRecipe(req.body).then((recipe)=>{
    let image = req.files.image;
    let imageName = req.body.name;
    let id = recipe.insertedId.toString();
    console.log(id);
    image.mv('./public/uploads/recipes/'+imageName+'.png',((err,done)=>{
      if(!err){
        req.flash('success','Recipe added successfully');
        res.redirect('/admin/add-recipe');
      }else{
        console.log(err);
      }
    }))
    
  })
});

router.get('/all-recipes',(req,res)=>{
  adminHelper.getAllRecipes().then((recipe)=>{
    const deleteMessage = req.flash('deleteUpdate')[0] || null;
    const updateMessage = req.flash('successUpdate')[0] || null;

    res.render('admin/all-recipe',{recipe,deleteMessage,updateMessage});
  })
});

router.get('/all-category',(req,res)=>{
  adminHelper.getCategory().then((category)=>{
    res.render('admin/view-category',{category,deleteError:req.flash('deleteError')});
  })
});

router.get('/view-recipe/:id',(req,res)=>{
  let categoryName=req.params.id;
  adminHelper.getRecipeByCategory(categoryName).then((recipe)=>{
    res.render('admin/all-recipe',{recipe});
  })
})

router.get('/delete-category/:id',(req,res)=>{
  let categoryId = req.params.id;
  adminHelper.deleteCategory(categoryId).then((result)=>{
    req.flash('deleteError','Category deleted successfully');
    res.redirect('/admin/all-category');
  })
});

router.get('/edit-category/:id',(req,res)=>{
  let categoryId = req.params.id;
  adminHelper.getCategoryDetails(categoryId).then((category)=>{
    //console.log(category);
    res.render('admin/edit-category',{category});
  })
});

router.post('/edit-category/:id',(req,res)=>{
  let categoryId = req.params.id;
  adminHelper.updateCategory(categoryId,req.body).then((result)=>{
    console.log(result);
    res.redirect('/admin/all-category');
    
  })
});

router.get('/delete-recipe/:id',(req,res)=>{
  let recipeId = req.params.id;
  adminHelper.deleteRecipe(recipeId).then((result)=>{
    req.flash('deleteUpdate','Recipe deleted successfully');
    res.redirect('/admin/all-recipes');
  })
});

router.get('/edit-recipe/:id',(req,res)=>{
  let recipeId = req.params.id;
  adminHelper.getRecipeDetails(recipeId).then((recipe)=>{
    console.log(recipe);
    res.render('admin/edit-recipe',{recipe});
  })
});

router.post('/update-recipe/:id',(req,res)=>{
  let recipeId = req.params.id;
  adminHelper.updateRecipe(recipeId,req.body).then((result)=>{
    req.flash('successUpdate','Recipe updated successfully');
    res.redirect('/admin/all-recipes');
    if(req.files.image){
      let image = req.files.image;
      let imageName = req.body.name;
      image.mv('./public/uploads/recipes/'+imageName+'.png');
    }
  })

});


router.get('/activites',(req,res)=>{
  adminHelper.getRecentActivites().then((activity)=>{
    const activityRecent = activity.reverse()
    res.render('admin/activites',{activityRecent})
  })
  
});

router.get('/recipe/:id',(req,res)=>{
  let recipeId = req.params.id;
  adminHelper.getRecipeDetails(recipeId).then((recipe)=>{
    res.render('admin/view-recipe',{recipe});
  });
});



module.exports = router;
