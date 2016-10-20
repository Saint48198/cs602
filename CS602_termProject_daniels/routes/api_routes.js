const express = require('express');
const router = express.Router();

const assessmentController = require('../controllers/assessment/index');
const assignmentController = require('../controllers/assignment/index');
const courseController = require('../controllers/course/index');
const moduleController =  require('../controllers/module/index');
const sessionController = require('../controllers/session/index');
const userController = require('../controllers/user/index');

/* assessment services */
router.post('/assessment', assessmentController.create);
router.post('/assessment/:assessment_id', assessmentController.update);
router.post('/assessment/:assessment_id/delete', assessmentController.delete);
router.post('/assessment/:assessment_id/question', assessmentController.addQuestion);
router.post('/assessment/:assessment_id/question/:qeustion_id', assessmentController.updateQuestion);
router.post('/assessment/:assessment_id/question/:qeustion_id/delete', assessmentController.deleteQuestion);
router.get('/assessment/:assessment_id', assessmentController.show);
router.get('/assessment/:assessment_id/get_questions', assessmentController.getQuestions);
router.get('/assessment/:assessment_id/question/:qeustion_id', assessmentController.getQuestion);

/* assignment  services */
router.post('/assignment', assignmentController.create);
router.post('/assignment/:assignment_id', assignmentController.update);
router.post('/assignment/:assignment_id/delete', assignmentController.delete);
router.get('/assignments', assignmentController.list);
router.get('/assignment/:assignment_id', assignmentController.show);

/* course services */
router.post('/course', courseController.create);
router.post('/course/:course_id', courseController.update);
router.post('/course/:course_id/delete', courseController.delete);
router.post('/course/:course_id/add_teacher', courseController.addTeacher);
router.post('/course/:course_id/add_student', courseController.addStudent);
router.get('/courses', courseController.list);
router.get('/course/:course_id', courseController.show);

/* module  services */
router.post('/module', moduleController.create);
router.post('/module/:module_id', moduleController.update);
router.post('/module/:module_id/delete', moduleController.delete);
router.get('/modules', moduleController.list);
router.get('/module/:module_id', moduleController.show);

/* session services */
router.get('/session', sessionController.session);
router.get('/logout', sessionController.logout);

/* user services */
router.post('/user', userController.create);
router.post('/auth', userController.auth);
router.post('/forgot', userController.getPasswordResetToken);
router.post('/reset/:token', userController.resetPassword);
router.post('/user/:user_id', userController.update);
router.post('/user/:user_id/delete', userController.delete);
router.get('/users', userController.list);
router.get('/user/:user_id', userController.show);
router.get('/reset/:token', userController.resetTokenCheck);


module.exports = router;
