const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./data/models');

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexion a MySQL establecida correctamente.');
    
    const server = app.listen(env.app.port, () => {
      console.log(`Servidor ejecutandose en http://localhost:${env.app.port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Error: El puerto ${env.app.port} ya esta en uso.`);
      } else {
        console.error('Error en el servidor:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('No fue posible iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();