const router = require('express').Router();
const LoginController = require('../controllers/loginController');
const CommonController = require('../controllers/commonController');
const { isSchemaValid } = require('../middleware/joiValidator');
const CommonValidation = require('../middleware/validation/commonValidation');
const { adminJwtVerify , userJwtVerify } = require('../middleware/jwtVerify');

router.use('/admin', adminJwtVerify,require('./adminRoute'));
router.use('/user', userJwtVerify,require('./userRoute'));

router.post('/signup', isSchemaValid(CommonValidation.signup),LoginController.signup);
router.post('/login', isSchemaValid(CommonValidation.login),LoginController.login);

router.get('/allEmployee', CommonController.allEmployee);
router.post('/oneEmployee', isSchemaValid(CommonValidation.selectEmployee),CommonController.selectEmployee);
router.post('/addReview', isSchemaValid(CommonValidation.addReview),CommonController.addReview);


module.exports = router;