const router = require('express').Router();
const admin_controller = require('../controllers/adminController');
const { isSchemaValid } = require('../middleware/joiValidator');
const admin_validation = require('../middleware/validation/adminValidation');

router.post('/addEmploye', isSchemaValid(admin_validation.create_employe), admin_controller.CreateEmploye);
router.get('/allEmploye', admin_controller.AllEmploye);
router.post('/oneEmploye', isSchemaValid(admin_validation.select_delete_employe), admin_controller.SelectEmploye);
router.patch('/editEmploye', isSchemaValid(admin_validation.edit_emoloye), admin_controller.EditEmploye);
router.delete('/delEmploye', isSchemaValid(admin_validation.select_delete_employe), admin_controller.DeleteEmploye);
router.post('/addReview', isSchemaValid(admin_validation.add_review), admin_controller.AddReview);
router.patch('/editReview', isSchemaValid(admin_validation.edit_review), admin_controller.EditReview);
router.delete('/delReview', isSchemaValid(admin_validation.delete_review), admin_controller.DeleteReview);
router.post('/replyAReview', isSchemaValid(admin_validation.reply_review), admin_controller.ReplyReview);
router.patch('/editReply', isSchemaValid(admin_validation.edit_reply), admin_controller.EditReply);
router.get('/allUsers', admin_controller.AllUsers);
router.delete('/delUsers', isSchemaValid(admin_validation.delete_user), admin_controller.DeleteUser);
//router.delete('/delEmploye', admin_controller.DeleteEmploye);

module.exports = router;