const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'

        // Conectar base de datos
        this.conectarDB()

        // Middlewares
        this.middlewares()

        // Rutas
        this.routes()
    }

    async conectarDB() {
        await dbConnection()
    }

    middlewares() {
        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json())

        // Folder public
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/user'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`App is listening on port ${this.port}`)
        })
    }
}

module.exports = Server