const handler = require('./handler');
const constructorMethod = (app) => {
  app.use('/', handler);
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;