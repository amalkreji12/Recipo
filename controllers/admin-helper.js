var db = require('../config/connection');
var collection = require('../config/collections');
const collections = require('../config/collections');
var objectId = require("mongodb").ObjectId;

module.exports = {

    addCategory(category) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.getdb().collection(collections.CATEGORY_COLLECTION).insertOne(category);
                console.log('Category Added');
                resolve(result); // Resolve with the result of the insertion
            } catch (err) {
                console.error('Error adding category:', err);
                reject(err); // Reject the promise with the error
            }
        });
    },

    addRecipe(data){
        return new Promise(async(resolve,reject)=>{
            const recipe = await db.getdb().collection(collections.RECIPE_COLLECTION).insertOne(data).then((result)=>{
                console.log('Recipe Added');
                resole(result);
            })

        })
    },

    getTotalRecipes(){
        return new Promise(async(resolve,reject)=>{
            await db.getdb().collection(collections.RECIPE_COLLECTION).find().count().then((total)=>{
                resolve(total);
            });
            
        })
    },

    getTotalCategory(){
        return new Promise(async(resolve,reject)=>{
            await db.getdb().collection(collections.CATEGORY_COLLECTION).find().count().then((total)=>{
                resolve(total);
            })
        })
    },

    getCategory(){
        return new Promise(async(resolve,reject)=>{
            await db.getdb().collection(collections.CATEGORY_COLLECTION).find().toArray().then((category)=>{
                resolve(category);
            })
        })
    },

    deleteCategory(categoryId){
        return new Promise(async(resolve,reject)=>{
            await db.getdb().collection(collections.CATEGORY_COLLECTION).deleteOne({_id:new objectId(categoryId)}).then((result)=>{
                console.log(result);
                resolve(result);
            })
        })
        
    },

    getAllRecipes(){
        return new Promise(async(resolve,reject)=>{
            await db.getdb().collection(collections.RECIPE_COLLECTION).find().toArray().then((recipe)=>{
                //console.log(recipe);
                resolve(recipe);
            })
        })
    }
    




}