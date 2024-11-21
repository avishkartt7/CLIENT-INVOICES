 
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/', clientController.getAllClients);
router.get('/:client_name/projects', clientController.getClientProjects);

module.exports = router;