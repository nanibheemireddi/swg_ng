
const reRegistration = require('./reregistration.ctrl');


app.post('/mob/v1.0/re-registration', reRegistration.registration1);
app.post('/mob/v1.0/afoc-search', reRegistration.ofacSearch);
