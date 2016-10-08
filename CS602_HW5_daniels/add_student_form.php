<?php
    require_once ('db.php');
    require_once ('utilities.php');

    $allCourses = getAllCourses();
?>

<form method="post" action="<? echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">

    <div class="form-group">
        <label for="course">Course</label>
        <select class="form-control" id="course" name="courseId">
            <? foreach ($allCourses as $row) { ?>
                <option value="<? echo $row['courseId'] ?>"><? echo $row['courseId'] . ' - ' .  $row['courseName'] ?></option>
            <? } ?>
        </select>
    </div>
    <div class="form-group">
        <label for="firstName">First Name</label>
        <input type="text" class="form-control" id="firstName" name="firstName" value="">
    </div>
    <div class="form-group">
        <label for="lastName">Last Name</label>
        <input type="text" class="form-control" id="lastName" name="lastName" value="">
    </div>
    <div class="form-group">
        <label for="email">Email</label>
        <input type="text" class="form-control" id="email" name="email" value="">
    </div>
    <div class="form-group">
        <button type="submit" class="btn btn-primary">Add Student</button>
    </div>
</form>