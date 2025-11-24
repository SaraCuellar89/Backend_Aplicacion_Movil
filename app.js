const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

// ------------- Middleware -------------
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// ------------- Conexion de la base de datos -------------
const conect = mongoose.connection
mongoose.connect('mongodb+srv://sara:contrasena_1234@cluster0.mwqrcjn.mongodb.net/')
conect.once('open', () => {
    console.log('Conexion a mongo exitosa')
})
conect.on('error', (e) => {
    console.log('Error: ', e)
})


// ------------- Creacion de colecciones -------------
const Usuario = mongoose.model('Usuario', {
    nombre: String,
    tipo_documento: String,
    documento: Number,
    correo: String,
    contrasena: String
})



// ------------- Rutas -------------
app.get('/', (req, res) => {
    res.send('<h1>Hola desde el backend</h1>')
})

//Registro de usuario
app.post('/registro', async(req, res) => {
    try{
        const {nombre, tipo_documento, documento, correo, contrasena} = req.body

        const buscar_usuario = await Usuario.findOne({documento})

        if(buscar_usuario){
            return res.json({
                success: false,
                message: "ese usuario ya existe"
            })
        }

        const crear_usuario = new Usuario({
            nombre, tipo_documento, documento, correo, contrasena
        })
        await crear_usuario.save()

        res.status(201).json({
            success: true,
            message: "Usuario Registrado"
        })

    }
    catch(error){
        console.error('Error: ' + error)
        res.status(500).json({
            success: false,
            message: 'No se pudo iniciar sesion'
        })
    }
})

//Inicio de Sesion
app.post('/inicio_sesion', async(req, res) => {
    try{
        const {correo, contrasena} = req.body

        const buscar_usuario = await Usuario.findOne({correo, contrasena})

        if(buscar_usuario){
            res.json({
                success: true,
                message: "Inicio de Sesion exitoso"
            })
        }

    }
    catch(error){
        console.error('Error: ' + error)
        res.status(500).json({
            success: false,
            message: 'No se pudo iniciar sesion'
        })
    }
})





// ------------- Escucha del puerto -------------
app.listen(3001, () => {
    console.log('Puerto corriendo en http://localhost:3001')
})