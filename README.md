# Selector de Ubicación Dinámico (País, Estado y Ciudad)

Aplicación web interactiva y modular desarrollada con **HTML5 Semántico**, **CSS3**, **JavaScript (ES6+)** y un backend en **PHP**, diseñada bajo estrictos estándares de **accesibilidad (A11y)** y experiencia de usuario (UX).

## 🚀 Características Principales

* **Selectores Dependientes en Cascada:** Filtrado dinámico de niveles geográficos (País $\rightarrow$ Estado $\rightarrow$ Ciudad) mediante peticiones asíncronas (`fetch`).
* **Accesibilidad Universal (A11y):** Implementación de atributos ARIA (`aria-busy`, `aria-disabled`, `aria-required`, `aria-describedby`), etiquetas asociadas y soporte completo para navegación por teclado.
* **Ingeniería Defensiva y Manejo de Errores:** Bloques `try...catch...finally` robustos para gestionar fallas de red, estados de carga visuales y mensajes descriptivos en la interfaz.
* **Experiencia de Usuario (UI/UX):** Indicadores de carga dinámicos, botones de envío condicionales y transición hacia una tarjeta de éxito interactiva con opción de reinicio.
* **Arquitectura Moderna:** Empaquetado optimizado mediante **Vite** y procesamiento de datos mediante un backend seguro en **PHP**.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructuración semántica y atributos de accesibilidad.
* **CSS3:** Variables, componentes personalizados, diseño responsivo y efectos visuales fluidos.
* **JavaScript (ES6+):** Módulos nativos, promesas, manipulación avanzada del DOM y gestión asíncrona.
* **PHP 8+:** Endpoints dinámicos para la consulta y estructuración de datos geográficos en formato JSON.
* **Vite:** Herramienta de construcción y servidor de desarrollo rápido.

## 📁 Estructura del Proyecto

```text
/
├── api/
│   └── locations.php     # Endpoint PHP que suministra las ubicaciones en formato JSON
├── public/               # Recursos estáticos
├── src/
│   ├── main.js           # Lógica principal, peticiones fetch y manejo de eventos
│   └── style.css         # Estilos globales y estados de componentes
├── index.html            # Interfaz de usuario principal
├── vite.config.js        # Configuración del empaquetador Vite
└── README.md             # Documentación técnica del proyecto
