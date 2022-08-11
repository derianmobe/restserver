const  { response, request } = require('express')
const {Product, Category} = require('../models')


// Get all products
const getProducts = async (req = request, res = response) => {
    const { limit = 5, desde = 0 } = req.query
    const query = {status : true}

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .skip(Number(desde))
            .limit(Number(limit))
    ])

    res.json({
        total,
        products
    })
}

// Get Product - populate
const getProduct = async (req = request, res = response) => {
    const id = req.params.id
    const product = await Product.findById(id).populate('user', 'name')
    res.json({
        product
    })
}

// Create product
const createProduct = async (req = request, res = response) => {
   const {status,  user, ...body} = req.body

   const product = await Product.findOne({name: body.name.toUpperCase()})
   if(product) {
    return res.status(400).json({
        msg: `Product ${product.name} already exists`
    })
   }

    const data = { 
        ...body,
        name: body.name.toUpperCase(),
        user: req.authUser._id
    }

    const newProduct = new Product(data)
    await newProduct.save()

    return res.status(201).json({
        newProduct
    })
}

// Update Product
const updateProduct = async (req = request, res = response) => {
    const id = req.params.id
    const { status, user, ...data } = req.body

    data.name = data.name.toUpperCase()
    data.user = req.authUser._id

    const product = await Product.findByIdAndUpdate(id, data, {new: true})

    return res.json(
        product
    )
}

const deleteProduct = async (req = request, res = response) => {
    const id = req.params.id
    const product = await Product.findByIdAndUpdate(id, {status: false}, {new: true})

    return res.json(
        product
    )
}


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}