<?php

require_once ('./db.php');
require_once ('./utilities.php');

// get parameters and set default variable values
$format = isset($_GET['format']) ?  strtolower (htmlspecialchars($_GET['format'])) : 'json'; // format defaults to JSON
$action = isset($_GET['action']) ? strtolower (htmlspecialchars($_GET['action'])) : '';
$course =  isset($_GET['course']) ? htmlspecialchars($_GET['course']) : '';

define('ACTION_ERROR', 'Action is invalid!');
define('COURSE_ERROR', 'No course ID provided');

$array = null;
$string = '';

// set document header
if ($format === 'xml') {
    header('Content-Type: text/xml');
} else {
    header('Content-type: application/json');
}

// get data
if ($action === 'courses') {
    $array = array('courses' => getAllCourses());
} elseif ($action === 'students' && $course !== '') {
    $array =  array ('students' => getStudents($course));
}

// create document
if ($action && $array) {
    if ($format === 'xml') {

        // loop to create document root
        foreach ($array as $xkey => $row) {
            $label = substr($xkey, 0 , -1); // create container element name based on document root element name

            $string .= '<' . $xkey . '>';

                // loop create each individual record element
                foreach ($row as &$sub_array) {
                    $string .= '<' . $label . '>';
                        // loop to populate record elements with data elements
                        foreach ($sub_array as $ykey => $value) {
                            $string .= '<' . $ykey . '>' . $value . '</' . $ykey . '>';
                        }
                    $string .= '</' . $label . '>';
                }
            $string .= '</' . $xkey . '>';
        }

        echo createXMLString($string);

    } else {
        echo json_encode($array);
    }

} else {
    // determine error message
    $error = ACTION_ERROR;
    if ($action === 'students') {
        $error = COURSE_ERROR;
    }

    // display error if desired formated
    if ($format === 'xml') {
        $string = '<error>
          <message>' . $error . '</message>
        </error>';

        echo  createXMLString($string);
    } else {
        echo json_encode(array('error' => $error));
    }
}