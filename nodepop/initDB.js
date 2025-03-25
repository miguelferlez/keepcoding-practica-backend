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
        { name: 'Lorem', price: 20},
        { name: 'Ipsum', price: 13.99},
        { name: 'Dolor sit', price: 9.95},
        { name: 'Amet', price: 35},
        { name: 'Consectetur', price: 66},
        { name: 'Adiscing elit', price: 42.50},
        { name: 'Duis dignissim', price: 50},
        { name: 'Aliquet', price: 4},
        { name: 'Pellentesque', price: 7.99},
        { name: 'Vestibulum', price: 16},
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