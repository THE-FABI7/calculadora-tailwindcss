// mantenga siempre la consola del navegador activa
"use strict";

const objButtons = [
  { class: "btn-operator", value: "π" },
  { class: "btn-operator", value: "√" },
  { class: "btn-operator", value: "x^2" },
  { class: "btn-operator", value: "%" },
  { class: "btn-operand", value: "1" },
  { class: "btn-operand", value: "2" },
  { class: "btn-operand", value: "3" },
  { class: "btn-operator", value: "+" },
  { class: "btn-operand", value: "4" },
  { class: "btn-operand", value: "5" },
  { class: "btn-operand", value: "6" },
  { class: "btn-operator", value: "-" },
  { class: "btn-operand", value: "7" },
  { class: "btn-operand", value: "8" },
  { class: "btn-operand", value: "9" },
  { class: "btn-operator", value: "*" },
  { class: "btn-operand", value: "0" },
  { class: "btn-operand", value: "." },
  { class: "btn-clear", value: "C" },
  { class: "btn-operator", value: "/" },
  { class: "btn-backspace", value: "&LeftArrowBar;" },
  { class: "btn-operator", value: "(" },
  { class: "btn-operator", value: ")" },
  { class: "btn-equals", value: "=" },
  // falta el botón +/- para cambiar de signo
];

let number = "";
let displayData = "";
let error = false;
let last = ""; // ultimo elemento ingresado al display

document.addEventListener("DOMContentLoaded", (event) => {
  const divButtons = document.querySelector(".buttons");
  const display = document.querySelector(".display");

  objButtons.forEach((objButton) => {
    const htmlButton = `<button class="${objButton.class}">${objButton.value}</button>`;
    divButtons.insertAdjacentHTML("beforeend", htmlButton);
  });

  // si bien NodeList soporta forEach, más adelante se requiere find(), de ahí la conversión:
  const buttons = Array.from(
    document.querySelectorAll('button[class^="btn-"]')
  );

  buttons.forEach((button) =>
    button.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn-equals")) {
        calcular(display);
      } else if (event.target.classList.contains("btn-clear")) {
        number = display.value = displayData = "";
      } else if (event.target.classList.contains("btn-backspace")) {
        borrarEntrada(display);
      } else {
        input(display, event.target.innerText);
      }
    })
  );

  document.addEventListener("keydown", (e) => {
    // se hubieran podido ejucutar directamente las acciones comentadas
    let button;

    if (e.key === "=" || e.key === "Enter") {
      //calcular(display)
      button = document.querySelector(".btn-equals");
    } else if (e.key === "c" || e.key === "C") {
      // number = display.value = displayData = ''
      button = document.querySelector(".btn-clear");
    } else if (e.key === "Backspace") {
      // borrarEntrada(display)
      button = document.querySelector(".btn-backspace");
    } else {
      // input(display, e.key)
      button = buttons.find((b) => b.innerText === e.key);
    }

    if (button) {
      button.dispatchEvent(new Event("click"));
      // simular la pulsación de botones
      button.classList.add("hover-button");
      setTimeout(() => button.classList.remove("hover-button"), 150);
    }
  });
});

function borrarEntrada(display) {
  // elimina el último caracter del display
  displayData = displayData.slice(0, -1);
  display.value = displayData;
  last = displayData.charAt(displayData.length - 1);

  // referencia el último número si el último caracter es numérico o punto
  if (".0123456789".includes(last)) {
    let i = displayData.length - 2;
    while (i >= 0 && ".0123456789".includes(displayData.charAt(i))) {
      i--;
    }
    number = displayData.substr(i + 1);
  } else {
    number = "";
  }
}

function input(display, currentChar) {
  if (error) {
    // si hay un mensaje de error en pantalla, reiniciar
    error = false;
    display.value = displayData = "";
  }

  // no se permite cerrar paréntesis si los que hay están emparejados
  if (
    currentChar === ")" &&
    occurrences(displayData, "(") === occurrences(displayData, ")")
  ) {
    return;
  }

  if (displayData.length === 0 && "*/".includes(currentChar)) {
    // no se permite iniciar una expresión: cierre de paréntesis o con los operadores *, /
    return;
  }

  if ("0123456789".includes(currentChar)) {
    // si ingresa un dígito agregarlo a cifra
    number += currentChar;
  } else if (currentChar === "." && !number.includes(".")) {
    // si ingresa punto y la cifra aún no tiene punto agregarlo a la cifra
    number += currentChar;
  } else if ("()".includes(currentChar)) {
    if (displayData.length > 0) {
      // no se permite abrir paréntesis después de un número
      // no se permite cerrar paréntesis despues de: [+|-|*|/|(]
      if (
        ("0123456789".includes(last) && currentChar === "(") ||
        ("+-*/(".includes(last) && currentChar === ")")
      ) {
        return;
      }
    }
    number = "";
  } else if ("+-*/%".includes(currentChar)) {
    // no se aceptan operadores consecutivos y se acepta [+|-] luego de abrir paréntesis
    if (
      displayData.length > 0 &&
      ((last == "(" && "*/".includes(currentChar)) || "+-*/%".includes(last))
    ) {
      return;
    }
    // si se acepta el operador, reiniciar la cifra
    number = "";
  } else if (currentChar === "π") {
    // Condición para el número PI
    /* Comprobando si displayData está vacío o si el último carácter es un operador matemático. Si es
  así, establecerá currentChar en Math.PI y lo agregará al número. */
    if (displayData.length === 0 || "+-*/%".includes(last)) {
      currentChar = Math.PI;
      number += Math.PI;
    }
    if (currentChar == "π") {
      if (displayData == "0") {
        displayData = "";
        displayData = Math.PI;
      }
      currentChar = "";
      if (!"+-*/%".includes(last) || displayData == "") {
        displayData = Math.PI;
        console.log(last + "last");
      } else if ("+-*/%".includes(last)) {
        displayData += Math.PI;
      }
    }
  } else if (currentChar === "√") {
    // Condición para sacar raiz cuadrada
    displayData = "";
    currentChar = Math.sqrt(number);
  } else if (currentChar === "x^2") {
    // Condición para elevar al cuadrado
    displayData = "";
    currentChar = Math.pow(number, 2);
  } else {
    return;
  }
  displayData += currentChar;
  last = currentChar;
  display.value = displayData;
}

function calcular(display) {
  if (!displayData) {
    return;
  }

  // si el número de paréntesis que abre es distinto del número de los que cierra...
  if (occurrences(displayData, "(") !== occurrences(displayData, ")")) {
    console.log("El número de paréntesis no coincide");
    return;
  }

  try {
    let result = eval(displayData); // devuelve numeric
    result = isFinite(result) ? result.toString() : "Infinito";
    number = displayData = display.value = result;
  } catch (e) {
    console.log(e);
    if (e instanceof SyntaxError) {
      display.value = "Error de sintaxis";
    } else {
      display.value = e.message;
    }
    number = displayData = "";
  }

  if (!isNumeric(display.value)) {
    error = true;
  }
}

function isNumeric(str) {
  if (typeof str !== "string") {
    return false;
  }
  return !isNaN(str) && !isNaN(parseFloat(str));
}

/**
 * Busca un tipo de aguja en un pajar
 * @param {String} haystack el pajar donde se busca la aguja
 * @param {*} needle el tipo de aguja que se busca
 * @returns Las veces que se encuentra el tipo de aguja en el pajar
 */
function occurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}
