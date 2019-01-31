/*
 * @desc Routes for Common Admin user APIs
 */
var users = require('./users.ctrl')

app.post('/admin-login', users.login);
app.post('/users', users.create);
app.post('/create/users', users.create);
app.get('/users-list', users.getList);
app.get('/users/:id', users.viewDetails);
app.put('/users/:id', users.update);
app.get('/users/link-verification/:code', users.activationLinkVerify);
app.post('/users/account-activation', users.accountActivate);
app.delete('/users/:id', users.delete);



app.post('/users/changePassword', users.changePassword);
app.get('/users/roleRights/:id', users.roleAndRights);
app.post('/users/forgotPasswordEmail', users.forgotPasswordEmail);
app.post('/users/forgotPasswordTokenCheck', users.forgotPasswordTokenCheck);
app.post('/users/forgotResetPassword', users.forgotResetPassword);