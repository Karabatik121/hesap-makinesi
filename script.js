document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const history = document.getElementById('history');
    const clearHistoryButton = document.getElementById('clear-history');

    initializeEventListeners();
    loadThemePreference();

    function initializeEventListeners() {
        buttons.forEach(button => {
            button.addEventListener('click', handleButtonClick);
        });

        themeToggle.addEventListener('click', toggleTheme);
        document.addEventListener('keydown', handleKeyboardInput);
        clearHistoryButton.addEventListener('click', clearHistory);
    }

    function handleButtonClick(event) {
        clearError();
        const value = event.currentTarget.getAttribute('data-value');
        handleInput(value);
    }

    function handleKeyboardInput(event) {
        clearError();
        const key = event.key;
        if (isNumericKey(key) || isOperatorKey(key) || key === '(' || key === ')') {
            handleInput(key);
        } else if (key === 'Enter') {
            event.preventDefault();
            handleInput('=');
        } else if (key === 'Backspace') {
            event.preventDefault();
            handleInput('Backspace');
        } else if (key === 'Escape') {
            handleInput('C');
        } else if (event.ctrlKey && key.toLowerCase() === 'c') {
            handleInput('C');
        }
    }

    function handleInput(value) {
        switch (value) {
            case 'C':
                clearDisplay();
                break;
            case '=':
                calculateResult();
                break;
            case 'Backspace':
                removeLastCharacter();
                break;
            default:
                if (isValidInput(value)) {
                    appendToDisplay(value);
                }
        }
    }

    function clearDisplay() {
        display.value = '';
    }

    function calculateResult() {
        try {
            const result = eval(display.value);
            if (!isFinite(result)) {
                throw new Error("Invalid Calculation");
            }
            addHistory(`${display.value} = ${result}`);
            display.value = result;
        } catch (e) {
            display.value = 'Hata';
        }
    }

    function removeLastCharacter() {
        display.value = display.value.slice(0, -1);
    }

    function appendToDisplay(value) {
        display.value += value;
    }

    function clearError() {
        if (display.value === 'Hata') {
            display.value = '';
        }
    }

    function toggleTheme() {
        const htmlElement = document.documentElement;
        const isDark = htmlElement.classList.toggle('dark');
        htmlElement.classList.toggle('light', !isDark);

        themeIcon.classList.toggle('fa-moon', !isDark);
        themeIcon.classList.toggle('fa-sun', isDark);

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    function loadThemePreference() {
        const theme = localStorage.getItem('theme');
        if (theme) {
            document.documentElement.classList.add(theme);
            themeIcon.classList.toggle('fa-moon', theme === 'light');
            themeIcon.classList.toggle('fa-sun', theme === 'dark');
        }
    }

    function addHistory(entry) {
        const p = document.createElement('p');
        p.textContent = entry;
        history.appendChild(p);
    }

    function clearHistory() {
        history.innerHTML = '';
    }

    function isNumericKey(key) {
        return !isNaN(key);
    }

    function isOperatorKey(key) {
        return ['+', '-', '*', '/'].includes(key);
    }

    function isValidInput(value) {
        const validChars = '0123456789+-*/.()';
        return validChars.includes(value);
    }
});
