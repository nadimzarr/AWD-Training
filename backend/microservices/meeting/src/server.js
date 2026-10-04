const app = require('./app');
const Eureka = require('eureka-js-client').Eureka;

const PORT = parseInt(process.env.PORT || '8083', 10);
const HOST = 'localhost';

// ---- Client Eureka ----
const client = new Eureka({
  instance: {
    app: 'MEETING',
    instanceId: `meeting:${PORT}`,
    hostName: HOST,
    ipAddr: '127.0.0.1',
    statusPageUrl: `http://${HOST}:${PORT}/health`,
    healthCheckUrl: `http://${HOST}:${PORT}/health`,
    port: {
      '$': PORT,
      '@enabled': true,
    },
    vipAddress: 'meeting',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
  },
});

app.listen(PORT, () => {
  console.log(`meeting microservice running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);

  client.start((error) => {
    console.log(error || 'Meeting enregistré dans Eureka');
  });
});

// ---- Désenregistrement propre à l'arrêt (Ctrl+C) ----
process.on('SIGINT', () => {
  client.stop(() => {
    console.log('Meeting désenregistré de Eureka');
    process.exit();
  });
});