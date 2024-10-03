var db = require('../config/connection');
var collection = require('../config/collections');
const collections = require('../config/collections');
var objectId = require("mongodb").ObjectId;
var bcrypt = require('bcrypt');

module.exports = {

    doSignUp(userData){
        return new Promise(async(resolve,reject)=>{
            userData.password = await bcrypt.hash(userData.password,10);
            db.getdb().collection(collections.USER_COLLECTION).insertOne(userData).then((user)=>{
                resolve(user);
            })
        })
    },

    doLogin(userData){
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false;
            let response = {};
            let user = await db.getdb().collection(collections.USER_COLLECTION).findOne({email:userData.email});
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log('Login Success');
                        response.user = user;
                        response.status = true;
                        resolve(response);  
                    }else{
                        console.log('Login Failed');
                        resolve({status:false});                      
                    }
                })
            }else{
                console.log('Login Failed');
                resolve({status:false});
            }
        })
    },



    getCategory() {
        return new Promise(async (resolve, reject) => {
            let category = await db.getdb().collection(collections.CATEGORY_COLLECTION).find().toArray();
            resolve(category);
            //console.log(category);

        })
    },

    getLatest() {
        return new Promise(async (resolve, reject) => {
            let latest = await db.getdb().collection(collections.RECIPE_COLLECTION).find().sort({ _id: -1 }).toArray();
            resolve(latest);
        })
    },

    getIndianRecipe() {
        return new Promise(async (resolve, reject) => {
            let indian = await db.getdb().collection(collections.RECIPE_COLLECTION).find({ 'category': 'Indian' }).toArray();
            //console.log(indian);
            resolve(indian);
        });
    },

    getAmericanRecipe() {
        return new Promise(async (resolve, reject) => {
            let american = await db.getdb().collection(collections.RECIPE_COLLECTION).find({ 'category': 'American' }).toArray();
            //console.log(american);
            resolve(american);
        });
    },

    getItalianRecipe() {
        return new Promise(async (resolve, reject) => {
            let italian = await db.getdb().collection(collections.RECIPE_COLLECTION).find({ 'category': 'Italian' }).toArray();
            //console.log(american);
            resolve(italian);
        });
    },

    getRecipeDetails(recipeId) {
        return new Promise(async (resolve, reject) => {
            let recipe = await db.getdb().collection(collections.RECIPE_COLLECTION).findOne({ _id: new objectId(recipeId) });
            //console.log(recipe);
            resolve(recipe);

        })
    },

    getRecipeByCategory(category) {
        return new Promise(async (resolve, reject) => {
            let recipe = await db.getdb().collection(collections.RECIPE_COLLECTION).find({ category: category }).toArray();
            //console.log(recipe);
            resolve(recipe);
        })
    },

    submitRecipe(recipe){
        return new Promise(async(resolve,reject)=>{
            let category = await db.getdb().collection(collection.CATEGORY_COLLECTION).findOne({'name':recipe.category});
            if(category){
                db.getdb().collection(collection.RECIPE_COLLECTION).insertOne(recipe).then((data)=>{
                    resolve(data);
                });
            }else{
                const newCategory = {
                    name:recipe.category,
                    image:recipe.category.toLowerCase() + '_category.jpg'
                };
                db.getdb().collection(collection.CATEGORY_COLLECTION).insertOne(newCategory).then((data)=>{
                    resolve(data);
                    db.getdb().collection(collection.RECIPE_COLLECTION).insertOne(recipe).then((data)=>{
                        resolve(data);
                    });
                });
            };
        });
    },



}
