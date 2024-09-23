const { getdb, connectToDatabase } = require('../config/connection'); // Import the connection methods

async function insertCategories() {
    try {
        await connectToDatabase(); // Ensure database connection is established

        const db = getdb(); // Get the database instance
        if (!db) {
            throw new Error('Database not available');
        }

        const categoriesCollection = db.collection('categories');

        const categories = [
            // { 'name': 'Indian', 'image': 'indian_category.jpg' },
            // { 'name': 'American', 'image': 'american_category.jpg' },
            // { 'name': 'Italian', 'image': 'italian_category.jpg' },
            // { 'name': 'Mexican', 'image': 'mexican_category.jpg' },
            // { 'name': 'Japanese', 'image': 'japanese_category.jpg' },
            { 'name': 'European', 'image': 'european_category.jpg' }
        ];

        const result = await categoriesCollection.insertMany(categories);
        console.log(`${result.insertedCount} categories inserted.`);
    } catch (err) {
        console.error('Error inserting categories:', err);
    }
}

insertCategories();
