const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();

router.post('/addUser', userController.newUser); // créer un nouvel utilisateur (voir le model pour le body)
router.get('/', userController.getUsers); // renvoi tous les users 
router.get('/name/:name', userController.getUserByName);
router.get('/skill/:skillName', userController.getBySkill);

module.exports = router;