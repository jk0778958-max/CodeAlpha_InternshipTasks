
"use strict";

/* ------------------------------
   1. Select HTML Elements
-------------------------------- */

const display = document.getElementById("display");
const expressionDisplay = document.getElementById("expression");
const statusDisplay = document.getElementById("status");
const buttonGrid = document.getElementById("buttonGrid");

/* ------------------------------
   2. Calculator State
-------------------------------- */

let expression = "";
let justCalculated = false;
let hasError = false;

const MAX_EXPRESSION_LENGTH = 100;

/* ------------------------------
   3. Display Formatting
-------------------------------- */

// Convert scientific notation into ordinary decimal notation.
// This allows the result to be used in the next calculation.

function expandScientificNotation(value) {
    const parts = value.toLowerCase().split("e");

    if (parts.length === 1) {
        return value;
    }

    const coefficient = parts[0];
    const exponent = Number(parts[1]);

    const negative = coefficient.startsWith("-");
    const unsigned = negative
        ? coefficient.slice(1)
        : coefficient;

    const decimalPosition = unsigned.indexOf(".");
    const digits = unsigned.replace(".", "");

    const originalPosition = decimalPosition === -1
        ? unsigned.length
        : decimalPosition;

    const newPosition = originalPosition + exponent;

    let result;

    if (newPosition <= 0) {
        result = "0." + "0".repeat(-newPosition) + digits;
    } else if (newPosition >= digits.length) {
        result = digits + "0".repeat(newPosition - digits.length);
    } else {
        result =
            digits.slice(0, newPosition) +
            "." +
            digits.slice(newPosition);
    }

    return negative ? "-" + result : result;
}

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        throw new Error("Result is outside the supported range.");
    }

    if (Object.is(number, -0)) {
        number = 0;
    }

    return expandScientificNotation(number.toString());
}

function updateDisplay() {
    display.textContent = expression || "0";
    expressionDisplay.textContent = expression
        ? "Expression: " + expression
        : "";

    display.scrollLeft = display.scrollWidth;
}

function setStatus(message) {
    statusDisplay.textContent = message;
}

/* ------------------------------
   4. Expression Parser
-------------------------------- */

// Tokenize numbers and arithmetic operators.
// No JavaScript code is executed.

function tokenize(input) {
    const tokens = input.match(
        /(?:\d+(?:\.\d*)?|\.\d+)|[+\-*/]/g
    );

    if (!tokens || tokens.join("") !== input) {
        throw new Error("Invalid expression.");
    }

    return tokens;
}

function evaluateExpression(input) {
    const tokens = tokenize(input);
    let position = 0;

    function parsePrimary() {
        const token = tokens[position];

        if (token === undefined) {
            throw new Error("Incomplete expression.");
        }

        if (token === "+" || token === "-") {
            position++;

            const value = parsePrimary();

            return token === "-" ? -value : value;
        }

        position++;

        const number = Number(token);

        if (!Number.isFinite(number)) {
            throw new Error("Invalid number.");
        }

        return number;
    }

    function parseMultiplication() {
        let value = parsePrimary();

        while (
            tokens[position] === "*" ||
            tokens[position] === "/"
        ) {
            const operator = tokens[position];
            position++;

            const nextValue = parsePrimary();

            if (operator === "*") {
                value *= nextValue;
            } else {
                if (nextValue === 0) {
                    throw new Error("Cannot divide by zero.");
                }

                value /= nextValue;
            }
        }

        return value;
    }

    function parseAddition() {
        let value = parseMultiplication();

        while (
            tokens[position] === "+" ||
            tokens[position] === "-"
        ) {
            const operator = tokens[position];
            position++;

            const nextValue = parseMultiplication();

            if (operator === "+") {
                value += nextValue;
            } else {
                value -= nextValue;
            }
        }

        return value;
    }

    const result = parseAddition();

    if (position !== tokens.length) {
        throw new Error("Invalid expression.");
    }

    if (!Number.isFinite(result)) {
        throw new Error("Result is outside the supported range.");
    }

    return result;
}

/* ------------------------------
   5. Live Preview
-------------------------------- */

function updatePreview() {
    updateDisplay();

    if (!expression) {
        setStatus("Ready");
        return;
    }

    if (/[+\-*/.]$/.test(expression)) {
        setStatus("Calculation in progress...");
        return;
    }

    try {
        const result = evaluateExpression(expression);

        setStatus("= " + formatNumber(result));
    } catch (error) {
        setStatus(error.message);
    }
}

/* ------------------------------
   6. Input Preparation
-------------------------------- */

function prepareForInput() {
    if (hasError) {
        expression = "";
        hasError = false;
    }

    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }
}

function canAddInput(value) {
    return expression.length + value.length <=
        MAX_EXPRESSION_LENGTH;
}

/* ------------------------------
   7. Number Input
-------------------------------- */

function enterDigit(digit) {
    prepareForInput();

    if (!canAddInput(digit)) {
        setStatus("Maximum input length reached.");
        return;
    }

    const currentNumber = expression.match(/(\d*\.?\d*)$/);
    const currentPart = currentNumber
        ? currentNumber[0]
        : "";

    if (currentPart === "0") {
        expression = expression.slice(0, -1) + digit;
    } else {
        expression += digit;
    }

    updatePreview();
}

