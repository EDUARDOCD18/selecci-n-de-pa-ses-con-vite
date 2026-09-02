<?php
// Permitir solicitudes CORS para desarrollo local con Vite
header("Acces-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Base de datos simulada en arreglos asociativos
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

// Respuesta provisional del dataset completo (en el Día 3 se implementará el filtrado por parámetros)
echo json_encode([
    "status" => "success",
    "data" => $locations
], JSON_UNESCAPED_UNICODE);
