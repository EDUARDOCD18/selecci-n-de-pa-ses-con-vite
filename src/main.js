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

// Referencias adicionales para la sección de éxito
const locationForm = document.getElementById("location-form");
const successCard = document.getElementById("success-card");
const summaryText = document.getElementById("summary-text");
const resetFormBtn = document.getElementById("reset-form-btn");

/**
 * Muestra u oculta el mensaje de error visual y accesible para un grupo de formulario
 * @param {HTMLElement} groupElement - Contenedor del grupo (.form-group)
 * @param {string} errorId - ID del span de error
 * @param {string|null} message - Mensaje de error o null para limpiar
 */
function toggleError(groupElement, errorId, message) {
  const errorSpan = document.getElementById(errorId);

  if (message) {
    groupElement.classList.add("has-error");
    if (errorSpan) errorSpan.textContent = message;
  } else {
    groupElement.classList.remove("has-error");
    if (errorSpan) errorSpan.textContent = "";
  }
}

/**
 * Realiza peticiones HTTP GET asíncronas hacia la API de ubicaciones
 * @param {Object} params - Objeto con los parámetros de la URL
 * @returns {Promise<Array>} Promesa que resuelve al arreglo de datos recibido
 */
async function fetchLocations(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}?${query}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Error en la petición HTTP (${response.status}): No se pudo completar la solicitud.`,
    );
  }

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error(result.message || "Respuesta no válida del servidor.");
  }

  return result.data;
}

/**
 * Puebla un elemento <select> con opciones generadas dinámicamente
 */
function renderOptions(selectElement, items, placeholder) {
  selectElement.innerHTML = `<option value="">${placeholder}</option>`;

  items.forEach((item) => {
    const option = document.createElement("option");

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
 */
function resetSelect(selectElement, placeholder) {
  selectElement.innerHTML = `<option value="">${placeholder}</option>`;
  selectElement.disabled = true;
  selectElement.setAttribute("aria-disabled", "true");
}

/**
 * Carga inicial de Países (Nivel 1) con manejo de errores y A11y
 */
async function loadCountries() {
  groupCountry.classList.add("form-group--loading");
  countrySelect.disabled = true;
  countrySelect.setAttribute("aria-busy", "true");
  countrySelect.setAttribute("aria-disabled", "true");
  toggleError(groupCountry, "country-error", null);

  try {
    const countries = await fetchLocations({ action: "countries" });
    renderOptions(countrySelect, countries, "-- Selecciona un país --");
    countrySelect.disabled = false;
    countrySelect.setAttribute("aria-disabled", "false");
  } catch (error) {
    console.error("Falla al consultar países:", error);
    toggleError(
      groupCountry,
      "country-error",
      "No se pudieron cargar los países. Verifica tu conexión.",
    );
    renderOptions(countrySelect, [], "-- Error de conexión --");
  } finally {
    groupCountry.classList.remove("form-group--loading");
    countrySelect.setAttribute("aria-busy", "false");
  }
}

/**
 * Maneja el cambio en el selector de Países (Nivel 1 -> Nivel 2)
 */
async function handleCountryChange() {
  const selectedCountry = countrySelect.value;

  // Reset en Cascada y sincronización de accesibilidad
  resetSelect(stateSelect, "-- Selecciona primero un país --");
  resetSelect(citySelect, "-- Selecciona primero un estado --");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-disabled", "true");
  }

  // Limpiar errores previos de niveles inferiores
  toggleError(groupState, "state-error", null);
  toggleError(groupCity, "city-error", null);

  if (!selectedCountry) return;

  groupState.classList.add("form-group--loading");
  stateSelect.setAttribute("aria-busy", "true");

  try {
    const states = await fetchLocations({
      action: "states",
      country: selectedCountry,
    });

    renderOptions(stateSelect, states, "-- Selecciona un estado --");
    stateSelect.disabled = false;
    stateSelect.setAttribute("aria-disabled", "false");
  } catch (error) {
    console.error("Falla al consultar estados:", error);
    toggleError(
      groupState,
      "state-error",
      "Error al obtener los estados de este país.",
    );
    resetSelect(stateSelect, "-- Error al cargar estados --");
  } finally {
    groupState.classList.remove("form-group--loading");
    stateSelect.setAttribute("aria-busy", "false");
  }
}

/**
 * Maneja el cambio en el selector de Estados (Nivel 2 -> Nivel 3)
 */
async function handleStateChange() {
  const selectedCountry = countrySelect.value;
  const selectedState = stateSelect.value;

  // Reset de Nivel Inferior
  resetSelect(citySelect, "-- Selecciona primero un estado --");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-disabled", "true");
  }

  toggleError(groupCity, "city-error", null);

  if (!selectedState) return;

  groupCity.classList.add("form-group--loading");
  citySelect.setAttribute("aria-busy", "true");

  try {
    const cities = await fetchLocations({
      action: "cities",
      country: selectedCountry,
      state: selectedState,
    });

    renderOptions(citySelect, cities, "-- Selecciona una ciudad --");
    citySelect.disabled = false;
    citySelect.setAttribute("aria-disabled", "false");
  } catch (error) {
    console.error("Falla al consultar ciudades:", error);
    toggleError(
      groupCity,
      "city-error",
      "Error al obtener las ciudades de este estado.",
    );
    resetSelect(citySelect, "-- Error al cargar ciudades --");
  } finally {
    groupCity.classList.remove("form-group--loading");
    citySelect.setAttribute("aria-busy", "false");
  }
}

/**
 * Maneja el cambio en el selector de Ciudades (Nivel 3 -> Habilitación de Envío)
 */
function handleCityChange() {
  const selectedCity = citySelect.value;

  if (submitBtn) {
    submitBtn.disabled = !selectedCity;
    submitBtn.setAttribute("aria-disabled", (!selectedCity).toString());
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

/**
 * Maneja el evento de envío del formulario de ubicación
 */
function handleFormSubmit(e) {
  e.preventDefault();

  // Obtenemos los textos seleccionados (no los valores ID) para el resumen amigable
  const countryText = countrySelect.options[countrySelect.selectedIndex].text;
  const stateText = stateSelect.options[stateSelect.selectedIndex].text;
  const cityText = citySelect.options[citySelect.selectedIndex].text;

  // Inyectamos el resumen en la tarjeta de éxito
  summaryText.textContent = `${cityText}, ${stateText}, ${countryText}.`;

  // Ocultamos el formulario y mostramos la tarjeta de éxito
  locationForm.hidden = true;
  successCard.hidden = false;
}

/**
 * Restablece todo el formulario y vuelve a la vista inicial
 */
function handleFormReset() {
  // Reseteamos valores nativos del formulario
  locationForm.reset();

  // Reiniciamos los selectores dependientes a su estado inicial inhabilitado
  resetSelect(stateSelect, "-- Selecciona primero un país --");
  resetSelect(citySelect, "-- Selecciona primero un estado --");

  // Deshabilitamos el botón de envío
  submitBtn.disabled = true;
  submitBtn.setAttribute("aria-disabled", "true");

  // Intercambiamos la visibilidad de las tarjetas
  successCard.hidden = true;
  locationForm.hidden = false;

  // Volvemos a cargar los países iniciales
  loadCountries();
}

/**
 * Inicialización de escuchadores para el envío del formulario
 */
function initFormSubmitEvents() {
  if (locationForm) {
    locationForm.addEventListener("submit", handleFormSubmit);
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener("click", handleFormReset);
  }
}

// Escuchador del evento de carga inicial del DOM
document.addEventListener("DOMContentLoaded", () => {
  loadCountries();
  initEvents();
  initFormSubmitEvents();
});
