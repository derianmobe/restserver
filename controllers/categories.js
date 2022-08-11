const  { response, request } = require('express')
const { Category } = require('../models')


// Get categories - paginado - total - populate
const getCategories = async (req = request, res = response) => {
    const { limit = 5, desde = 0 } = req.query
    const query = { status: true }

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .skip(Number(desde))
            .limit(Number(limit))
    ])

    res.json({
        total,
        categories
    })

}


// Get category - populate 
const getCategory = async (req = request, res = response) => {
    const id = req.params.id
    const category = await Category.findById(id).populate('user', 'name')
    res.json({
        category
    })
}


// Create category
const createCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase()
    const category = await Category.findOne({name})
    if(category) {
        return res.status(400).json({
            msg: `La categoría ${name} ya existe`
        })
    }


   
    // Generar la data a guardar
    const data = {
        name,
        user: req.authUser._id
    }

    const newCategory = new Category(data)
    await newCategory.save()

    return res.status(201).json({
        newCategory
    })
}

// Update category
const updateCategory = async (req = request, res = response) => {
    const id = req.params.id
    const { status, user, ...data } = req.body

    data.name = data.name.toUpperCase()
    data.user = req.authUser._id

    const category = await Category.findByIdAndUpdate(id, data, {new: true})

    return res.json(
        category
    )
}

// Delete category - status: false
const deleteCategory = async (req = request, res = response) => {
    const id = req.params.id
    const category = await Category.findByIdAndUpdate(id, { status: false }, {new: true})

    return res.json(
        category
    )
}
    


module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}