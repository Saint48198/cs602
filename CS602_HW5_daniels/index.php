<?php
    require_once ('db.php');
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
          <a class="navbar-brand" href="/">Course Manager</a>
        </div>
      </div>
    </header>

    <main class="wrapper container">
        <div class="row">
            <div class="col-sm-3">
                <nav class="well">
                    <ul class="nav nav-pills nav-stacked">
                        <li>courses</li>
                        <li><a href="/id=#">CS602</a></li>
                    </ul>
                </nav>
            </div>
            <div class="col-sm-9">
                <h1>Student List</h1>
                <table class="table table-striped">
                    <caption>cs601 - Web Application Development</caption>
                    <thead>
                    <tr>
                        <th>first name</th>
                        <th>last name</th>
                        <th>email</th>
                        <th>&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>john</td>
                        <td>doe</td>
                        <td>john@doe.com</td>
                        <td>
                            <button type="button" class="btn btn-danger" data-id="1">Delete</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div>
                    <ul>
                        <li><a href="add_student.php">Add Student</a></li>
                        <li><a href="course_list.php">List Courses</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </main>
    <footer class="footer">
        <div class="container">
            &copy; 2016 Scott Daniels
        </div>
    </footer>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
  </body>
</html>