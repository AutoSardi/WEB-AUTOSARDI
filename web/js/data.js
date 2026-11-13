/* =========================================================================
   DATOS DE LA WEB DE AUTOMÓVILES SARDI
   -------------------------------------------------------------------------
   Lo más fácil es cambiarlos con «Editor-de-la-web.html» (va junto a la
   carpeta «web»). El editor reescribe este archivo entero.

   Si se edita a mano con el Bloc de notas:
   · Los textos van entre comillas.
   · Cada coche es un bloque { ... } dentro de COCHES. Sus fotos van en
     img/coches/<id>.jpg (1200 px de ancho) y img/coches/<id>-sm.jpg (545 px).
   · financiacion: true muestra el simulador de cuotas; false lo oculta.
   ========================================================================= */

window.SARDI = {
  "nombre": "Automóviles Sardi",
  "dominio": "www.autosardi.es",
  "telefono": "656 369 021",
  "telefonoHref": "+34656369021",
  "whatsapp": "34656369021",
  "email": "sardiautomoviles@gmail.com",
  "direccion": "C. José Antonio Muñoz Rojas · 29200 Antequera (Málaga)",
  "horario": "",
  "milanuncios": "https://www.milanuncios.com/tiendas-profesionales/automoviles-sardi-218698",
  "instagram": "",
  "facebook": "",
  "financiacion": false,
  "tin": 8.95,
  "legal": {
    "titular": "Amine Sardi",
    "nif": "X7396815S",
    "domicilio": "C. José Antonio Muñoz Rojas, 29200 Antequera (Málaga)",
    "registro": "",
    "actualizado": "10 de noviembre de 2026"
  }
};

window.COCHES = [
  {
    "id": "citroen-c4-cactus-2017",
    "marca": "Citroën",
    "modelo": "C4 Cactus",
    "version": "BlueHDi 100 CV Air",
    "anio": 2017,
    "km": 135000,
    "combustible": "Diésel",
    "cambio": "Manual",
    "cv": 100,
    "carroceria": "SUV compacto",
    "tipo": "turismo",
    "precio": 8500,
    "nota": "El más reciente del stock. Crossover urbano con los Airbump laterales que tanto protegen en aparcamientos."
  },
  {
    "id": "vw-golf-variant-2014",
    "marca": "Volkswagen",
    "modelo": "Golf Variant",
    "version": "Sport 2.0 TDI 150 CV",
    "anio": 2014,
    "km": 240000,
    "combustible": "Diésel",
    "cambio": "6 velocidades",
    "cv": 150,
    "carroceria": "Familiar",
    "tipo": "turismo",
    "precio": 8000,
    "nota": "Golf 7 familiar con el 2.0 TDI de 150 CV: maletero grande y motor de autovía."
  },
  {
    "id": "hyundai-getz-2009",
    "marca": "Hyundai",
    "modelo": "Getz",
    "version": "1.1",
    "anio": 2009,
    "km": 72000,
    "combustible": "Gasolina",
    "cambio": "Manual",
    "cv": null,
    "carroceria": "Utilitario",
    "tipo": "turismo",
    "precio": 3999,
    "nota": "Solo 72.000 km. Pequeño, gasta poco y es ideal como primer coche."
  },
  {
    "id": "peugeot-206-2006",
    "marca": "Peugeot",
    "modelo": "206",
    "version": "1.4 HDi X-Line",
    "anio": 2006,
    "km": 340000,
    "combustible": "Diésel",
    "cambio": "Manual",
    "cv": null,
    "carroceria": "Utilitario",
    "tipo": "turismo",
    "precio": 1750,
    "nota": "El 1.4 HDi es de los motores más duros que hay. Coche para moverse barato."
  },
  {
    "id": "peugeot-partner-2001",
    "marca": "Peugeot",
    "modelo": "Partner",
    "version": "190C 1.9 D",
    "anio": 2001,
    "km": 280000,
    "combustible": "Diésel",
    "cambio": "Manual",
    "cv": null,
    "carroceria": "Furgoneta",
    "tipo": "industrial",
    "precio": 1750,
    "nota": "Furgoneta de trabajo con el 1.9 D atmosférico, sencillo de mantener."
  },
  {
    "id": "mercedez-c220-cdi-2011",
    "marca": "Mercedez",
    "modelo": "C220 CDI",
    "version": "2.2 CDI BLUE EFF",
    "anio": 2011,
    "km": 248000,
    "combustible": "Diésel",
    "cambio": "Manual",
    "cv": 136,
    "carroceria": "Utilitario",
    "tipo": "turismo",
    "precio": 7500,
    "nota": ""
  },
  {
    "id": "peugeot-5008-2017",
    "marca": "Peugeot",
    "modelo": "5008",
    "version": "1.6 BLUEHDI 88Kw 120CV",
    "anio": 2017,
    "km": 141000,
    "combustible": "Diésel",
    "cambio": "Manual",
    "cv": 120,
    "carroceria": "Utilitario",
    "tipo": "turismo",
    "precio": 8500,
    "nota": ""
  },
  {
    "id": "fiat-500l-2014",
    "marca": "Fiat",
    "modelo": "500L",
    "version": "1.3 16V MULTIYET II",
    "anio": 2014,
    "km": 165000,
    "combustible": "Diésel",
    "cambio": "Manual",
    "cv": 83,
    "carroceria": "Utilitario",
    "tipo": "turismo",
    "precio": 5999,
    "nota": ""
  },
  {
    "id": "volkswagen-tiguan-rline-2015",
    "marca": "Volkswagen",
    "modelo": "Tiguan Rline",
    "version": "2.0 TDI",
    "anio": 2015,
    "km": 190000,
    "combustible": "Diésel",
    "cambio": "Automático",
    "cv": 140,
    "carroceria": "Turismo",
    "tipo": "turismo",
    "precio": 13999,
    "fotos": [
      "img/coches/volkswagen-tiguan-rline-2015.jpg",
      "img/coches/volkswagen-tiguan-rline-2015-2.jpg",
      "img/coches/volkswagen-tiguan-rline-2015-3.jpg"
    ]
  }
];

/* Rutas de las fotos de cada coche (no tocar) */
window.COCHES.forEach(function (c) {
  c.foto = { sm: 'img/coches/' + c.id + '-sm.jpg', lg: 'img/coches/' + c.id + '.jpg' };
});
