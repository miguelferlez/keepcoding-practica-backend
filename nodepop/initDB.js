import readline from 'node:readline/promises';
import connectMongoose from './lib/connectMongoose.js';
import Product from './models/Product.js';

const connection = await connectMongoose();
console.log(`Connected to MongoDB: ${connection.name}`);

const answer = await question('Are you sure you want to delete database collection? [y/N] ');

if(answer.toLowerCase() !== 'y') {
    console.log('Operation cancelled!');
    process.exit();
}

await initProducts();
await connection.close();

async function initProducts() {
    const deleteResult = await Product.deleteMany();
    console.log(`Removed ${deleteResult.deletedCount} products!`);

    const insertResult = await Product.insertMany([
        { name: 'Lorem', price: 20, image: './images/product1-1.jpg' },
        { name: 'Ipsum', price: 13.99, image: './images/product2-1.jpg' },
        { name: 'Dolor sit', price: 9.95, image: './images/product3-1.jpg' },
        { name: 'Amet', price: 35, image: './images/product4-1.jpg' },
        { name: 'Consectetur', price: 66, image: './images/product5-1.jpg' },
        { name: 'Adiscing elit', price: 42.50, image: './images/product6-1.jpg' },
        { name: 'Duis dignissim', price: 50, image: './images/product7-1.jpg' },
        { name: 'Aliquet', price: 4, image: './images/product8-1.jpg' },
        { name: 'Pellentesque', price: 7.99, image: './images/product9-1.jpg' },
        { name: 'Vestibulum', price: 16, image: './images/product10-1.jpg' },
    ]);
    console.log(`Inserted ${insertResult.length} products!`);
}

async function question(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const result = await rl.question(prompt);
    
    rl.close();

    return result;
}