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


module.exports = {
    validateRole,
    existsEmail,
    existsUserId
}