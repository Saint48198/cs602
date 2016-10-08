<?php
    require_once ('db.php');
    require_once ('utilities.php');

    $allCourses = getAllCourses();
    $error = '';
    $courseId = '';
    $firstName = '';
    $lastName = '';
    $email = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $courseId = $_POST['courseId'];
        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $email = $_POST['email'];

        if ($courseId && $firstName && $lastName && $email) {
            $addStudent = addStudent($courseId, $firstName, $lastName, $email);

            if ($addStudent) {
                echo "<script>window.location = '/?course_id=$courseId';</script>";
                exit();
            } else {
                $error = $db->errorInfo()[2];
            }

        } else {
            $error = 'All fields must be filled in!';
        }
    }

?>

<? if ($error) { ?>
    <div class="alert alert-danger" role="alert"><? echo  $error ?></div>
<? } ?>

<form method="post" action="<? echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">

    <div class="form-group">
        <label for="course">Course</label>
        <select class="form-control" id="course" name="courseId">
            <? foreach ($allCourses as $row) { ?>

                <option value="<? echo $row['courseId'] ?>"<? if ($row['courseId'] === $courseId) { ?> SELECTED<? } ?>><? echo $row['courseId'] . ' - ' .  $row['courseName'] ?></option>
            <? } ?>
        </select>
    </div>
    <div class="form-group">
        <label for="firstName">First Name</label>
        <input type="text" class="form-control" id="firstName" name="firstName" maxlength="255" value="<? echo $firstName ?>">
    </div>
    <div class="form-group">
        <label for="lastName">Last Name</label>
        <input type="text" class="form-control" id="lastName" name="lastName" maxlength="255" value="<? echo $lastName ?>">
    </div>
    <div class="form-group">
        <label for="email">Email</label>
        <input type="text" class="form-control" id="email" name="email" maxlength="255" value="<? echo $email ?>">
    </div>
    <div class="form-group">
        <button type="submit" class="btn btn-primary">Add Student</button>
    </div>
</form>