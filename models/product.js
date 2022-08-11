const {Schema, model} = require('mongoose')

const PorductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    available: {
        type: String,
        default: true
    }
})

PorductSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject()
    return data
}

module.exports = model('Product', PorductSchema)