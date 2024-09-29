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
    const total = {recipeCount,categoryCount,activity};
    res.render('admin/admin-home',{admin:true,total});
  });

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
});

router.get('/add-recipe',(req,res)=>{
  res.render('admin/add-recipe');
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
        res.redirect('/admin/add-recipe');
      }else{
        console.log(err);
      }
    }))
    
  })
});

router.get('/all-recipes',(req,res)=>{
  adminHelper.getAllRecipes().then((recipe)=>{
    res.render('admin/all-recipe',{recipe});
  })
  

});

router.get('/all-category',(req,res)=>{
  adminHelper.getCategory().then((category)=>{
    res.render('admin/view-category',{category});
  })
  
});

router.get('/delete-category/:id',(req,res)=>{
  let categoryId = req.params.id;
  adminHelper.deleteCategory(categoryId).then((result)=>{
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
})



module.exports = router;
