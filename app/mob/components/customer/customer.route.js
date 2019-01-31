const controller = require('./customer.ctrl');


/*
* routes
 */

app.post('/mob/v1.0/search', controller.search);
app.post('/mob/v1.0/master-select', controller.generateCutomerObj);
app.get('/mob/v1.0/ciam-details/:id', controller.ciamDetails);
app.post('/mob/v1.0/push-user', controller.pushUser);
