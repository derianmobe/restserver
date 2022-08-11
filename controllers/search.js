const { request, response } = require("express");
const { Category, Product } = require("../models");
const { ObjectId } = require('mongoose').Types
const Usuario = require('../models/usuario')


const collections = [
    'usuarios',
    'roles',
    'categories',
    'products'
]

const searchUsers = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term)
    if(isMongoId) {
        const user = await Usuario.findById(term)
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regex = new RegExp(term, 'i')

    const users = await Usuario.find({
        $or: [{name: regex}, {email: regex}],
        $and: [{estado: true}]
    })

    res.json({
        results: users
    })
}

const searchCategory = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term)
    if(isMongoId) {
        const category = await Category.findById(term)
        return res.json({
            results: (category) ? [category] : []
        })
    }

    const regex = new RegExp(term, 'i')
    const category = await Category.find({name: regex, status: true})

    res.json({
        results: category
    })
}

const searchProduct = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term)
    if(isMongoId) {
        const product = await Product.findById(term)
        return res.json({
            results: (product) ? [product] : []
        })
    }

    const regex = new RegExp(term, 'i')
    const product = await Product.find({name: regex, status: true})

    res.json({
        results: product
    })
}

const search = (req = request, res = response) => {
    const { collection, term } = req.params
    if(!collections.includes(collection)) {
        return res.status(400).json({
            msg: `That collection is not allowed`
        })
    }

    switch (collection) {
        case 'usuarios':
            searchUsers(term, res)
            break;
        case 'categories':
            searchCategory(term, res)
            break;
        case 'products':
            searchProduct(term, res)
            break;
        default:
            res.status(500).json({
                msg: 'Ops!'
            })
            break;
    }
}

module.exports = {
    search
}