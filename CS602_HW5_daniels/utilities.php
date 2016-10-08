<?php

function getCourse($id) {
    global $db;

    if ($id) {
        $sql = 'SELECT courseId, courseName FROM sk_courses WHERE courseId=\'' . $id . '\' LIMIT 1';
    } else {
        $sql = 'SELECT courseId, courseName FROM sk_courses ORDER BY courseId LIMIT 1';
    }

    $stmt = $db->prepare($sql);
    $stmt->execute();
    return  $stmt->fetch();
}

function getAllCourses () {
    global $db;

    $sql = 'SELECT courseId, courseName FROM sk_courses ORDER BY courseId';

    return $db->query($sql);
}

function getStudents ($courseId) {
    global $db;

    $sql = 'SELECT studentId, courseId, firstName, lastName, email FROM sk_students WHERE courseId=\'' . $courseId . '\' ORDER BY studentId';

    return $db->query($sql);
}

function addCourse ($courseId, $courseName) {
    global $db;

    $sql = "INSERT INTO sk_courses (courseId, courseName) VALUES ('$courseId', '$courseName')";

    return $db->exec($sql);
}

function addStudent ($courseId, $firstName, $lastName, $email) {
    global $db;

    $sql = "INSERT INTO sk_students (courseId, firstName, lastName, email) VALUES ('$courseId', '$firstName', '$lastName', '$email')";

    return $db->exec($sql);
}

function deleteStudent ($studentId) {
    global $db;

    $sql = "DELETE FROM sk_students WHERE studentId='$studentId'";

    return $db->exec($sql);
}

function getCopyYear () {
    return date("Y");
}