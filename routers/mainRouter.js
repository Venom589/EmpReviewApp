const router = require('express').Router();
const login_controller = require('../controllers/loginController');
const common_controller = require('../controllers/commonController');
const { isSchemaValid } = require('../middleware/joiValidator');
const common_validation = require('../middleware/validation/commonValidation');
const { adminJwtVerify , userJwtVerify } = require('../middleware/jwtVerify');

router.use('/admin', adminJwtVerify,require('./adminRoute'));
router.use('/user', userJwtVerify,require('./userRoute'));

router.post('/signup', isSchemaValid(common_validation.signup),login_controller.signup);
router.post('/login', isSchemaValid(common_validation.login),login_controller.login);
//router.post('/logout', isSchemaValid(commonValidation.signup), login_controller.Logout);
router.get('/allEmployee', common_controller.allEmployee);
router.post('/oneEmployee', isSchemaValid(common_validation.selectEmployee),common_controller.selectEmployee);
router.post('/addReview', isSchemaValid(common_validation.addReview),common_controller.addReview);


module.exports = router;