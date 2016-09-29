<?php
    // set default state;
    $displayResults = FALSE;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // get the data from the form
        $income = filter_input(INPUT_POST, 'income', FILTER_VALIDATE_FLOAT);

        // set default error message value
        $error_message = '';

        // validate income
        if ($income === FALSE) {
            $error_message = 'Income must be a valid number.';
        } elseif ($income <= 0) {
            $error_message = 'Income must be greater than zero.';
        }

        // display form page if there is an error otherwise display results
        if ($error_message === '') {
            $displayResults = TRUE;
            $singleTax = incomeTaxSingle($income);
        } else {
            $displayResults = FALSE;
        }
    } 


    function incomeTaxSingle ($value) {
        if ($value <= 9275) {
            return $value * 0.1;
        } elseif ($value >= 9276 && $value <= 37650) {
            return 927.50 + (9275 * 0.15);
        } elseif ($value >= 37651 && $value <= 91150) {
            return 5183.75 + (37650 * 0.25);
        } elseif ($value >= 91151 && $value <= 190150) {
            return 18558.75 + (91150 * 0.28);
        } elseif ($value >= 190151 && $value <= 413350) {
            return 46278.75 + (190150 * 0.33);
        } elseif ($value >= 413351 && $value <= 415050) {
            return 119934.75 + (413350 * 0.35);
        } elseif ($value <= 415051) {
            return 120529.75 + (415050 * 0.396);
        }
    }

    function incomeTaxMarriedJointly ($value) {
        if ($value <= 9275) {

        } elseif ($value >= 9276 && $value <= 37650) {

        } elseif ($value >= 37651 && $value <= 91150) {

        } elseif ($value >= 91151 && $value <= 190150) {

        } elseif ($value >= 190151 && $value <= 413350) {

        } elseif ($value >= 413351 && $value <= 415050) {

        } elseif ($value <= 415051) {
            
        }
    }

    function incomeTaxMarriedSeparately ($value) {
        if ($value <= 9275) {

        } elseif ($value >= 9276 && $value <= 37650) {

        } elseif ($value >= 37651 && $value <= 91150) {

        } elseif ($value >= 91151 && $value <= 190150) {

        } elseif ($value >= 190151 && $value <= 413350) {

        } elseif ($value >= 413351 && $value <= 415050) {

        } elseif ($value <= 415051) {
            
        }
    }

    function incomeTaxHeadOfHousehold ($value) {
        if ($value <= 9275) {

        } elseif ($value >= 9276 && $value <= 37650) {

        } elseif ($value >= 37651 && $value <= 91150) {

        } elseif ($value >= 91151 && $value <= 190150) {

        } elseif ($value >= 190151 && $value <= 413350) {

        } elseif ($value >= 413351 && $value <= 415050) {

        } elseif ($value <= 415051) {
            
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Income Tax Calculator v1</title>

    <!-- Bootstrap core CSS -->
    <link href="/bower_components/bootstrap/dist/css/bootstrap.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <div class="container">

      <h1>Income Tax Calculator</h1>

      <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST">
        <div class="input-group">
            <label for="income">Your Net Income:</label>
            <input type="text" value="<?php echo $income ?>" name="income" id="income">
        </div>

        <button type="submit" class="btn btn-primary">Submit</button>
      </form>

      <?php if ($displayResults) { ?>
      <table class="table">
        <thead>
        <tr>
            <th>Status</th>
            <th>Tax</th>
        </tr>
        </thead>
        <tboday>
            <tr>
                <td>Single<td>
                <td>$<? echo $singleTax ?></td>
            </tr>
            <tr>
                <td>Married Filing Jointly<td>
                <td></td>
            </tr>
            <tr>
                <td>Married Filing Separately<td>
                <td></td>
            </tr>
            <tr>
                <td>Head of Household<td>
                <td></td>
            </tr>
        <tboday>
      </table>
      <?php } ?>

    </div><!-- /.container -->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="/bower_components/jquery/dist/jquery.min.js"></script>
    <script src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  </body>
</html>
