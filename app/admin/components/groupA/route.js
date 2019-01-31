const controller = require('./groupA.ctrl.js');


/*
* routes
 */

app.post('/import-csv-hr', controller.importHrData);
app.get('/get-data/:type/:limit',controller.getBulkRecodes);
app.post('/import-csv-scholarshipData',controller.scholarshipData);
app.post('/importProntoData',controller.importProntoData);
app.put('/update-asnc',controller.updateAsnc);