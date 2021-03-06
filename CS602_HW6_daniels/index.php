<?php
require_once ('./db.php');
require_once ('./utilities.php');

if (isset($_GET['course_id'])) {
    $course_id = $_GET['course_id'];
    $deleteAction = 'delete_student.php?course_id=' . $course_id;
} else {
    $course_id = null;
    $deleteAction = 'delete_student.php';
}

$allCourses = getAllCourses();
$course = getCourse($course_id);

if (count($course)) {
    $students = getStudents($course['courseId']);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Course Manager</title>

    <!-- Bootstrap -->
    <link href="./bower_components/bootstrap/dist/css/bootstrap.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- Site styles -->
    <link href="./styles/main.css" rel="stylesheet">
</head>
<body>
<header class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="./">Course Manager</a>
        </div>
    </div>
</header>

<main class="wrapper container">
    <? if (isset($error) && $error) {?>
        <div class="alert alert-danger" role="alert"><? echo  $error ?></div>
    <? } ?>

    <div class="row">
        <div class="col-sm-3">
            <nav class="well">
                <ul class="nav nav-pills nav-stacked">
                    <li><b>Courses</b></li>
                    <? foreach ($allCourses as $row) { ?>
                        <li><a href="./?course_id=<? echo $row['courseId'] ?>"><? echo $row['courseId'] ?></a></li>
                    <? } ?>
                </ul>
            </nav>
        </div>
        <div class="col-sm-9">
            <h1>Student List</h1>
            <table class="table table-striped">
                <caption><?php echo $course['courseId'] . ' - ' . $course['courseName'] ?></caption>
                <thead>
                <tr>
                    <th>first name</th>
                    <th>last name</th>
                    <th>email</th>
                    <th>&nbsp;</th>
                </tr>
                </thead>
                <tbody>
                <? foreach ($students as $row) { ?>
                    <tr>
                        <td><? echo $row['firstName'] ?></td>
                        <td><? echo $row['lastName'] ?></td>
                        <td><? echo $row['email'] ?></td>
                        <td>
                            <form method="post" action="<? echo $deleteAction ?>">
                                <input type="hidden" name="studentId" value="<? echo $row['studentId'] ?>">
                                <button type="submit" class="btn btn-danger">Delete</button>
                            </form>
                        </td>
                    </tr>
                <? } ?>
                </tbody>
            </table>
            <div>
                <ul class="nav nav-pills">
                    <li><a href="./add_student.php">Add Student</a></li>
                    <li><a href="./course_list.php">List Courses</a></li>
                </ul>
            </div>
        </div>
    </div>
</main>
<footer class="footer">
    <div class="container">
        &copy; <? echo getCopyYear() ?> Scott Daniels
    </div>
</footer>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="./bower_components/bootstrap/dist/js/bootstrap.js"></script>
</body>
</html>