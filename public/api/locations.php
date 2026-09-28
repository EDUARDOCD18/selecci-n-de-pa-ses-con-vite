<?php
// Encabezados HTTP para respuestas JSON y soporte CORS en desarrollo local
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

// Base de datos estructurada en arreglos asociativos
$locations = [
    "ve" => [
        "id" => "ve",
        "name" => "Venezuela",
        "states" => [
            "mir" => [
                "id" => "mir",
                "name" => "Miranda",
                "cities" => ["Los Teques", "Carrizal", "San Antonio de los Altos", "Chacao"]
            ],
            "dt" => [
                "id" => "dt",
                "name" => "Distrito Capital",
                "cities" => ["Caracas", "El Hatillo", "Sucre"]
            ],
            "car" => [
                "id" => "car",
                "name" => "Carabobo",
                "cities" => ["Valencia", "Puerto Cabello", "Naguanagua"]
            ]
        ]
    ],
    "es" => [
        "id" => "es",
        "name" => "España",
        "states" => [
            "mad" => [
                "id" => "mad",
                "name" => "Madrid",
                "cities" => ["Madrid Centro", "Alcalá de Henares", "Móstoles"]
            ],
            "cat" => [
                "id" => "cat",
                "name" => "Cataluña",
                "cities" => ["Barcelona", "Girona", "Tarragona"]
            ]
        ]
    ],
    "mx" => [
        "id" => "mx",
        "name" => "México",
        "states" => [
            "cmx" => [
                "id" => "cmx",
                "name" => "Ciudad de México",
                "cities" => ["Coyoacán", "Polanco", "Iztapalapa"]
            ],
            "jnl" => [
                "id" => "jnl",
                "name" => "Jalisco",
                "cities" => ["Guadalajara", "Zapopan", "Puerto Vallarta"]
            ]
        ]
    ]
];

// Función para emitir respuestas formateadas y finalizar la ejecución
function sendJsonResponse(array $payload, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Captura de parámetros GET sanitizados
$action  = isset($_GET['action'])  ? trim($_GET['action'])  : 'countries';
$country = isset($_GET['country']) ? trim($_GET['country']) : '';
$state   = isset($_GET['state'])   ? trim($_GET['state'])   : '';

// Procesamiento según la acción solicitada
switch ($action) {

    // Nivel 1: Obtener todos los países disponibles
    case 'countries':
        $countriesList = array_map(function ($item) {
            return [
                'id' => $item['id'],
                'name' => $item['name']
            ];
        }, array_values($locations));

        sendJsonResponse([
            'status' => 'success',
            'data' => $countriesList
        ]);
        break;

    // Nivel 2: Obtener estados pertenecientes a un país específico
    case 'states':
        if (empty($country)) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'El parámetro "country" es obligatorio.'
            ], 400);
        }

        if (!isset($locations[$country])) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'El país especificado no existe.'
            ], 404);
        }

        $statesList = array_map(function ($item) {
            return [
                'id' => $item['id'],
                'name' => $item['name']
            ];
        }, array_values($locations[$country]['states']));

        sendJsonResponse([
            'status' => 'success',
            'data' => $statesList
        ]);
        break;

    // Nivel 3: Obtener ciudades pertenecientes a un estado específico
    case 'cities':
        if (empty($country) || empty($state)) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Los parámetros "country" y "state" son obligatorios.'
            ], 400);
        }

        if (!isset($locations[$country]['states'][$state])) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'El estado especificado no existe en el país indicado.'
            ], 404);
        }

        $citiesList = $locations[$country]['states'][$state]['cities'];

        sendJsonResponse([
            'status' => 'success',
            'data' => $citiesList
        ]);
        break;

    // Acción no válida
    default:
        sendJsonResponse([
            'status' => 'error',
            'message' => 'Acción no válida. Opciones permitidas: countries, states, cities.'
        ], 400);
        break;
}