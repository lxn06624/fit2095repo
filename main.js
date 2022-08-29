const mongoose = require('mongoose');
// referencing our schemas:
const Author = require('./models/author');
const Book = require('./models/book');
// Create a Mongoose URL string which has syntax: mongodb://ServerAddress: Port//DbName
let url='mongodb://localhost:27017/libDB';
//connect
mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');

//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection. 
var authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    age: {
        type: Number,
        validate: {
            validator: function (ageValue) {
                return ageValue >= 10 && ageValue <= 110;
            },
            message: 'Age should be a number between 10 and 110'
        }
    },
    // age: { type: Number, min: 5, max: 20 },

    //The field 'created' is an object with two properties: the type and the field's default value if no value is provided.
    created: {
        type: Date,
        default: Date.now
    }
});
//Mongoose model provides an interface to the database for creating, querying, updating, deleting records
module.exports = mongoose.model('Author', authorSchema);

let bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    isbn: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    created: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Book', bookSchema);

let author1 = new Author({
    _id: new mongoose.Types.ObjectId(),
    name: {
        firstName: 'Tim',
        lastName: 'John'
    },
    age: 80
});

author1.save(function (err) {
    if (err) throw err;
    console.log('Author successfully Added to DB');

    var book1 = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: 'FIT2095 Book ',
        author: author1._id,
        isbn: '123456',
    });

    book1.save(function (err) {
        if (err) throw err;
        console.log('Book1 successfully Added to DB');
    });

    var book2 = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: 'MEAN Stack with FIT2095',
        author: author1._id
    });

    book2.save(function (err) {
        if (err) throw err;

        console.log('Book2 successfully add to DB');
    });
});
});

//Find
Book.find({ 'name.firstName': 'Tim' }, function (err, docs) {
    // docs is an array
});
Author.find({ 'name.firstName': 'Tim' }, 'age', function (err, docs) {
    //docs is an array
    console.log(docs);
});
Model.findOne({'name.firstName':'Tim'}, 'age', function (err, doc) {
    //doc is a document 
});
Author.findById(author1._id, 'age', function (err, docs) {
    console.log(docs);
});

//Where
Author.where({ 'name.firstName': /^T/ }).where('age').gte(25).exec(function (err, docs) {
    console.log(docs);
});
Author.where({ 'name.firstName': /^T/ }).where('age').gte(25).lte(35).exec(function (err, docs) {
    console.log(docs);
});
Author.where({ 'name.firstName': /^T/ }).where('age').gte(25).lte(35).limit(10).exec(function (err, docs) {
    console.log(docs);
});
Author.where({ 'name.firstName': /^T/ }).where('age').gte(25).lte(35).limit(10).sort('age').exec(function (err, docs) {
    console.log(docs);
});

//populate:which allows you reference documents in other collections
Book.find({}).populate('author').exec(function (err, data) {
    console.log(data);
 });

//update
 Author.updateOne({ 'name.firstName': 'Alex' }, { $set: { 'name.firstName': 'John' } }, function (err, doc) {
    console.log(doc);
});

//delete
Author.deleteOne({ 'name.firstName': 'Tim' }, function (err, doc) {
    console.log(doc);
});