// get user values
// controller
function getValues() {
    let loanamount = document.getElementById("inputLoanAmount").value;
    let payments = document.getElementById("inputPayments").value;
    let rate = document.getElementById("inputRate").value;

    // convert to int
    loanamount = parseInt(loanamount);
    payments = parseInt(payments);
    rate = parseInt(rate);

    // validate is integer
    if (Number.isInteger(loanamount) && Number.isInteger(payments) && Number.isInteger(rate)) {
        // call calculate payment
        let calc = calculatePayments(loanamount, payments, rate);

        // call view
        displayLoan(calc, loanamount, payments);
    }
}


// calculate payments
// logic
function calculatePayments(la, p, r) {
    // setup calc obj for returning values
    // setup arrays for each of the different values to collect
    let calc = {};
    let currentBalance = [];
    let interestPayment = [];
    let principalPayment = [];
    let remainingBalance = [];

    // calculate the monthly payment to start
    let totalMonthlyPayment = la * (r/1200) / (1 - (1 + r/1200)**-p);

    // push the starting laon amount to current balance
    currentBalance.push(la);

    // loop to calculate each month amounts and push each value into it's array
    for (let i = 0; i < p; i++) {
        interestPayment.push(currentBalance[i] * r/1200);
        principalPayment.push(totalMonthlyPayment - interestPayment[i]);
        remainingBalance.push(currentBalance[i] - principalPayment[i]);

        currentBalance.push(remainingBalance[i]);
    }

    // add each array to the calc obj
    calc.currentBalance = currentBalance;
    calc.interestPayment = interestPayment;
    calc.principalPayment = principalPayment;
    calc.remainingBalance = remainingBalance;
    calc.totalMonthlyPayment = totalMonthlyPayment;

    return calc;
}


// display payments and amortization table
// view
function displayLoan(calc, la, p) {
    document.getElementById("monthlyPayment").innerHTML = `$${calc.totalMonthlyPayment.toFixed(2)}`;
    document.getElementById("totalPrincipal").innerHTML = `$${la.toFixed(2)}`;

    // get result area and template for use
    let tableBody = document.getElementById("results");
    let templateRow = document.getElementById("template");
    let totalInterest = 0;

    // clear table
    tableBody.innerHTML = "";

    // loop array to create output from array
    for (let i = 0; i < p; i++)
    {
        let tableRow = document.importNode(templateRow.content, true);
        
        // sum the interest for each month
        totalInterest += calc.interestPayment[i];

        // grab the td put in an array
        let rowCols = tableRow.querySelectorAll("td");
        rowCols[0].textContent = i + 1;
        rowCols[1].textContent = `$${calc.totalMonthlyPayment.toFixed(2)}`;
        rowCols[2].textContent = `$${calc.principalPayment[i].toFixed(2)}`;
        rowCols[3].textContent = `$${calc.interestPayment[i].toFixed(2)}`;
        rowCols[4].textContent = `$${totalInterest.toFixed(2)}`;
        rowCols[5].textContent = `$${calc.remainingBalance[i].toFixed(2)}`;

        tableBody.appendChild(tableRow);
    }

    // add the last items for total interext and total cost of completed loan
    document.getElementById("totalInterest").innerHTML = `$${totalInterest.toFixed(2)}`;
    let totalCost = totalInterest + la;
    document.getElementById("totalCost").innerHTML = `$${totalCost.toFixed(2)}`;
}