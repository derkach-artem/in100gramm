const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    _owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    url: String,

    public_id: String
});

var Image = mongoose.model('Image', imageSchema);

module.exports = Image;