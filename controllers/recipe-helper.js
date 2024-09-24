var db = require('../config/connection');
var collection = require('../config/collections');
const collections = require('../config/collections');

module.exports = {

    getCategory(){
        return new Promise(async(resolve,reject)=>{
            let category = await db.getdb().collection(collections.CATEGORY_COLLECTION).find().toArray();
            resolve(category);
            //console.log(category);
            
        })
    },

    getLatest(){
        return new Promise(async(resolve,reject)=>{
            let latest = await db.getdb().collection(collections.RECIPE_COLLECTION).find().sort({_id:-1}).toArray();
            resolve(latest);
        })
    },

    getIndianRecipe(){
        return new Promise(async(resolve,reject)=>{
            let indian = await db.getdb().collection(collections.RECIPE_COLLECTION).find({'category':'Indian'}).then((result)=>{
                console.log(result);
                resolve(result);
            })
        })
    }

}
