const router = require('express').Router();
const user_controller = require('../controllers/userController');
const { isSchemaValid } = require('../middleware/joiValidator');
const user_validation = require('../middleware/validation/userValidation');

router.get('/allEmployee',user_controller.allEmployee);
router.post('/oneEmployee', isSchemaValid( user_validation.selectEmployee),user_controller.selectEmployee);
router.post('/addReview', isSchemaValid( user_validation.addReview),user_controller.addReview);
router.post('/editName', isSchemaValid( user_validation.editName),user_controller.editName);
router.post('/editReview', isSchemaValid( user_validation.editReview),user_controller.editReview);

module.exports = router;