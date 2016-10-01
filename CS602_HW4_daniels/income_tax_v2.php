<?php
    define('TAX_RATES',
        array(
            'Single' => array(
                'Rates' => array(10, 15, 25, 28, 33, 35, 39.6),
                'Ranges' => array(0, 9275, 37650, 91150, 190150, 413350, 415050),
                'MinTax' => array(0, 927.5, 5183.75, 18558.75, 46278.75, 119934.75, 120529.75)
            ),
            'Married_Jointly' => array (
                'Rates' => array(10, 15, 25, 28, 33, 35, 39.6),
                'Ranges' => array(0, 18550, 75300, 151900, 231450, 413350, 466950),
                'MinTax' => array(0, 1855, 10367.5, 29517.5, 51791.5, 111818.5, 130578.5)
            ),
            'Married_Separately' => array (
                'Rates' => array(10, 15, 25, 28, 33, 35, 39.6),
                'Ranges' => array(0, 9275, 37650, 75950, 115725, 206675, 233475),
                'MinTax' => array(0, 927.5, 5183.75, 14758.75, 25895.75, 55909.25, 65289.25)
            ),
            'Head_Household' => array (
                'Rates' => array(10, 15, 25, 28, 33, 35, 39.6),
                'Ranges' => array(0, 13250, 50400, 130150, 210800, 413350, 441000),
                'MinTax' => array(0, 1325, 6897.5, 26835, 49417, 116258.5, 125936)
            )
        )
    );

    function incomeTax($value, $status) {
        foreach("TAX_RATE" as $key => $value) {
            echo $key;
        }
    }

    function calTax ($value, $rate, $baseAmt, $limitAmt) {
        $amt = 0;

        if ($baseAmt && $limitAmt) {
            $amt = $baseAmt + (($value - $limitAmt) * $rate);
        } else {
            $amt = $value * $rate;
        }
        
        return $amt;
    }

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
            $singleTax = number_format(incomeTax($income, 'Single'), 2);
            $marriedJointTax = number_format(incomeTax($income, 'Married_Jointly'), 2);
            $marriedSeprateTax = number_format(incomeTax($income, 'Married_Separately'), 2);
            $headOfHouseTax = number_format(incomeTax($income, 'Head_Household'), 2);
        } else {
            $displayResults = FALSE;
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
                <td>$<? echo $marriedSeprateTax ?></td>
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
