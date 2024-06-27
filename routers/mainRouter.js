const router = require('express').Router();
const login_controller = require('../controllers/loginController');
const common_controller = require('../controllers/commonController');
const { isSchemaValid } = require('../middleware/joiValidator');
const common_validation = require('../middleware/validation/commonValidation');
const { AdminJwtVerify , UserJwtVerify } = require('../middleware/jwtVerify');

router.use('/admin', AdminJwtVerify,require('./adminRoute'));
router.use('/user', UserJwtVerify,require('./userRoute'));

router.post('/signup', isSchemaValid(common_validation.signup),login_controller.Signup);
router.post('/login', isSchemaValid(common_validation.login),login_controller.Login);
//router.post('/logout', isSchemaValid(commonValidation.signup), login_controller.Logout);
router.get('/allEmploye', common_controller.AllEmployee);
router.post('/oneEmploye', isSchemaValid(common_validation.select_employe),common_controller.SelectEmploye);
router.post('/addReview', isSchemaValid(common_validation.add_review),common_controller.AddReview);


module.exports = router;