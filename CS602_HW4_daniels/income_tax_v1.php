<?php

    function incomeTaxSingle ($value) {
        $tax = 0;

        if ($value <= 9275) {
            $tax = calTax($value, 0.1, null, null);
        } elseif ($value >= 9276 && $value <= 37650) {
            $tax = calTax($value, 0.15, 927.5, 9275);
        } elseif ($value >= 37651 && $value <= 91150) {
            $tax = calTax($value, 0.25, 5183.75, 37650);
        } elseif ($value >= 91151 && $value <= 190150) {
            $tax = calTax($value, 0.28, 18558.75, 91150);
        } elseif ($value >= 190151 && $value <= 413350) {
            $tax = calTax($value, 0.33, 46278.75, 190150);
        } elseif ($value >= 413351 && $value <= 415050) {
            $tax = calTax($value, 0.35, 119934.75, 413350);
        } elseif ($value >= 415051) {
            $tax = calTax($value, 0.396, 120529.75, 415050);
        }

        return $tax;
    }

    function incomeTaxMarriedJointly ($value) {
        $tax = 0;

        if ($value <= 18550) {
            $tax = calTax($value, 0.1, null, null);
        } elseif ($value >= 18551 && $value <= 75300) {
            $tax = calTax($value, 0.15, 1855, 18550);
        } elseif ($value >= 75301 && $value <= 151900) {
            $tax = calTax($value, 0.25, 10367.5, 75300);
        } elseif ($value >= 151901 && $value <= 231450) {
            $tax = calTax($value, 0.28, 29517.5, 151900);
        } elseif ($value >= 231451 && $value <= 413350) {
            $tax = calTax($value, 0.33, 51791.5, 231450);
        } elseif ($value >= 413351 && $value <= 466950) {
            $tax = calTax($value, 0.35, 111818.5, 413350);
        } elseif ($value >= 466951) {
            $tax = calTax($value, 0.396, 130578.5, 466950);
        }

        return $tax;
    }

    function incomeTaxMarriedSeparately ($value) {
        $tax = 0;

        if ($value <= 9275) {
            $tax = calTax($value, 0.1, null, null);
        } elseif ($value >= 9276 && $value <= 37650) {
            $tax = calTax($value, 0.15, 927.5, 9275);
        } elseif ($value >= 37651 && $value <= 75950) {
            $tax = calTax($value, 0.25, 5183.75, 37650);
        } elseif ($value >= 75951 && $value <= 115725) {
            $tax = calTax($value, 0.28, 14758.75, 75950);
        } elseif ($value >= 115726 && $value <= 206675) {
            $tax = calTax($value, 0.33, 25895.75, 115725);
        } elseif ($value >= 206676 && $value <= 233475) {
            $tax = calTax($value, 0.35, 55909.25, 206675);
        } elseif ($value >= 233476) {
            $tax = calTax($value, 0.396, 65289.25, 233475);
        }

        return $tax;
    }

    function incomeTaxHeadOfHousehold ($value) {
        $tax = 0;

        if ($value <= 13250) {
            $tax = calTax($value, 0.1, null, null);
        } elseif ($value >= 13251 && $value <= 50400) {
            $tax = calTax($value, 0.15, 1325, 13250);
        } elseif ($value >= 50401 && $value <= 130150) {
            $tax = calTax($value, 0.25, 6897.5, 50400);
        } elseif ($value >= 130151 && $value <= 210800) {
            $tax = calTax($value, 0.28, 26835, 130150);
        } elseif ($value >= 210801 && $value <= 413350) {
            $tax = calTax($value, 0.33, 49417, 210800);
        } elseif ($value >= 413351 && $value <= 441000) {
            $tax = calTax($value, 0.35, 116258.5, 413350);
        } elseif ($value >= 441001) {
            $tax = calTax($value, 0.396, 125936, 441000);
        }

        return $tax;
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
            $singleTax = number_format(incomeTaxSingle($income), 2);
            $marriedJointTax = number_format(incomeTaxMarriedJointly($income), 2);
            $marriedSeprateTax = number_format(incomeTaxMarriedSeparately($income), 2);
            $headOfHouseTax = number_format(incomeTaxHeadOfHousehold($income), 2);
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

    </div><!-- /.container -->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="/bower_components/jquery/dist/jquery.min.js"></script>
    <script src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  </body>
</html>
