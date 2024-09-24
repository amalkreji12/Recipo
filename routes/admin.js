var express = require('express');
var router = express.Router();
var adminHelper = require('../controllers/admin-helper');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin-home',{admin:true});
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
})




module.exports = router;
