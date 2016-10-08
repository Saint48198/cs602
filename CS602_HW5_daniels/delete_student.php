<?php
    require_once ('db.php');
    require_once ('utilities.php');

    $error = '';

    if ($_POST['studentId']) {
        $deleteStudent = deleteStudent($_POST['studentId']);

        if (!$deleteStudent) {
            $error = $db->errorInfo()[2];
        }
    } else {
        $error = 'There was an issue deleting the student';
    }

    include ('index.php');
?>