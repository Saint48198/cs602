<?php
    require_once ('db.php');
    require_once ('utilities.php');

    $allCourses = getAllCourses();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Course Manager :: Course List</title>

    <!-- Bootstrap -->
    <link href="bower_components/bootstrap/dist/css/bootstrap.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- Site styles -->
    <link href="styles/main.css" rel="stylesheet">
</head>
<body>
<header class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="/cs602/CS602_HW6_daniels/">Course Manager</a>
        </div>
    </div>
</header>

<main class="container">
    <div class="row">
        <div class="col-sm-12">
            <h1>Course List</h1>
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                <? foreach ($allCourses as $row) { ?>
                    <tr>
                        <td><a href="/cs602/CS602_HW6_daniels/?course_id=<? echo $row['courseId'] ?>"><? echo $row['courseId'] ?></a></td>
                        <td><? echo $row['courseName'] ?></td>
                    </tr>
                <? } ?>
                </tbody>
            </table>
            <hr>
            <h2>Add Course</h2>
            <? include ('add_course.php') ?>
            <br>
            <div>
                <a href="/cs602/CS602_HW6_daniels/">List Students</a>
            </div>
        </div>
    </div>
</main>

<footer class="footer">
    <div class="container">
        &copy; <? echo getCopyYear() ?> Scott Daniels
    </div>
</footer>
</body>
</html>
