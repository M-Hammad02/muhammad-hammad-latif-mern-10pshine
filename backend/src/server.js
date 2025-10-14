const { app, logger } = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
async function start() {
try {
await sequelize.authenticate();
console.log('DB connected');
// in dev only
await sequelize.sync();
console.log('✅ About to start server...');
app.listen(PORT, () => {
logger.info(`Server listening on port ${PORT}`);
});
} catch (err) {
logger.error(err, 'Failed to start server');
process.exit(1);
}
}
start();