const  { response, request } = require('express')
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs')

 
const getUsers  = async (req = request, res = response) => {

    const { limit = 5, desde = 0 } = req.query
    const query = {estado: true}

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limit))

    // const total = await Usuario.countDocuments(query)

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query), 
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
    ])

    res.json({
        total,
        usuarios
    })
}

const postUser = async (req, res = response) => {

    const { name, email, password, role } = req.body
    const usuario = new Usuario({ name, email, password, role })    

    // Encriptar
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)

    // Guardar DB
    
    await usuario.save()

    res.json({
        usuario
    })
}

const putUser = async (req, res = response) => {
    const id = req.params.id
    const { _id, password, google, email, ...rest } = req.body

    // TODO validar DB
    if(password) {
        const salt = bcryptjs.genSaltSync()
        rest.password = bcryptjs.hashSync(password, salt)
    } 

    const usuario = await Usuario.findByIdAndUpdate(id, rest)

    res.json({
        msg: 'put API - Controlador',
        usuario
    })
}

const deleteUser = async (req = request, res = response) => {
    const { id } = req.params

    // Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id)

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json({
        usuario
    })
}

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser
}