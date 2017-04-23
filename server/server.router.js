
var multer = require('multer');
var controller = require('./server.controller');

// multer configuration
var memStorage = multer.memoryStorage();

module.exports = function (app) {

    // Route for main index page
    app.get('/', controller.sendIndexFile);

    // Data APIs routes
    app.get('/instrument/:id', controller.getInstrumentPosition);
    app.get('/showAll', controller.getAllInstrumentsPosition);
    app.post('/saveInstrumentPosition', controller.saveInstrumentPosition);
    app.post('/processFile', multer({ storage: memStorage }).single('file'), controller.processFile);

    // Catch all invalid routes
    app.all('*', controller.invalidRoutes);
};