// Configuración de la ruta del endpoint PHP
const API_URL = "./api/locations.php";

// Referencias a los elementos del DOM
const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
const citySelect = document.getElementById("city");
const submitBtn = document.getElementById("submit-btn");

const groupCountry = document.getElementById("group-country");
const groupState = document.getElementById("group-state");
const groupCity = document.getElementById("group-city");

/**
 * Realiza peticiones HTTP GET asíncronas hacia la API de ubicaciones
 * @param {Object} params - Objeto con los parámetros de la URL (ej. { action: 'countries' })
 * @returns {Promise<Array>} Promesa que resuelve al arreglo de datos recibido
 */
async function fetchLocations(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}?${query}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error en la petición HTTP: ${response.status}`);
  }

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error(result.message || "Respuesta no válida del servidor");
  }

  return result.data;
}

/**
 * Puebla un elemento <select> con opciones <option> generadas dinámicamente
 * @param {HTMLSelectElement} selectElement - Selector del DOM a modificar
 * @param {Array} items - Arreglo de elementos a renderizar ({id, name} o strings)
 * @param {string} placeholder - Texto por defecto del option inicial
 */
function renderOptions(selectElement, items, placeholder) {
  // Limpia el contenido previo e inserta la opción por defecto
  selectElement.innerHTML = `<option value="">${placeholder}</option>`;

  items.forEach((item) => {
    const option = document.createElement("option");

    // Comprueba si el elemento es un objeto {id, name} o una cadena simple (caso ciudades)
    if (typeof item === "object" && item !== null) {
      option.value = item.id;
      option.textContent = item.name;
    } else {
      option.value = item;
      option.textContent = item;
    }

    selectElement.appendChild(option);
  });
}

/**
 * Carga e inicializa el menú desplegable de Países (Nivel 1) al iniciar la app
 */
async function loadCountries() {
  // Activa la animación del spinner visual en el CSS mediante la clase BEM
  groupCountry.classList.add("form-group--loading");
  countrySelect.disabled = true;

  try {
    const countries = await fetchLocations({ action: "countries" });
    renderOptions(countrySelect, countries, "-- Selecciona un país --");
    countrySelect.disabled = false;
  } catch (error) {
    console.error("Falla al consultar países:", error);
    renderOptions(countrySelect, [], "-- Error al cargar países --");
  } finally {
    // Desactiva el spinner independientemente de si la petición tuvo éxito o falló
    groupCountry.classList.remove("form-group--loading");
  }
}

// Escuchador del evento de carga inicial del DOM
document.addEventListener("DOMContentLoaded", loadCountries);
