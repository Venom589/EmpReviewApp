const router = require('express').Router();
const UserController = require('../controllers/userController');
const { isSchemaValid } = require('../middleware/joiValidator');
const UserValidation = require('../middleware/validation/userValidation');

router.get('/allEmployee',UserController.allEmployee);
router.post('/oneEmployee', isSchemaValid( UserValidation.selectEmployee),UserController.selectEmployee);
router.post('/addReview', isSchemaValid( UserValidation.addReview),UserController.addReview);
router.post('/editName', isSchemaValid( UserValidation.editName),UserController.editName);
router.post('/editReview', isSchemaValid( UserValidation.editReview),UserController.editReview);

module.exports = router;