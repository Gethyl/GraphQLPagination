import mongoose from 'mongoose';

var Schema = mongoose.Schema;

// create a schema
var gpSchema = new Schema({
    id: Number,
    item: String
}, {collection:"GraphqlPagination"});

// the schema is useless so far
// we need to create a model using it
var graphPageModel = mongoose.model('graphPageModel', gpSchema);

export default graphPageModel	