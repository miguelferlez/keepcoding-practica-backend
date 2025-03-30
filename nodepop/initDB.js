import readline from 'node:readline/promises';
import connectMongoose from './lib/connectMongoose.js';
import Product from './models/Product.js';
import User from './models/User.js';

const connection = await connectMongoose();
console.log(`Connected to MongoDB: ${connection.name}`);

const answer = await question('Are you sure you want to delete database collection? [y/N] ');

if(answer.toLowerCase() !== 'y') {
    console.log('Operation cancelled!');
    process.exit();
}

await initUsers();
await initProducts();
await connection.close();

async function initUsers() {
    const deleteResult = await User.deleteMany();
    console.log(`Removed ${deleteResult.deletedCount} users!`);

    const insertResult = await User.insertMany([
        { name: 'Admin', email: 'admin@example.com', password: await User.hashPassword('1234') },
        { name: 'User', email: 'user@example.com', password: await User.hashPassword('1234') },
        { name: 'Bob', email: 'bob@example.com', password: await User.hashPassword('1234') },
        { name: 'Alice', email: 'alice@example.com', password: await User.hashPassword('1234') },
    ]);
    console.log(`Inserted ${insertResult.length} users!`);

}

async function initProducts() {
    const deleteResult = await Product.deleteMany();
    console.log(`Removed ${deleteResult.deletedCount} products!`);

    const [admin, user, bob, alice] = await Promise.all([
        User.findOne({ email:'admin@example.com' }),
        User.findOne({ email:'user@example.com' }),
        User.findOne({ email:'bob@example.com' }),
        User.findOne({ email:'alice@example.com' })
    ]);

    const insertResult = await Product.insertMany([
        { name: 'Lorem', price: 20, image: './images/product1-1.jpg', owner: admin._id, tags:['lifestyle'] },
        { name: 'Ipsum', price: 13.99, image: './images/product2-1.jpg', owner: admin._id, tags:['lifestyle'] },
        { name: 'Dolor sit', price: 9.95, image: './images/product3-1.jpg', owner: admin._id, tags:['lifestyle'] },
        { name: 'Amet', price: 35, image: './images/product4-1.jpg', owner: user._id, tags:['lifestyle'] },
        { name: 'Consectetur', price: 66, image: './images/product5-1.jpg', owner: alice._id, tags:['motor']},
        { name: 'Adiscing elit', price: 42.50, image: './images/product6-1.jpg', owner: bob._id, tags:['mobile'] },
        { name: 'Duis dignissim', price: 50, image: './images/product7-1.jpg', owner: alice._id, tags:['work'] },
        { name: 'Aliquet', price: 4, image: './images/product8-1.jpg', owner: alice._id, tags:['lifestyle'] },
        { name: 'Pellentesque', price: 7.99, image: './images/product9-1.jpg', owner: alice._id, tags:['lifestyle'] },
        { name: 'Vestibulum', price: 16, image: './images/product10-1.jpg', owner: alice._id, tags:['work, lifestyle, mobile'] },
        { name: 'Curibatur', price: 4200, image: './images/product11-1.jpg', owner: admin._id, tags:['motor'] },
        { name: 'Maecenas', price: 3, image: './images/product12-1.jpg', owner: admin._id, tags:['mobile'] },
        { name: 'Sed dapibus', price: 260, image: './images/product13-1.jpg', owner: admin._id, tags:['mobile'] },
        { name: 'Metus', price: 899, image: './images/product14-1.jpg', owner: admin._id, tags:['work, lifestyle'] },
        { name: 'At lobortis', price: 144.95, image: './images/product15-1.jpg', owner: admin._id, tags:['motor'] },
        { name: 'Auctor', price: 300, image: './images/product16-1.jpg', owner: admin._id, tags:['lifestyle, mobile'] },
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