<?php
    $dsn = 'mysql:host=localhost;dbname=cs602';
    $username = 'cs602_user';
    $password = 'cs602_secret';

    try {
        $db =  new PDO($dsn, $username, $password);
    } catch (PDOException $error) {
        $error_message = $error->getMessage();
        include('database_error.php');
        exit();
    }