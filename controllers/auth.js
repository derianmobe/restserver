const bcryptjs = require('bcryptjs')
const  { response, request } = require('express')
const { generarJWT } = require('../helpers/generar-jwt')
const Usuario = require('../models/usuario')



const login = async(req = request, res = response) => {

    const { email, password } = req.body

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({email})
        if(!usuario) {
            return res.status(400).json({
                msg: 'Email o password no son correctos --> correo'
            })
        }

        // Verificar si el usuario está activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Email o password no son correctos --> estado: false'
            })
        }

        // Vierificar el password
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Email o password no son correctos --> password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)
        
        res.json({
            usuario,
            token
        })
    }catch(error) {
        return res.status(500).json({
            msg: 'Algo salió mal',
            error
        })
    }
}

module.exports = {
    login
}