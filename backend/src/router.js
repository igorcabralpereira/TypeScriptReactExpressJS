const express = require('express');
const usersController= require('./controllers/authUserController');
const itemsControllerGet= require('./controllers/itemController');
const removeAccessController = require('./controllers/removeAccess');
const usersMiddleware = require('./middlewares/authUserMiddlewares');
const itemsMiddleware = require('./middlewares/itemMiddlewares');
const itemsModelPost = require('./models/itemModelsPosts');
const itemsModelsUpdate = require('./models/itemModelsUpdate');
const itemsModelsDelete = require('./models/itemModelsDelete');

const router = express.Router();

//router.get('/' , (req, res) => res.status(200).send('Hello, World'));
router.get('/api/user/', usersController.getAllUsers);
router.get('/api/item/', itemsControllerGet.getAllItems);

router.post('/api/item/', itemsMiddleware.validateItems, itemsModelPost.createItems);
router.post('/api/logout/', removeAccessController.removeAccess);
router.post('/api/user/', usersMiddleware.validateCreationUser, usersController.createUser);
router.post('/api/token/', usersMiddleware.validateUser, usersMiddleware.checkToken, usersController.userAccessToken);
//router.post('/api/token/validateAccess/',  usersMiddleware.checkToken);
router.post('/api/token/refresh/', usersMiddleware.checkTokenRefresh, usersController.userRefreshToken);

router.put('/api/item/', itemsModelsUpdate.updateItems);
router.delete('/api/item/' , itemsModelsDelete.DeleteItems);

module.exports = router;