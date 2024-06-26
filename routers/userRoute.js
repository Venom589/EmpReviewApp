const router = require('express').Router();
const user_controller = require('../controllers/userController');
const { isSchemaValid } = require('../middleware/joiValidator');
const user_validation = require('../middleware/validation/userValidation');

router.get('/allEmploye',user_controller.AllEmployee);
router.post('/oneEmploye', isSchemaValid( user_validation.select_employe),user_controller.SelectEmploye);
router.post('/addReview', isSchemaValid( user_validation.add_review),user_controller.AddReview);
router.post('/editName', isSchemaValid( user_validation.edit_name),user_controller.EditName);
router.post('/editReview', isSchemaValid( user_validation.edit_review),user_controller.EditReview);

module.exports = router;