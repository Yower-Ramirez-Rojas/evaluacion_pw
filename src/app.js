const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.static('public')); 


const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'st_soporte'
});


conexion.connect((error) => {
    if (error) {
        console.error('Error crítico al conectar a MariaDB/MySQL:', error.message);
    } else {
        console.log('¡Conexión exitosa a la Base de Datos st_soporte!');
    }
});


app.get('/api/tickets', (req, res) => {
    const querysql = 'SELECT * FROM tickets ORDER BY id DESC';
    
    conexion.query(querysql, (error, resultados) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al consultar la base de datos.' });
        }
        return res.status(200).json(resultados);
    });
});


app.post('/api/tickets', (req, res) => {
    const { titulo, descripcion, priorities } = req.body;
    
    
    const prioridadSeleccionada = req.body.prioridad || 'Baja';

    
    if (!titulo || !descripcion) {
        return res.status(400).json({ mensaje: 'Error: El título y la descripción son obligatorios.' });
    }

    const queryInsertar = 'INSERT INTO tickets (titulo, descripcion, prioridad) VALUES (?, ?, ?)';
    
    conexion.query(queryInsertar, [titulo, descripcion, prioridadSeleccionada], (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al insertar el registro en la base de datos.' });
        }

        
        return res.status(201).json({
            mensaje: 'Ticket registrado con éxito en la Base de Datos',
            ticket: {
                id: resultado.insertId,
                titulo: titulo,
                descripcion: descripcion,
                prioridad: prioridadSeleccionada
            }
        });
    });
});


app.listen(PORT, () => {
    console.log(`Servidor escolar con Base de Datos corriendo en: http://localhost:${PORT}`);
});