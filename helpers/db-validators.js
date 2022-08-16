const { Category, Product } = require('../models')
const Role = require('../models/role')
const Usuario = require('../models/usuario')


const validateRole = async (role = '') => {
    const existeRol = await Role.findOne({role})
    if(!existeRol) { 
        throw new Error(`El rol ${role} no existe en la base de datos`)
    }
}

const existsEmail = async (email = '') => {
    const existeEmail = await Usuario.findOne({ email })
    if(existeEmail) {
        throw new Error(`El correo ${email} ya está registrado`)
    }
}

const existsUserId = async (id = '') => {
    const existsUser = await Usuario.findById(id)
    if (!existsUser) {
        throw new Error(`No existe el id: ${id}`)
    }
} 

const existsCategory = async (id = '') => {
    const category = await Category.findById(id)
    if(!category) {
        throw new Error(`No existe categoría con id: ${id}`)
    }
}

const existsProduct = async (id = '') => {
    const product = await Product.findById(id)
    if(!product) {
        throw new Error(`No existe producto con id: ${id}`)
    }
}

const allowedCollections = (collection = '', collections = []) => {
    const isIncluded = collections.includes(collection)
    if(!isIncluded) { 
        throw new Error(`The collection: ${collection} is not allowed, ${collections}`)
    }

    return true
}

module.exports = {
    validateRole,
    existsEmail,
    existsUserId,
    existsCategory,
    existsProduct,
    allowedCollections
}