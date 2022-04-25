const mongoose = require('mongoose')


const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        })

        console.log('Base de datos online')

    } catch(err) {
        throw new Error(`Error a la hora de iniciar la base de datos -> ${err}`)
    }
}

module.exports = {
    dbConnection
}