var db = require('../config/connection');
var collection = require('../config/collections');
const collections = require('../config/collections');
var objectId = require("mongodb").ObjectId;
var bcrypt = require('bcrypt');
const { reject } = require('bcrypt/promises');

module.exports = {

    doSignUp(userData){
        return new Promise(async(resolve,reject)=>{
            userData.password = await bcrypt.hash(userData.password,10);
            userData.createdAt = new Date();
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
                        resolve({status:false,passwordIncorrect:true});                      
                    }
                })
            }else{
                console.log('Login Failed');
                resolve({status:false,emailNotFound:true});
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

    submitRecipe(recipe,userId){
        return new Promise(async(resolve,reject)=>{
            recipe.userId = new objectId(userId);
            recipe.createdAt = new Date();
            let category = await db.getdb().collection(collection.CATEGORY_COLLECTION).findOne({'name':recipe.category});
            if(category){
                db.getdb().collection(collection.RECIPE_COLLECTION).insertOne(recipe).then((data)=>{
                    resolve(data);
                    if (data.acknowledged) {
                        const activity = {
                            action: 'New Recipe Added :'+recipe.name,
                            user: 'User :'+userId,
                            status: 'Completed',
                            date: new Date(),
                            UserId : new objectId(userId),
        
                        };
                        db.getdb().collection(collections.ACTIVITY_COLLECTION).insertOne(activity);
                        console.log('Category Updated');
        
                    }
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
                        if (data.acknowledged) {
                            const activity = {
                                action: 'New Recipe Added :'+recipe.name,
                                user: 'User :'+userId,
                                status: 'Completed',
                                date: new Date(),
                                UserId : new objectId(userId),
            
                            };
                            db.getdb().collection(collections.ACTIVITY_COLLECTION).insertOne(activity);
                            console.log('Category Updated');
            
                        }
                    });
                });
            };
        });
    },

    getUserDetails(userId){
        return new Promise(async(resolve,reject)=>{
            await db.getdb().collection(collections.USER_COLLECTION).findOne({_id:new objectId(userId)}).then((user)=>{
                resolve(user);
            });
            
        })
    },

    getUserUploadedRecipe(userId){
        return new Promise(async(resolve,reject)=>{
            await db.getdb().collection(collections.RECIPE_COLLECTION).find({userId:new objectId(userId)}).toArray().then((recipes)=>{
                resolve(recipes);
            })
        })
    },

    updateRecipeByUser(recipeId,recipeDetails,userId){
        return new Promise(async(resolve,reject)=>{
            await db.getdb().collection(collections.RECIPE_COLLECTION).updateOne({_id:new objectId(recipeId)},{
                $set:{
                    name:recipeDetails.name,
                    description:recipeDetails.description,
                    ingredients:recipeDetails.ingredients,
                    making:recipeDetails.making,
                    email:recipeDetails.email,
                    category:recipeDetails.category
                }
            }).then((result)=>{
                resolve(result);
                if (result.acknowledged) {
                    const activity = {
                        action: 'Recipe Updated :'+recipeDetails.name,
                        user: 'User :'+userId,
                        status: 'Completed',
                        date: new Date(),
                        UserId : new objectId(userId),

                    };
                    db.getdb().collection(collections.ACTIVITY_COLLECTION).insertOne(activity);
                    console.log('Category Updated');

                }
            })
        })
    },

    deleteRecipeByUser(recipeId,recipe,userId){
        return new Promise(async(resolve,reject)=>{
            await db.getdb().collection(collections.RECIPE_COLLECTION).deleteOne({_id:new objectId(recipeId)}).then((result)=>{
                resolve(result);
                if (result.acknowledged) {
                    const activity = {
                        action: 'Recipe deleted :'+recipe.name,
                        user: 'User :'+userId,
                        status: 'Deleted',
                        date: new Date(),
                        UserId : new objectId(userId),

                    };
                    db.getdb().collection(collections.ACTIVITY_COLLECTION).insertOne(activity);
                    console.log('Category Updated');

                }
            })
        })
    },

    changePassword(userId,password){
        return new Promise(async(resolve,reject)=>{
            password.new_password =await bcrypt.hash(password.new_password,10);
            let user = await db.getdb().collection(collections.USER_COLLECTION).findOne({_id:new objectId(userId)});
            if(user){
                bcrypt.compare(password.current_password,user.password).then((status)=>{
                    if(status){
                        db.getdb().collection(collections.USER_COLLECTION).updateOne({_id:new objectId(userId)},{
                            $set:{
                                password:password.new_password,
                                confirm_password:password.confirm_password,
                                updatedAt:new Date()
                            }
                        }).then((result)=>{
                            result.status = true;
                            resolve(result);
                        })
                    }else{
                        resolve({status:false});
                        console.log('Wrong Password');  
                    }
                })
            }else{
                resolve({status:false});
                console.log('User Not Found');
            }
        })
    },

    updateUserName(userId,userName){
        return new Promise(async(resolve,reject)=>{
            db.getdb().collection(collections.USER_COLLECTION).updateOne({_id:new objectId(userId)},{
                $set:{
                    username:userName.username,
                    updatedAt:new Date()
                }
            }).then((result)=>{
                resolve(result);
            })
        })
    },

    updateEmail(userId,email){
        return new Promise(async(resolve,reject)=>{
            db.getdb().collection(collections.USER_COLLECTION).updateOne({_id:new objectId(userId)},{
                $set:{
                    email:email.email,
                    updatedAt:new Date()
                }
            }).then((result)=>{
                resolve(result);
            })
        })
    },

    deleteAccount(userId){
        return new Promise(async(resolve,reject)=>{
            db.getdb().collection(collections.USER_COLLECTION).deleteOne({_id:new objectId(userId)}).then((result)=>{
                resolve(result);
            })
        })
    }



}
