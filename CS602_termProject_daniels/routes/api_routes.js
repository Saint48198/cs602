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
router.post('/assessment/:assessment_id/add_question', assessmentController.addQuestion);
router.get('/assessments', assessmentController.list);
router.get('/assessment/:assessment_id', assessmentController.show);

/* assignment  services */
router.post('/assignment', assignmentController.create);
router.get('/assignments', assignmentController.list);
router.get('assignment/:assignment_id', assignmentController.show);

/* course services */
router.post('/course', courseController.create);
router.post('/course/:course_id', courseController.update);
router.post('/course/:course_id/add_teacher', courseController.addTeacher);
router.post('/course/:course_id/add_student', courseController.addStudent);
router.post('/course/:course_id/add_assessment', courseController.addAssessment);
router.post('/course/:course_id/add_module', courseController.addModule);
router.get('/courses', courseController.list);
router.get('/course/:course_id', courseController.show);

/* module  services */
router.post('/module', moduleController.create);
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
router.get('/users', userController.list);
router.get('/user/:user_id', userController.show);
router.get('/reset/:token', userController.resetTokenCheck);


module.exports = router;
