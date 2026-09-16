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
 * Restablece la selección y el estado inhabilitado de un selector
 * @param {HTMLSelectElement} selectElement - Control a limpiar
 * @param {string} placeholder - Mensaje por defecto
 */

function resetSelect(selectElement, placeholder) {
  selectElement.innerHTML = `<option value="">${placeholder}</option>`;
  selectElement.disabled = true;
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

/**
 * Maneja el cambio en el selector de Países (Nivel 1 -> Nivel 2)
 */

async function handleCountryChange() {
  const selectedCountry = countrySelect.value;

  // Reset en Cascada: Limpia Estados, Ciudades y deshabilita el botón de envío
  resetSelect(stateSelect, "-- Selecciona un estado --");
  resetSelect(citySelect, "-- Selecciona una ciudad --");
  if (submitBtn) submitBtn.disabled = true;

  // Si se seleccionó la opción vacía/placeholder, detenemos el flujo
  if (!selectedCountry) return;
  groupState.classList.add("form-group--loading");

  try {
    const states = await fetchLocations({
      action: "states",
      country: selectedCountry,
    });

    renderOptions(stateSelect, states, "-- Selecciona un estado --");
    stateSelect.disabled = false;
  } catch (error) {
    console.error("Falla al consultar estados:", error);
  } finally {
    groupState.classList.remove("form-group--loading");
  }
}

/**
 * Maneja el cambio en el selector de Estados (Nivel 2 -> Nivel 3)
 */

async function handleStateChange() {
  const selectedCountry = countrySelect.value;
  const selectedState = stateSelect.value;

  // Reset de Nivel Inferior: Limpia Ciudades y desactiva botón de envío
  resetSelect(citySelect, "-- Selecciona una ciudad --");
  if (submitBtn) submitBtn.disabled = true;

  // Si no hay estado seleccionado, detenemos el flujo
  if (!selectedState) return;

  groupCity.classList.add("form-group--loading");

  try {
    const cities = await fetchLocations({
      action: "cities",
      country: selectedCountry,
      state: selectedState,
    });

    renderOptions(citySelect, cities, "-- Selecciona una ciudad --");
    citySelect.disabled = false;
  } catch (error) {
    console.error("Falla al consultar ciudades:", error);
    resetSelect(citySelect, "-- Error al cargar ciudades --");
  } finally {
    groupCity.classList.remove("form-group--loading");
  }
}

/**
 * Maneja el cambio en el selector de Ciudades (Nivel 3 -> Habilitación de Envío)
 */

function handleCityChange() {
  const selectedCity = citySelect.value;

  if (submitBtn) {
    submitBtn.disabled = !selectedCity;
  }
}

/**
 * Inicialización de Escuchadores de Eventos
 */

function initEvents() {
  countrySelect.addEventListener("change", handleCountryChange);
  stateSelect.addEventListener("change", handleStateChange);
  citySelect.addEventListener("change", handleCityChange);
}

// Escuchador del evento de carga inicial del DOM
document.addEventListener("DOMContentLoaded", () => {
  loadCountries();
  initEvents();
});
