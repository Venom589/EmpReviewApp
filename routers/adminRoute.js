const router = require('express').Router();
const AdminController = require('../controllers/adminController');
const { isSchemaValid } = require('../middleware/joiValidator');
const AdminValidation = require('../middleware/validation/adminValidation');

router.post('/addEmployee', isSchemaValid(AdminValidation.createEmployee), AdminController.createEmployee);
router.get('/allEmployee', AdminController.allEmployee);
router.post('/oneEmployee', isSchemaValid(AdminValidation.selectDeleteEmployee), AdminController.selectEmployee);
router.patch('/editEmployee', isSchemaValid(AdminValidation.editEmployee), AdminController.editEmployee);
router.delete('/delEmployee', isSchemaValid(AdminValidation.selectDeleteEmployee), AdminController.deleteEmployee);
router.post('/addReview', isSchemaValid(AdminValidation.addReview), AdminController.addReview);
router.patch('/editReview', isSchemaValid(AdminValidation.editReview), AdminController.editReview);
router.delete('/delReview', isSchemaValid(AdminValidation.deleteReview), AdminController.deleteReview);
router.post('/replyAReview', isSchemaValid(AdminValidation.replyReview), AdminController.replyReview);
router.patch('/editReply', isSchemaValid(AdminValidation.editReply), AdminController.editReply);
router.get('/allUsers', AdminController.allUsers);
router.delete('/delUsers', isSchemaValid(AdminValidation.deleteUser), AdminController.deleteUser);

module.exports = router;