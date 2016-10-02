<?php
    define("TAX_RATES",
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

    function incomeTax($amt, $status) {
        // get data based on  status
        $data = TAX_RATES[$status];
        $ranges = $data['Ranges'];
        $rates = $data['Rates'];
        $minTax = $data['MinTax'];

        // set default  tax amount
        $incomeTax = 0;
        
        // get total for loop
        $total = count($ranges);
        
        // set default min and max for use in loop and determing tax rate
        $min = 0;
        $max = 0;

        // set default tax rate
        $rate = 0;

        for ($i = 0; $i < $total; $i++) {
            // conditions for getting the min and max of each tax rate
            if ($i == 0) {
                $min = $ranges[$i];
                $max = $ranges[$i + 1];
            } elseif ($i > 0 && $i < $total - 1) {
                $min = $ranges[$i] + 1;
                $max = $ranges[$i + 1];
            } else {
                $min = $ranges[$i] + 1;
                $max = null;
            }

            // if there is a max then not in top tax bracket
            if ($max) {
                if ($amt >= $min && $amt <= $max) {
                    $rate = $rates[$i] / 100; // convert to decemal 
                    $incomeTax = calTax($amt, $rate, $minTax[$i], $min - 1);
                    break;
                }
            } else {
                if ($amt >= $min) {
                    $rate = $rates[$i] / 100; // convert to decemal
                    $incomeTax = calTax($amt, $rate, $minTax[$i], $min - 1);
                    break;
                }
            }
        }

        return $incomeTax;
    }
    /** 
    * Calulates income tax amount
    * Arguments: $value<int or float>, $rate<float>, $baseAmt<int or float>, $limitAmt< int or float>
    * returns tax amount<string>
    */
    function calTax ($value, $rate, $baseAmt, $limitAmt) {
        $amt = 0;

        if ($baseAmt && $limitAmt) {
            $amt = $baseAmt + (($value - $limitAmt) * $rate);
        } else {
            $amt = $value * $rate;
        }
        
        return $amt;
    }

    /** 
    * Creates HTML table with tax info
    * Arguments: taxBracketData <array>
    * returns html<string>
    */
    function generateTaxTable ($taxBracketData) {
        // get the data per tax bracket
        $ranges = $taxBracketData['Ranges'];
        $rates = $taxBracketData['Rates'];
        $minTax = $taxBracketData['MinTax'];

        // get total for loop
        $total = count($ranges);
        
        // set default min and max for use in loop and determing tax rate
        $min = 0;
        $max = 0;

        // string templates
        $taxIncomeTemplate = '$%min% - $%max%';
        $taxRateTemplate = '$%base% plus %rate%% of the amount over $%nontaxt%';

        // start the html table 
        $table = '<table class="table table-striped">';
        $table .= '<thead><tr><th>Taxable Income</th><th>Tax Rate</th></tr></thead>';
        $table .= '<tbody>';
        
        // loop thru each tax bracket
        for ($i = 0; $i  < $total; $i++) {
             // initial strings for taxable income and tax rate
             $taxableIncomeText = '';
             $taxRateText = '';
            
            // conditions for getting the min and max of each tax rate
            if ($i == 0) {
                $min = $ranges[$i];
                $max = $ranges[$i + 1];
            } elseif ($i > 0 && $i < $total - 1) {
                $min = $ranges[$i] + 1;
                $max = $ranges[$i + 1];
            } else {
                $min = $ranges[$i] + 1;
                $max = null;
            }

            // if there is a max use the string template overwise use alternative string format
            if ($max) {
                $taxableIncomeText = str_replace('%min%', $min, $taxIncomeTemplate);
                $taxableIncomeText = str_replace('%max%', $max, $taxableIncomeText);
            } else {
                $taxableIncomeText = '$' . $min . ' or more';
            }

            // if first line don't use the string template overwise do use it.
            if ($i === 0) {
                $taxRateText = $rates[$i] . '%';
            } else {
                $taxRateText = str_replace('%base%', number_format($minTax[$i], 2), $taxRateTemplate);
                $taxRateText = str_replace('%rate%', $rates[$i], $taxRateText);
                $taxRateText = str_replace('%nontaxt%', number_format($min - 1), $taxRateText);
            }

            // add table row entry  for tax info
            $table .= '<tr>';
            $table .= '<td>' . $taxableIncomeText . '</td><td>' . $taxRateText . '</td>';
            $table .= '</tr>';
        }

        // end html table
        $table .= '</tbody>';
        $table .= '</table>';

        return $table;
    }

    // set default state;
    $displayResults = FALSE;

    // set default error message value
    $error_message = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        // get the data from the form
        $income = filter_input(INPUT_POST, 'income', FILTER_VALIDATE_FLOAT);

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

    <title>Income Tax Calculator v2</title>

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
        <div class="form-group clearfix<? if ($error_message) { ?> has-error <? } ?>">
            <label for="income" class="control-label col-sm-2">Enter Net Income:</label>
            <div class="col-sm-10">
                <input type="text" value="" name="income" id="income"  class="form-control">
            </div>
            <? if ($error_message) 
                echo '<div class="help-block col-sm-offset-2 col-sm-10">' . $error_message . '</div';
            ?>
        </div>
        <div class="form-group clearfix"> 
            <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </div>
      </form>

      <?php if ($displayResults) { ?>
      <br>
      <p>With a net taxable income of <b>$<?php echo number_format($income, 2) ?></b></p>
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
      <hr>
      <h2>2016 Tax Tables</h2>
      <table class="table">

      <?php 
        foreach (TAX_RATES as $key => $value) {
            echo '<h3>' . str_replace('_', ' ', $key) . '</h3>';
            echo generateTaxTable($value);
        }
      ?>
      </table>
    </div><!-- /.container -->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="/bower_components/jquery/dist/jquery.min.js"></script>
    <script src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  </body>
</html>
