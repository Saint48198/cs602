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
            $singleTax = number_format(incomeTaxSingle($income), 2);
            $marriedJointTax = number_format(incomeTaxMarriedJointly($income), 2);
            $marriedSeprateTax = number_format(incomeTaxMarriedSeparately($income), 2);
            $headOfHouseTax = number_format(incomeTaxHeadOfHousehold($income), 2);
        } else {
            $displayResults = FALSE;
        }
    } 


    function incomeTaxSingle ($value) {
        $tax = 0;

        if ($value <= 9275) {
            $tax = $value * 0.1;
        } elseif ($value >= 9276 && $value <= 37650) {
            $tax =  927.50 + (($value - 9275) * 0.15);
        } elseif ($value >= 37651 && $value <= 91150) {
            $tax = 5183.75 + (($value - 37650) * 0.25);
        } elseif ($value >= 91151 && $value <= 190150) {
            $tax = 18558.75 + (($value - 91150) * 0.28);
        } elseif ($value >= 190151 && $value <= 413350) {
            $tax = 46278.75 + (($value - 190150) * 0.33);
        } elseif ($value >= 413351 && $value <= 415050) {
            $tax = 119934.75 + (($value - 413350) * 0.35);
        } elseif ($value >= 415051) {
            $tax = 120529.75 + (($value - 415050) * 0.396);
        }

        return $tax;
    }

    function incomeTaxMarriedJointly ($value) {
        $tax = 0;

        if ($value <= 9275) {

        } elseif ($value >= 9276 && $value <= 37650) {

        } elseif ($value >= 37651 && $value <= 91150) {

        } elseif ($value >= 91151 && $value <= 190150) {

        } elseif ($value >= 190151 && $value <= 413350) {

        } elseif ($value >= 413351 && $value <= 415050) {

        } elseif ($value >= 415051) {
            
        }

        return $tax;
    }

    function incomeTaxMarriedSeparately ($value) {
        $tax = 0;

        if ($value <= 9275) {

        } elseif ($value >= 9276 && $value <= 37650) {

        } elseif ($value >= 37651 && $value <= 91150) {

        } elseif ($value >= 91151 && $value <= 190150) {

        } elseif ($value >= 190151 && $value <= 413350) {

        } elseif ($value >= 413351 && $value <= 415050) {

        } elseif ($value <= 415051) {
            
        }

        return $tax;
    }

    function incomeTaxHeadOfHousehold ($value) {
        $tax = 0;

        if ($value <= 9275) {

        } elseif ($value >= 9276 && $value <= 37650) {

        } elseif ($value >= 37651 && $value <= 91150) {

        } elseif ($value >= 91151 && $value <= 190150) {

        } elseif ($value >= 190151 && $value <= 413350) {

        } elseif ($value >= 413351 && $value <= 415050) {

        } elseif ($value <= 415051) {
            
        }

        return $tax;
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
            <input type="text" value="" name="income" id="income">
            <? if ($error_message) 
                echo '<div class="error">' . $error_message . '</div>';
            ?>
        </div>

        <button type="submit" class="btn btn-primary">Submit</button>
      </form>

      <?php if ($displayResults) { ?>
      <p>With a net taxable income of <?php echo number_format($income, 2) ?></p>
      <table class="table">
        <thead>
            <tr>
                <th>Status</th>
                <th>Tax</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Single</td>
                <td>$<? echo $singleTax ?></td>
            </tr>
            <tr>
                <td>Married Filing Jointly</td>
                <td>$<? echo $marriedJointTax ?></td>
            </tr>
            <tr>
                <td>Married Filing Separately</td>
                <td>$<? ech $marriedSeprateTax ?></td>
            </tr>
            <tr>
                <td>Head of Household</td>
                <td>$<? echo $headOfHouseTax ?></td>
            </tr>
        <tbody>
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
