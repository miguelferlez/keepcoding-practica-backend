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

async function question(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const result = await rl.question(prompt);
    
    rl.close();

    return result;
}