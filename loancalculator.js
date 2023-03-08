"use strict";

class Loan {
    constructor() {
        this.loanAmount = null;
        this.interestRate = null;
        this.termInYears = null;
        this.months = null;
        this.monthlyPayment = null;
        this.totalCost = null;
        this.totalInterest = null;
        this.paymentSchedule = new Array(); // we'll store the loan payments here
    }
}

class LoanPayment {

    constructor() {
        this.monthPaid = null;
        this.paymentAmount = null;
        this.principalPaid = null;
        this.interestPaid = null;
        this.totalInterest = null;
        this.remainingPrincipal = null;
    }
}

const loanAmountField = document.getElementById("loanamount");
const termInYearsField = document.getElementById("terminyears");
const interestRateField = document.getElementById("interestrate");
const tableBody = document.getElementById("tablebody");

const paymentText = document.getElementById("payment");
const totalPrincipalText = document.getElementById("totalprincipal");
const totalInterestText = document.getElementById("totalinterest");
const totalCostText = document.getElementById("totalcost");

function runTheApp(evt) {
    evt.preventDefault();
    let loan = new Loan();

    loan = getLoanDetailsFromUserInput(loan);
    loan = getPayments(loan);
    generateTable(loan);
}

function getLoanDetailsFromUserInput(loan) {
    loan.loanAmount = parseFloat(loanAmountField.value);
    loan.termInYears = parseFloat(termInYearsField.value);
    loan.months = loan.termInYears * 12;
    loan.interestRate = parseFloat(interestRateField.value);

    return loan;
}

function getPayments(loan) {
    loan.monthlyPayment = calculateMonthlyPayment(loan);

    let balance = loan.loanAmount;
    let totalInterest = 0;
    let monthlyInterest = 0;
    let monthlyPrincipal = 0;
    let monthlyRate = calculateMonthlyRate(loan.interestRate);

    for (let month = 1; month <= loan.months; month++) {
        monthlyInterest = balance * monthlyRate;
        monthlyPrincipal = loan.monthlyPayment - monthlyInterest;
        totalInterest += monthlyInterest;
        balance -= monthlyPrincipal;

        let payment = new LoanPayment();
        payment.monthPaid = month;
        payment.interestPaid = monthlyInterest;
        payment.principalPaid = monthlyPrincipal;
        payment.totalInterest = totalInterest;
        payment.remainingPrincipal = balance;
        payment.paymentAmount = loan.monthlyPayment;

        loan.paymentSchedule.push(payment);
    }

    loan.totalInterest = totalInterest;
    loan.totalCost = loan.loanAmount + loan.totalInterest;
    return loan;
}

function calculateMonthlyPayment(loan) {
    let monthlyRate = calculateMonthlyRate(loan.interestRate);
    let monthlyPayment = (loan.loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loan.months));
    return monthlyPayment;
}

function calculateMonthlyRate(yearlyRate) {
    return yearlyRate / 1200;
}

function generateTable(loan) {
    paymentText.innerHTML = formatAsCurrency(loan.monthlyPayment);
    totalPrincipalText.innerHTML = formatAsCurrency(loan.loanAmount);
    totalInterestText.innerHTML = formatAsCurrency(loan.totalInterest);
    totalCostText.innerHTML = "<strong>" + formatAsCurrency(loan.totalCost) + "</strong>";

    let html = "";

    for (let payment of loan.paymentSchedule) {

        let row = `<tr>`; 
        row += `<td>${payment.monthPaid}</td>`;
        row += `<td>${formatAsCurrency(payment.paymentAmount)}</td>`; 
        row += `<td>${formatAsCurrency(payment.principalPaid)}</td>`;
        row += `<td>${formatAsCurrency(payment.interestPaid)}</td>`; 
        row += `<td>${formatAsCurrency(payment.totalInterest)}</td>`;
        row += `<td>${formatAsCurrency(payment.remainingPrincipal)}</td>`;
        row += `</tr >`;

        html += row;
    }

    tableBody.innerHTML = html;
}

function formatAsCurrency(number) {
    return "$" + `${number.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btnSubmit");
    button.addEventListener("click", runTheApp);
});




