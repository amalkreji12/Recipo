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
    }

}
