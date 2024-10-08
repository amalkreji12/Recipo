var db = require('../config/connection');
var collection = require('../config/collections');
const collections = require('../config/collections');
const { reject } = require('bcrypt/promises');
var objectId = require("mongodb").ObjectId;

module.exports = {

    addCategory(category) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.getdb().collection(collections.CATEGORY_COLLECTION).insertOne(category);
                console.log('Category Added');
                resolve(result);
                if (result.acknowledged) {
                    const activity = {
                        action: 'New Category Added: ' + category.name,
                        user: 'Admin',
                        status: 'Added',
                        date: new Date()
                    };
                    db.getdb().collection(collections.ACTIVITY_COLLECTION).insertOne(activity);
                    console.log('Category Updated');

                }
            } catch (err) {
                console.error('Error adding category:', err);
                reject(err);
            }
        });
    },

    addRecipe(data) {
        return new Promise(async (resolve, reject) => {
            const recipe = await db.getdb().collection(collections.RECIPE_COLLECTION).insertOne(data).then((result) => {
                console.log('Recipe Added');
                resolve(result);
                if (result.acknowledged) {
                    const activity = {
                        action: 'New Recipe Added: ' + data.name,
                        user: 'Admin',
                        status: 'Added',
                        date: new Date()
                    };
                    db.getdb().collection(collections.ACTIVITY_COLLECTION).insertOne(activity);
                    console.log('Category Updated');

                };
            })

        })
    },

    getTotalRecipes() {
        return new Promise(async (resolve, reject) => {
            await db.getdb().collection(collections.RECIPE_COLLECTION).find().count().then((total) => {
                resolve(total);
            });

        })
    },

    getTotalCategory() {
        return new Promise(async (resolve, reject) => {
            await db.getdb().collection(collections.CATEGORY_COLLECTION).find().count().then((total) => {
                resolve(total);
            })
        })
    },

    getRecentActivites() {
        return new Promise(async (resolve, reject) => {
            await db.getdb().collection(collections.ACTIVITY_COLLECTION).find().toArray().then((activity) => {
                resolve(activity);
            })
        })
    },

    getCategory() {
        return new Promise(async (resolve, reject) => {
            await db.getdb().collection(collections.CATEGORY_COLLECTION).find().toArray().then((category) => {
                resolve(category);
            })
        })
    },

    deleteCategory(categoryId) {
        return new Promise(async (resolve, reject) => {
            const category = await db.getdb().collection(collections.CATEGORY_COLLECTION).findOne({ _id: new objectId(categoryId) });

            await db.getdb().collection(collections.CATEGORY_COLLECTION).deleteOne({ _id: new objectId(categoryId) }).then((result) => {
                console.log(result);
                resolve(result);
                if (result.acknowledged) {
                    const activity = {
                        action: 'Category Deleted :' + category.name,
                        user: 'Admin',
                        status: 'Deleted',
                        date: new Date()
                    };
                    db.getdb().collection(collections.ACTIVITY_COLLECTION).insertOne(activity);
                    console.log('Category Updated');

                }
            })
        })

    },

    getAllRecipes() {
        return new Promise(async (resolve, reject) => {
            await db.getdb().collection(collections.RECIPE_COLLECTION).find().toArray().then((recipe) => {
                //console.log(recipe);
                resolve(recipe);
            })
        })
    },

    getCategoryDetails(categoryId) {
        return new Promise(async (resolve, reject) => {
            await db.getdb().collection(collections.CATEGORY_COLLECTION).findOne({ _id: new objectId(categoryId) }).then((category) => {
                resolve(category);
            })
        })
    },

    updateCategory(categoryId, categoryDetails) {
        return new Promise(async (resolve, reject) => {
            await db.getdb().collection(collections.CATEGORY_COLLECTION).updateOne({ _id: new objectId(categoryId) }, {
                $set: {
                    name: categoryDetails.name,
                    image: categoryDetails.image
                }
            }).then((result) => {
                resolve(result);
                if (result.acknowledged) {
                    const activity = {
                        action: 'Category Updated :' + categoryDetails.name,
                        user: 'Admin',
                        status: 'Completed',
                        date: new Date()
                    };
                    db.getdb().collection(collections.ACTIVITY_COLLECTION).insertOne(activity);
                    console.log('Category Updated');

                }
            })

        })

    },

    deleteRecipe(recipeId) {
        return new Promise(async (resolve, reject) => {
            const recipe = await db.getdb().collection(collections.RECIPE_COLLECTION).findOne({ _id: new objectId(recipeId) });

            await db.getdb().collection(collections.RECIPE_COLLECTION).deleteOne({ _id: new objectId(recipeId) }).then((result) => {
                resolve(result);
                if (result.acknowledged) {
                    const activity = {
                        action: 'Recipe Deleted :' + recipe.name,
                        user: 'Admin',
                        status: 'Deleted',
                        date: new Date()
                    };
                    db.getdb().collection(collections.ACTIVITY_COLLECTION).insertOne(activity);
                    console.log('Category Updated');

                }
            });
        });
    },

    getRecipeDetails(recipeId) {
        return new Promise(async (resolve, reject) => {
            await db.getdb().collection(collections.RECIPE_COLLECTION).findOne({ _id: new objectId(recipeId) }).then((recipe) => {
                resolve(recipe);
            })
        })
    },

    updateRecipe(recipeId, recipeDetails) {
        return new Promise(async (resolve, reject) => {
            await db.getdb().collection(collections.RECIPE_COLLECTION).updateOne({ _id: new objectId(recipeId) }, {
                $set: {
                    name: recipeDetails.name,
                    description: recipeDetails.description,
                    ingredients: recipeDetails.ingredients,
                    making: recipeDetails.steps,
                    email: recipeDetails.email,
                    category: recipeDetails.category
                }
            }).then((result) => {
                resolve(result);
                // console.log(result);
                if (result.acknowledged) {
                    const activity = {
                        action: 'Recipe Updated :' + recipeDetails.name,
                        user: 'Admin',
                        status: 'Completed',
                        date: new Date()
                    };
                    db.getdb().collection(collections.ACTIVITY_COLLECTION).insertOne(activity);
                    console.log('Category Updated');

                }

            });
        });
    },

    getRecipeByCategory(categoryName) {
        return new Promise(async (resolve, reject) => {
            let recipes = await db.getdb().collection(collections.RECIPE_COLLECTION).find({ category: categoryName }).toArray();
            resolve(recipes);
        })
    },

    getAllUsers() {
        return new Promise(async (resolve, reject) => {
            db.getdb().collection(collections.USER_COLLECTION).find().toArray().then((users) => {
                resolve(users);
            })
        })
    },

    getUserById(userId) {
        return new Promise(async (resolve, reject) => {
            db.getdb().collection(collections.USER_COLLECTION).findOne({ _id: new objectId(userId) }).then((user) => {
                resolve(user);
            })
        })
    },

    getUserActivities(userId) {
        return new Promise(async (resolve, reject) => {
            let activites = await db.getdb().collection(collections.ACTIVITY_COLLECTION).find({UserId: new objectId(userId)}).sort({date:-1}).toArray();
            resolve(activites);
        })
    },

    getUserUploadedRecipes(userId){
        return new Promise(async(resolve,reject)=>{
            db.getdb().collection(collections.RECIPE_COLLECTION).find({userId:new objectId(userId)}).toArray().then((recipes)=>{
                resolve(recipes);
            })
        })
    },

    deleteUserAccountByAdmin(userId){
        return new Promise(async(resolve,reject)=>{
            db.getdb().collection(collections.USER_COLLECTION).deleteOne({_id:new objectId(userId)}).then((result)=>{
                resolve(result);
            })
        })
    }





}