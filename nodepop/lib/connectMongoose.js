import mongoose from 'mongoose';

function connectMongoose() {
    return mongoose.connect('mongodb://localhost/nodepopdb')
        .then(mongoose => mongoose.connection);
}

export default connectMongoose;