/* ------------------------------
   8. Decimal Input
-------------------------------- */

function enterDecimal() {
    prepareForInput();

    const currentNumber = expression.match(/(\d*\.?\d*)$/);
    const currentPart = currentNumber
        ? currentNumber[0]
        : "";

    if (currentPart.includes(".")) {
        return;
    }

    const addition = currentPart === ""
        ? "0."
        : ".";

    if (!canAddInput(addition)) {
        setStatus("Maximum input length reached.");
        return;
    }

    expression += addition;

    updatePreview();
}

/* ------------------------------
   9. Operator Input
-------------------------------- */

function enterOperator(operator) {
    if (hasError) {
        expression = "";
        hasError = false;
    }

    if (justCalculated) {
        justCalculated = false;
    }

    if (!expression) {
        if (operator === "-") {
            expression = "-";
            updatePreview();
        }

        return;
    }

    const lastCharacter = expression.slice(-1);

    if ("+-*/".includes(lastCharacter)) {
        // Allow a unary minus after another operator.
        if (operator === "-" && lastCharacter !== "-") {
            if (canAddInput(operator)) {
                expression += operator;
            }
        } else {
            expression = expression.slice(0, -1) + operator;
        }
    } else {
        if (!canAddInput(operator)) {
            setStatus("Maximum input length reached.");
            return;
        }

        expression += operator;
    }

    updatePreview();
}

/* ------------------------------
   10. Clear and Delete
-------------------------------- */

function clearCalculator() {
    expression = "";
    justCalculated = false;
    hasError = false;

    updateDisplay();
    setStatus("Cleared");
}

function deleteLastCharacter() {
    if (hasError || justCalculated) {
        clearCalculator();
        return;
    }

    expression = expression.slice(0, -1);

    updatePreview();
}

/* ------------------------------
   11. Positive / Negative Sign
-------------------------------- */

function toggleSign() {
    if (hasError) {
        clearCalculator();
    }

    if (!expression) {
        expression = "-";
        justCalculated = false;
        updatePreview();
        return;
    }

    // Find the final number in the expression.
    const match = expression.match(/(\d*\.?\d+)$/);

    if (!match) {
        if (expression.endsWith("-")) {
            expression = expression.slice(0, -1);
        } else if (canAddInput("-")) {
            expression += "-";
        }

        updatePreview();
        return;
    }

    const numberStart = match.index;
    const signPosition = numberStart - 1;

    if (expression[signPosition] === "-") {
        const characterBeforeSign =
            expression[signPosition - 1];

        const isUnaryMinus =
            signPosition === 0 ||
            "+-*/".includes(characterBeforeSign);

        if (isUnaryMinus) {
            expression =
                expression.slice(0, signPosition) +
                expression.slice(numberStart);
        } else {
            expression =
                expression.slice(0, numberStart) +
                "-" +
                expression.slice(numberStart);
        }
    } else {
        if (!canAddInput("-")) {
            setStatus("Maximum input length reached.");
            return;
        }

        expression =
            expression.slice(0, numberStart) +
            "-" +
            expression.slice(numberStart);
    }

    justCalculated = false;
    updatePreview();
}

/* ------------------------------
   12. Calculate Result
-------------------------------- */

function calculateResult() {
    if (!expression) {
        setStatus("Enter a calculation first.");
        return;
    }

    try {
        const result = evaluateExpression(expression);

        expression = formatNumber(result);
        justCalculated = true;
        hasError = false;

        updateDisplay();
        setStatus("Calculation complete");
    } catch (error) {
        hasError = true;

        display.textContent = "Error";
        setStatus(error.message);
    }
}

/* ------------------------------
   13. Button Click Handling
-------------------------------- */

buttonGrid.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button || !buttonGrid.contains(button)) {
        return;
    }

    if (button.dataset.digit !== undefined) {
        enterDigit(button.dataset.digit);
        return;
    }

    if (button.dataset.operator) {
        enterOperator(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteLastCharacter();
            break;

        case "sign":
            toggleSign();
            break;

        case "decimal":
            enterDecimal();
            break;

        case "calculate":
            calculateResult();
            break;
    }
});


/* ------------------------------
   14. Keyboard Support
-------------------------------- */

document.addEventListener("keydown", function (event) {
    const key = event.key;

    // Number keys
    if (/^\d$/.test(key)) {
        event.preventDefault();
        enterDigit(key);
        return;
    }

    // Decimal point
    if (key === "." || key === ",") {
        event.preventDefault();
        enterDecimal();
        return;
    }

    // Arithmetic operators
    const operatorKeys = {
        "+": "+",
        "-": "-",
        "*": "*",
        "/": "/",
        "x": "*",
        "X": "*"
    };

    if (operatorKeys[key] !== undefined) {
        event.preventDefault();
        enterOperator(operatorKeys[key]);
        return;
    }

    // Calculate
    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
        return;
    }

    // Delete last character
    if (key === "Backspace") {
        event.preventDefault();
        deleteLastCharacter();
        return;
    }

    // Clear calculator
    if (key === "Escape" || key === "Delete") {
        event.preventDefault();
        clearCalculator();
    }
});

/* ------------------------------
   15. Initialize Calculator
-------------------------------- */

updateDisplay();
setStatus("Ready");
