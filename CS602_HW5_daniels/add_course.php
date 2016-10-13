<?php

    require_once ('db.php');
    require_once ('utilities.php');


    $error = '';
    $courseId = '';
    $courseName = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $courseId = $_POST['courseId'];
        $courseName = $_POST['courseName'];

        if ($courseId && $courseName) {
            try {

            } catch (PDOException $error) {

            }

            $addCourse = addCourse($courseId, $courseName);

            if ($addCourse) {
                echo '<script>window.location = "/cs602/CS602_HW5_daniels/course_list.php";</script>';
                exit();
            } else {
                $error = $db->errorInfo()[2];
            }
        } else {
            $error = 'All courses must have both a course ID and course name.';
        }
    }

?>

<? if ($error) { ?>
    <div class="alert alert-danger" role="alert"><? echo  $error ?></div>
<? } ?>

<form method="post" action="<? echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
    <div class="form-group">
        <label for="courseId">Course ID</label>
        <input type="text" class="form-control" id="courseId" name="courseId" maxlength="12" value="<? echo $courseId ?>">
    </div>
    <div class="form-group">
       <label for="courseName">Course Name</label>
        <input type="text" class="form-control" id="courseName" name="courseName" maxlength="255" value="<? echo $courseName ?>">
    </div>
    <button type="submit" class="btn btn-primary">Add Course</button>
</form>