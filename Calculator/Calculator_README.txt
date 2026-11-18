CodeAlpha Calculator

Project Overview

This project is a responsive calculator developed as part of the
CodeAlpha internship tasks. It is built using HTML, CSS, and vanilla
JavaScript.

The calculator supports basic arithmetic operations and provides both
button and keyboard input.

Technologies Used

-   HTML5
-   CSS3
-   JavaScript (Vanilla)

Features

-   Addition, subtraction, multiplication, and division
-   Decimal number input
-   Positive and negative sign toggle
-   Clear all (AC) and delete last character (DEL) controls
-   Calculation preview while entering an expression
-   Correct operator precedence (multiplication and division before
    addition and subtraction)
-   Support for negative numbers and unary minus
-   Division-by-zero error handling
-   Invalid-expression and out-of-range error handling
-   Keyboard support:
    -   Number keys (0–9)
    -   Decimal point (.) or comma (,)
    -   Arithmetic operators (+, -, *, /)
    -   x or X for multiplication
    -   Enter or = to calculate
    -   Backspace to delete
    -   Escape or Delete to clear
-   Responsive layout for smaller screens
-   Accessible labels and live display/status announcements
-   Reduced-motion support

Project Structure

    Calculator/
    |-- index.html
    |-- style.css
    |-- script.js
    |-- README.txt

How to Run

1.  Keep index.html, style.css, and script.js in the same project
    folder.
2.  Open index.html in a modern web browser.
3.  Use the on-screen buttons or your keyboard to perform calculations.

No installation, backend server, or external JavaScript library is
required.

How to Use

-   Enter numbers using the number buttons or keyboard.
-   Select an arithmetic operator.
-   Enter the next number.
-   Press = or Enter to calculate the result.
-   Use AC or Escape to clear the calculation.
-   Use DEL or Backspace to remove the last character.
-   Use +/- to change the sign of the current number.

Notes

-   The JavaScript evaluates arithmetic expressions with a dedicated
    parser; it does not execute the entered expression as JavaScript
    code.
-   The calculator limits expression length to help prevent excessively
    long input.
-   Division by zero and invalid or unsupported calculations are
    reported through the status display.

Developer

Developed by Irfan Ullah

CodeAlpha Internship Project
