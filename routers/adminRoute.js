const router = require('express').Router();
const admin_controller = require('../controllers/adminController');
const { isSchemaValid } = require('../middleware/joiValidator');
const admin_validation = require('../middleware/validation/adminValidation');

router.post('/addEmployee', isSchemaValid(admin_validation.createEmployee), admin_controller.createEmployee);
router.get('/allEmployee', admin_controller.allEmployee);
router.post('/oneEmployee', isSchemaValid(admin_validation.selectDeleteEmployee), admin_controller.selectEmployee);
router.patch('/editEmployee', isSchemaValid(admin_validation.editEmoloyee), admin_controller.editEmployee);
router.delete('/delEmployee', isSchemaValid(admin_validation.selectDeleteEmployee), admin_controller.deleteEmployee);
router.post('/addReview', isSchemaValid(admin_validation.addReview), admin_controller.addReview);
router.patch('/editReview', isSchemaValid(admin_validation.editReview), admin_controller.editReview);
router.delete('/delReview', isSchemaValid(admin_validation.deleteReview), admin_controller.deleteReview);
router.post('/replyAReview', isSchemaValid(admin_validation.replyReview), admin_controller.replyReview);
router.patch('/editReply', isSchemaValid(admin_validation.editReply), admin_controller.editReply);
router.get('/allUsers', admin_controller.allUsers);
router.delete('/delUsers', isSchemaValid(admin_validation.deleteUser), admin_controller.deleteUser);
//router.delete('/delEmploye', admin_controller.DeleteEmploye);

module.exports = router;