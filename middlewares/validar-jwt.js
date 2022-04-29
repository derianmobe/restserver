const { response } = require('express')
const { request } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token')

    console.log(token)

    if(!token) {
        return res.status(401).json({ 
            msg: 'No hay token en la peticion'
        })
    }

    try {
        const { uid }  = jwt.verify(token, process.env.PRIVATE_KEY) 

        // Leer el usuario que corresponde al uuid
        const user = await Usuario.findOne({uid})

        if(!user) {
            return res.status(401).json({
                msg: "Token no válido - Usuario no existe en DB"
            })
        }

        if(!user.estado) {
            return res.status(401).json({
                msg: "Token no válido - Usuario en estado false"
            })
        }

        req.uid = uid
        req.authUser = user 
        next()
    } catch(error){
        res.status(401).json({
            msg: 'Token no válido',
            error
        })
    }
    
}

module.exports = {
    validarJWT
}