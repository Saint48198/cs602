<?php
    require_once ('db.php');
    require_once ('utilities.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Course Manager :: Add Student</title>

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
            <a class="navbar-brand" href="/cs602/CS602_HW5_daniels/">Course Manager</a>
        </div>
    </div>
</header>

<main class="container">
    <div class="row">
        <div class="col-md-12">
            <h1>Add Student</h1>
            <? include ('add_student_form.php') ?>
            <a href="/cs602/CS602_HW5_daniels/">View Student List</a>
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