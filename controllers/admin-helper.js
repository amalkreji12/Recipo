var db = require('../config/connection');
var collection = require('../config/collections');
const collections = require('../config/collections');

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
    }
    




}