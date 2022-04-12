const  { response } = require('express')
 
const getUsers  = (req, res = response) => {

    const { nombre } = req.query

    res.json({
        msg: 'get API - Controlador',
        nombre
    })
}

const postUser = (req, res = response) => {
    const { nombre, edad} = req.body

    res.json({
        msg: 'post API - Controlador',
        nombre, 
        edad
    })
}

const putUser = (req, res = response) => {
    const id = req.params.id
    res.json({
        msg: 'put API - Controlador',
        id
    })
}

const deleteUser = (req, res = response) => {
    res.json({
        msg: 'delete API - Controlador'
    })
}

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser
}