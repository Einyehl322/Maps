import type { MenuPrices } from './price'

/**
 * Cartas de los lugares de la guía, buscadas en internet el 5 de noviembre
 * de 2026 (precios publicados, cada uno con su fuente). Generado a partir de
 * la investigación; los lugares sin precios publicados no están aquí y
 * siguen usando su rango aproximado.
 */
export const GUIDE_MENU_SNAPSHOT: Record<string, MenuPrices> = {
  "rec:al-toke-pez": {
    "key": "rec:al-toke-pez",
    "found": true,
    "confidence": "baja",
    "summary": "No hay carta oficial ni app de delivery con precios; el único precio sale de reseñas sin fecha en Mapstr (que no coinciden: S/ 25 y S/ 30 por el combinado). Ojo: según Trome (agosto 2025), Al Toke Pez dejó Av. Angamos Este 886 (Surquillo) y se mudó a Manuel Bonilla 113, Miraflores, con la misma carta.",
    "source_date": null,
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Combinado",
        "price": 30.0,
        "category": "fondo",
        "note": "Ceviche, arroz con mariscos y chicharrón de calamar; reseñas sin fecha que dan S/ 25 y S/ 30 (se toma el valor alto)",
        "source_url": "https://mapstr.com/place/NJIQj3pEjmg"
      }
    ]
  },
  "rec:antica-trattoria": {
    "key": "rec:antica-trattoria",
    "found": true,
    "confidence": "media",
    "summary": "Precios de la web oficial de Antica Pizzería (sede Barranco en Av. Prolongación San Martín 201), que muestra solo una selección de platos; la carta completa no está publicada y la página no indica fecha.",
    "source_date": null,
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Bruschetta Antica",
        "price": 25.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://anticapizzeria.com.pe/"
      },
      {
        "name": "Ensalada Milano",
        "price": 44.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://anticapizzeria.com.pe/"
      },
      {
        "name": "Pizza Sandrita",
        "price": 45.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://anticapizzeria.com.pe/"
      },
      {
        "name": "Fetuccine Alfredo",
        "price": 35.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://anticapizzeria.com.pe/"
      },
      {
        "name": "Ossobuco con fettuccine",
        "price": 58.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://anticapizzeria.com.pe/"
      },
      {
        "name": "Crocante de manzana con helado",
        "price": 20.0,
        "category": "postre",
        "note": null,
        "source_url": "https://anticapizzeria.com.pe/"
      }
    ]
  },
  "rec:astrid-y-gaston": {
    "key": "rec:astrid-y-gaston",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta oficial en PDF (Primavera-Verano 2027, archivo de oct. 2026), la carta de postres (sept. 2026) y la carta de bar (dic. 2024) en astridygaston.com; incluyen impuestos y servicio. El PDF del menú degustación (Agasajo / Encuentro, 2026) no muestra precio, así que no se registró.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Buñuelos del norte (unidad)",
        "price": 21.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "Conchitas Cantuarias (unidad)",
        "price": 29.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "El cuy pekinés (unidad)",
        "price": 39.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "El huevo tímido",
        "price": 49.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "La crema del \"Senador\"",
        "price": 49.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "Los hakaos de chupe",
        "price": 59.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "Las mollejas limeñas",
        "price": 68.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "Tiradito de lenguado",
        "price": 88.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "Los cebiches del día – lenguado",
        "price": 98.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "Raviolis de alcachofa",
        "price": 78.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "Risotto del Callao",
        "price": 89.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "La cola de buey, Trujillo Oaxaca",
        "price": 89.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "El lomito de ternero",
        "price": 98.0,
        "category": "fondo",
        "note": "saltado a lo pobre",
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "Corvina en escamas de papas nativas",
        "price": 128.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "El pato y la lúcuma",
        "price": 128.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "El arroz de chupe de langostinos jumbo (para compartir)",
        "price": 148.0,
        "category": "fondo",
        "note": "para compartir",
        "source_url": "https://astridygaston.com/static/2846c58e94f3fa6975e5cad44e996e69/AG-carta-29.10.26-20x29-1.pdf"
      },
      {
        "name": "El aguaje",
        "price": 38.0,
        "category": "postre",
        "note": null,
        "source_url": "https://astridygaston.com/cartas/A&G_Carta_Web_Postres_ES.pdf"
      },
      {
        "name": "Tiramisú a la lúcuma",
        "price": 45.0,
        "category": "postre",
        "note": null,
        "source_url": "https://astridygaston.com/cartas/A&G_Carta_Web_Postres_ES.pdf"
      },
      {
        "name": "Chocolate tibio y su uchucuta",
        "price": 49.0,
        "category": "postre",
        "note": null,
        "source_url": "https://astridygaston.com/cartas/A&G_Carta_Web_Postres_ES.pdf"
      },
      {
        "name": "Pisco sour 3 cepas",
        "price": 44.0,
        "category": "bebida",
        "note": "carta de bar fechada dic. 2024",
        "source_url": "https://astridygaston.com/cartas/A&G_Carta_Web_Bar_ES.pdf"
      },
      {
        "name": "Chilcano de pisco",
        "price": 42.0,
        "category": "bebida",
        "note": "carta de bar fechada dic. 2024",
        "source_url": "https://astridygaston.com/cartas/A&G_Carta_Web_Bar_ES.pdf"
      },
      {
        "name": "Cuy pekinés cocktail",
        "price": 48.0,
        "category": "bebida",
        "note": "carta de bar fechada dic. 2024",
        "source_url": "https://astridygaston.com/cartas/A&G_Carta_Web_Bar_ES.pdf"
      },
      {
        "name": "Cusqueña dorada 310 ml",
        "price": 16.0,
        "category": "bebida",
        "note": "carta de bar fechada dic. 2024",
        "source_url": "https://astridygaston.com/cartas/A&G_Carta_Web_Bar_ES.pdf"
      },
      {
        "name": "La moradita (sin alcohol)",
        "price": 29.0,
        "category": "bebida",
        "note": "carta de bar fechada dic. 2024",
        "source_url": "https://astridygaston.com/cartas/A&G_Carta_Web_Bar_ES.pdf"
      }
    ]
  },
  "rec:bisetti": {
    "key": "rec:bisetti",
    "found": true,
    "confidence": "baja",
    "summary": "Solo hay precios de un blog de feb. 2020; un blog de sept. 2023 y Airbnb indican que el café de Pedro de Osma cerró al público (la marca sigue vendiendo café en línea). Conviene confirmar que siga abierto antes de ir.",
    "source_date": "2020",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Affogato",
        "price": 11.0,
        "category": "bebida",
        "note": "precio de feb. 2020",
        "source_url": "https://travelfeed.com/@waybeyondpadthai/this-cafe-you-will-love-or-barranco-peru"
      },
      {
        "name": "Classic Americano",
        "price": 8.0,
        "category": "bebida",
        "note": "precio de feb. 2020",
        "source_url": "https://travelfeed.com/@waybeyondpadthai/this-cafe-you-will-love-or-barranco-peru"
      }
    ]
  },
  "rec:canta-rana": {
    "key": "rec:canta-rana",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta publicada en la web oficial de Canta Rana (cantarana.pe, página actualizada en octubre de 2026).",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Leche de tigre",
        "price": 30.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Causa Canta Ranita (chicharrón de pescado)",
        "price": 40.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Choros a la chalaca",
        "price": 40.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Pulpo al olivo",
        "price": 70.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Chicharrón de calamar",
        "price": 55.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Ceviche de pescado",
        "price": 50.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Ceviche mixto",
        "price": 50.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Ceviche apaltado",
        "price": 60.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Ceviche de lenguado",
        "price": 90.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Tiradito de pescado",
        "price": 45.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Jalea personal",
        "price": 80.0,
        "category": "fondo",
        "note": "Jalea fuente S/ 170",
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Arroz c/ mariscos",
        "price": 55.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Arroz c/ conchas de abanico",
        "price": 55.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Lomo saltado",
        "price": 65.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Sudado de pescado",
        "price": 54.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Suspiro limeño",
        "price": 20.0,
        "category": "postre",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Crema volteada",
        "price": 20.0,
        "category": "postre",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Chicha morada (vaso)",
        "price": 10.0,
        "category": "bebida",
        "note": "Jarra S/ 28",
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Limonada (vaso)",
        "price": 12.0,
        "category": "bebida",
        "note": "Jarra S/ 28",
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Gaseosa mediana",
        "price": 8.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Pisco sour",
        "price": 30.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://cantarana.pe/nuesta-carta/"
      },
      {
        "name": "Cusqueña (620 ml)",
        "price": 20.0,
        "category": "bebida",
        "note": "310 ml S/ 14",
        "source_url": "https://cantarana.pe/nuesta-carta/"
      }
    ]
  },
  "rec:carnaval": {
    "key": "rec:carnaval",
    "found": true,
    "confidence": "baja",
    "summary": "Los únicos precios concretos son de una reseña de Living in Peru de abril de 2018 (el artículo lo ubica en Miraflores, aunque se refiere al mismo bar de Aaron Díaz); la web oficial no publica carta. Una guía de oct. 2026 da un gasto de USD 30–50 por persona (no registrado por estar en dólares). Probablemente los precios actuales sean más altos.",
    "source_date": "2018",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Gran Carnaval",
        "price": 150.0,
        "category": "bebida",
        "note": "degustación de cócteles de la casa; precio de 2018",
        "source_url": "https://www.livinginperu.com/bar-review-carnaval/"
      },
      {
        "name": "Chartreuse Experience",
        "price": 120.0,
        "category": "bebida",
        "note": "precio de 2018",
        "source_url": "https://www.livinginperu.com/bar-review-carnaval/"
      },
      {
        "name": "Carnaval",
        "price": 38.0,
        "category": "bebida",
        "note": "cóctel; precio de 2018",
        "source_url": "https://www.livinginperu.com/bar-review-carnaval/"
      },
      {
        "name": "Maui",
        "price": 48.0,
        "category": "bebida",
        "note": "cóctel; precio de 2018",
        "source_url": "https://www.livinginperu.com/bar-review-carnaval/"
      },
      {
        "name": "Black Truffle",
        "price": 48.0,
        "category": "bebida",
        "note": "cóctel; precio de 2018",
        "source_url": "https://www.livinginperu.com/bar-review-carnaval/"
      },
      {
        "name": "Crudité",
        "price": 38.0,
        "category": "entrada",
        "note": "precio de 2018",
        "source_url": "https://www.livinginperu.com/bar-review-carnaval/"
      },
      {
        "name": "Capeletti Trufado",
        "price": 38.0,
        "category": "entrada",
        "note": "precio de 2018",
        "source_url": "https://www.livinginperu.com/bar-review-carnaval/"
      }
    ]
  },
  "rec:central": {
    "key": "rec:central",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la página oficial del menú de Central (centralrestaurante.com.pe/menu, vigente en noviembre de 2026): degustación Mundo en Desnivel a S/ 1630 por persona y maridajes a S/ 684. Las cifras de 2023 (S/ 1045–1250) quedaron desactualizadas y se descartaron.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Mundo en Desnivel (menú degustación, 12 momentos)",
        "price": 1630.0,
        "category": "fondo",
        "note": "Por persona; 12 momentos y 32 preparaciones",
        "source_url": "https://centralrestaurante.com.pe/menu"
      },
      {
        "name": "Maridaje (Equilibrio Mater / Terroir Vinos del Mundo / Conexión sin alcohol)",
        "price": 684.0,
        "category": "bebida",
        "note": "La página pone '684 PEN por persona' al final de las tres opciones de maridaje sin aclarar si todas cuestan lo mismo; adicional al menú",
        "source_url": "https://centralrestaurante.com.pe/menu"
      }
    ]
  },
  "rec:el-bolivariano": {
    "key": "rec:el-bolivariano",
    "found": true,
    "confidence": "media",
    "summary": "Precios de la carta publicada en la web oficial elbolivariano.com (secciones de entradas, platos de fondo, postres y Boli-Bar); la web no indica fecha de actualización.",
    "source_date": null,
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Anticuchos de Corazón",
        "price": 39.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://elbolivariano.com/entradas-criollas/"
      },
      {
        "name": "Causa de Pollo",
        "price": 32.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://elbolivariano.com/entradas-criollas/"
      },
      {
        "name": "Papa a la Huancaína",
        "price": 28.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://elbolivariano.com/entradas-criollas/"
      },
      {
        "name": "Papa Rellena Tradicional",
        "price": 33.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://elbolivariano.com/entradas-criollas/"
      },
      {
        "name": "Rocoto Relleno",
        "price": 40.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://elbolivariano.com/entradas-criollas/"
      },
      {
        "name": "Tamalitos",
        "price": 15.0,
        "category": "entrada",
        "note": "Verdes, tradicionales o humitas",
        "source_url": "https://elbolivariano.com/entradas-criollas/"
      },
      {
        "name": "Ají de Gallina",
        "price": 39.5,
        "category": "fondo",
        "note": null,
        "source_url": "https://elbolivariano.com/platos-de-fondo/"
      },
      {
        "name": "Arroz con Pollo",
        "price": 41.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://elbolivariano.com/platos-de-fondo/"
      },
      {
        "name": "Carapulcra",
        "price": 37.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://elbolivariano.com/platos-de-fondo/"
      },
      {
        "name": "Seco de Res",
        "price": 44.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://elbolivariano.com/platos-de-fondo/"
      },
      {
        "name": "Dúo con Arroz",
        "price": 47.0,
        "category": "fondo",
        "note": "Dos a elegir: cau cau, patita, carapulcra o ají de gallina",
        "source_url": "https://elbolivariano.com/platos-de-fondo/"
      },
      {
        "name": "Lomo Saltado",
        "price": 59.5,
        "category": "fondo",
        "note": null,
        "source_url": "https://elbolivariano.com/platos-de-fondo/"
      },
      {
        "name": "Tallarines Verdes con Lomo Apanado",
        "price": 59.5,
        "category": "fondo",
        "note": null,
        "source_url": "https://elbolivariano.com/platos-de-fondo/"
      },
      {
        "name": "Picarones",
        "price": 21.0,
        "category": "postre",
        "note": null,
        "source_url": "https://elbolivariano.com/postres/"
      },
      {
        "name": "Mazamorra Morada",
        "price": 19.0,
        "category": "postre",
        "note": null,
        "source_url": "https://elbolivariano.com/postres/"
      },
      {
        "name": "Suspiro Bolivariano",
        "price": 22.0,
        "category": "postre",
        "note": null,
        "source_url": "https://elbolivariano.com/postres/"
      },
      {
        "name": "Vaso con Chicha Morada",
        "price": 9.0,
        "category": "bebida",
        "note": "Jarra 1 lt S/ 21; jarra 2 lts S/ 35",
        "source_url": "https://elbolivariano.com/boli-bar/"
      },
      {
        "name": "Vaso con Limonada Frozen",
        "price": 10.0,
        "category": "bebida",
        "note": "Jarra de litro S/ 21",
        "source_url": "https://elbolivariano.com/boli-bar/"
      },
      {
        "name": "Gaseosa o Agua Mineral Personal",
        "price": 8.0,
        "category": "bebida",
        "note": "Gaseosa grande S/ 16",
        "source_url": "https://elbolivariano.com/boli-bar/"
      },
      {
        "name": "Pisco Sour",
        "price": 24.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://elbolivariano.com/boli-bar/"
      },
      {
        "name": "Chilcano de Pisco",
        "price": 24.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://elbolivariano.com/boli-bar/"
      },
      {
        "name": "Cerveza Grande",
        "price": 19.0,
        "category": "bebida",
        "note": "Cerveza chica S/ 12–13.50",
        "source_url": "https://elbolivariano.com/boli-bar/"
      }
    ]
  },
  "rec:el-chinito": {
    "key": "rec:el-chinito",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta oficial 'Octubre 2026' y la carta de bebidas de la cadena El Chinito, descargadas de elchinito.com.pe/carta; es la carta general de la cadena (algunos platos solo en locales seleccionados).",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Chicharrón (sánguche)",
        "price": 25.9,
        "category": "fondo",
        "note": "Todos los sanguchones cuestan S/ 25.90",
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Jamón del país (sánguche)",
        "price": 25.9,
        "category": "fondo",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Butifarra del Chinito",
        "price": 25.9,
        "category": "fondo",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Pavito (sánguche)",
        "price": 25.9,
        "category": "fondo",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Lomito ahumado (sánguche)",
        "price": 25.9,
        "category": "fondo",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "El Mixto (sánguche de dos carnes)",
        "price": 25.9,
        "category": "fondo",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Combo Taypá",
        "price": 31.9,
        "category": "otro",
        "note": "1 sánguche de chicharrón + 1 chicha personal",
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Combo Para Dos",
        "price": 78.0,
        "category": "otro",
        "note": "1/4 kg de chicharrón + costillitas + 2 panes",
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Chicharrón al peso 1/4 de kilo",
        "price": 35.0,
        "category": "fondo",
        "note": "1/2 kilo S/ 65",
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Tamal especial",
        "price": 12.0,
        "category": "entrada",
        "note": "De cerdo o pollo",
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Camotito frito",
        "price": 8.5,
        "category": "entrada",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Chanchipapa",
        "price": 26.5,
        "category": "fondo",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Chaufarroncito",
        "price": 40.0,
        "category": "fondo",
        "note": "Almuerzos solo en algunos locales",
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Costillitas del Chinito",
        "price": 42.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/286d58e3-c530-428e-a105-7a129fa7c720/CARTA%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Chicha morada personal",
        "price": 8.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/02fba5e1-d74c-4a5b-9d56-0cc3131ce6be/CARTA%20BEBIDAS%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Emoliente personal",
        "price": 8.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/02fba5e1-d74c-4a5b-9d56-0cc3131ce6be/CARTA%20BEBIDAS%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Gaseosa personal",
        "price": 5.9,
        "category": "bebida",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/02fba5e1-d74c-4a5b-9d56-0cc3131ce6be/CARTA%20BEBIDAS%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Jugo natural (papaya, piña, fresa, mango, maracuyá)",
        "price": 12.0,
        "category": "bebida",
        "note": "Naranja S/ 13.50",
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/02fba5e1-d74c-4a5b-9d56-0cc3131ce6be/CARTA%20BEBIDAS%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Café pasado gota a gota",
        "price": 8.5,
        "category": "bebida",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/02fba5e1-d74c-4a5b-9d56-0cc3131ce6be/CARTA%20BEBIDAS%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Limonada frozen",
        "price": 12.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/02fba5e1-d74c-4a5b-9d56-0cc3131ce6be/CARTA%20BEBIDAS%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      },
      {
        "name": "Cusqueña",
        "price": 13.2,
        "category": "bebida",
        "note": null,
        "source_url": "https://img1.wsimg.com/blobby/go/b0c4de75-e3bc-402b-af95-81b99bcfc857/downloads/02fba5e1-d74c-4a5b-9d56-0cc3131ce6be/CARTA%20BEBIDAS%20OCTUBRE%202026%20WEB.pdf?ver=1790858600298"
      }
    ]
  },
  "rec:el-mercado": {
    "key": "rec:el-mercado",
    "found": true,
    "confidence": "baja",
    "summary": "La carta oficial (elmercado.pe/la-carta) lista los platos pero sin precios. Los únicos precios concretos son de un blog de marzo de 2017 (Eating the World), muy desactualizados: hoy probablemente cuestan bastante más.",
    "source_date": "2017",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Cebiche de lenguado",
        "price": 55.0,
        "category": "fondo",
        "note": "Precio de 2017; el plato sigue en la carta actual",
        "source_url": "https://eatingtheworld.net/tag/causa/"
      },
      {
        "name": "Cebiche Norte-Norte",
        "price": 54.0,
        "category": "fondo",
        "note": "Precio de 2017; ya no figura en la carta actual",
        "source_url": "https://eatingtheworld.net/tag/causa/"
      },
      {
        "name": "Causa Tumbesina",
        "price": 42.0,
        "category": "entrada",
        "note": "Precio de 2017; ya no figura en la carta actual",
        "source_url": "https://eatingtheworld.net/tag/causa/"
      }
    ]
  },
  "rec:el-tio-mario": {
    "key": "rec:el-tio-mario",
    "found": true,
    "confidence": "baja",
    "summary": "Solo se encontró una mención de precio en una nota de Infomercado de noviembre de 2022 (combos para compartir a S/40); la web oficial no tiene carta y no aparece en apps de delivery.",
    "source_date": "2022",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Combo para compartir",
        "price": 40.0,
        "category": "fondo",
        "note": "Nota de 2022: 'desde presentaciones personales hasta combos para compartir a S/40'",
        "source_url": "https://infomercado.pe/lugares-con-los-precios-mas-bajos-para-comer-anticuchos-021122-gb/"
      }
    ]
  },
  "rec:fiesta-gourmet": {
    "key": "rec:fiesta-gourmet",
    "found": true,
    "confidence": "baja",
    "summary": "No se encontró carta con precios por plato (sin web oficial accesible ni delivery con precios); el único dato es el gasto promedio por persona sin bebidas citado por Bloomberg Línea en marzo 2023. Algunas reseñas mencionan precios en dólares, que se omitieron.",
    "source_date": "2023",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Costo promedio por persona (sin bebidas)",
        "price": 370.0,
        "category": "otro",
        "note": "Gasto promedio por persona citado por Bloomberg Línea (PEN 370 / USD 98), no es precio de un plato",
        "source_url": "https://bloomberglinea.com/2023/03/24/fiesta-2"
      }
    ]
  },
  "rec:huaca-pucllana": {
    "key": "rec:huaca-pucllana",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta oficial en PDF (enlace 'Ver Menú' de resthuacapucllana.com), archivo de junio 2026; la carta indica que los precios incluyen impuestos y servicio.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Pan de la casa",
        "price": 20.0,
        "category": "entrada",
        "note": "Con mantequilla de ají ahumado",
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Choclito con queso frito",
        "price": 42.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Anticuchitos de corazón",
        "price": 48.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Papitas rellenas",
        "price": 44.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Causitas Pucllana",
        "price": 60.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Clásico cebiche",
        "price": 78.0,
        "category": "entrada",
        "note": "De corvina o charela",
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Nuestro clásico Lomo Saltado",
        "price": 79.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Ají de gallina a la antigua",
        "price": 68.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Arroz con pato",
        "price": 80.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Chupe de camarones",
        "price": 98.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Rocoto relleno de lomo a la arequipeña",
        "price": 64.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "La Hamburguesa de La Huaca",
        "price": 55.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Bife angosto Americano (400 gr)",
        "price": 150.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Suspiro de Limeña merengado y helado de canela",
        "price": 36.0,
        "category": "postre",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Picarones con miel de chancaca",
        "price": 36.0,
        "category": "postre",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Helados y sorbetes (2 bolas)",
        "price": 26.0,
        "category": "postre",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Chicha morada",
        "price": 14.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Limonada",
        "price": 14.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Gaseosas",
        "price": 10.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Jugos naturales",
        "price": 20.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Tradicional pisco sour (simple)",
        "price": 38.0,
        "category": "bebida",
        "note": "Doble S/ 54",
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Cusqueña",
        "price": 16.0,
        "category": "bebida",
        "note": "Dorada / Trigo / Malta",
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      },
      {
        "name": "Vino por copa",
        "price": 38.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.resthuacapucllana.com/_files/ugd/8a31fd_7c5ad87981c74ff1b97da013bb75f874.pdf"
      }
    ]
  },
  "rec:isolina": {
    "key": "rec:isolina",
    "found": true,
    "confidence": "alta",
    "summary": "Carta oficial del pedido en línea en isolina.pe (vigente en 2026). Muchos platos son para compartir; hay versiones personales más baratas.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Pan con chicharrón",
        "price": 31.0,
        "category": "entrada",
        "note": "Sánguche",
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Butifarra de lechón",
        "price": 29.0,
        "category": "entrada",
        "note": "Sánguche",
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Sangrecita con camote frito",
        "price": 37.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Papas y choclos Isolina",
        "price": 48.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Causa limeña",
        "price": 58.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Papa rellena",
        "price": 58.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Cebiche con chicharrón de pulpo",
        "price": 101.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Lomo saltado (personal)",
        "price": 78.0,
        "category": "fondo",
        "note": "Para compartir: S/98",
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Ají de gallina (personal)",
        "price": 68.0,
        "category": "fondo",
        "note": "Para compartir: S/88",
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Cau cau con sangrecita (personal)",
        "price": 51.0,
        "category": "fondo",
        "note": "Para compartir: S/63",
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Guiso de mollejitas (personal)",
        "price": 43.0,
        "category": "fondo",
        "note": "Para compartir: S/53",
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Seco de asado de tira con frejoles (personal)",
        "price": 98.0,
        "category": "fondo",
        "note": "Para compartir: S/143",
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Arroz tapado",
        "price": 63.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Crema volteada",
        "price": 24.0,
        "category": "postre",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Arroz con leche",
        "price": 20.0,
        "category": "postre",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Mazamorra morada",
        "price": 20.0,
        "category": "postre",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Chicha morada (1 litro)",
        "price": 33.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Limonada (1 litro)",
        "price": 33.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Inca Kola (300 ml)",
        "price": 9.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      },
      {
        "name": "Agua San Luis sin gas (330 ml)",
        "price": 9.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.isolina.pe/"
      }
    ]
  },
  "rec:juanito": {
    "key": "rec:juanito",
    "found": true,
    "confidence": "baja",
    "summary": "Solo una reseña de usuario sin fecha en Mapstr (ficha de Juanito, Av. Grau 270) con tres platos; no se halló el precio del sánguche de jamón, que es su especialidad. Una nota de El Comercio de 2013 lo daba por cerrado, aunque hoy aparece activo.",
    "source_date": null,
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Lomo saltado con tacu tacu",
        "price": 39.0,
        "category": "fondo",
        "note": "Reseña de usuario sin fecha",
        "source_url": "https://mapstr.com/place/xAQ2uYiTytg"
      },
      {
        "name": "Leche de tigre",
        "price": 24.0,
        "category": "entrada",
        "note": "Reseña de usuario sin fecha",
        "source_url": "https://mapstr.com/place/xAQ2uYiTytg"
      },
      {
        "name": "Ají de gallina",
        "price": 18.0,
        "category": "fondo",
        "note": "Reseña de usuario sin fecha",
        "source_url": "https://mapstr.com/place/xAQ2uYiTytg"
      }
    ]
  },
  "rec:kjolle": {
    "key": "rec:kjolle",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la página oficial del menú de Kjolle (kjolle.com/en/menu, actualizada en octubre de 2026): menú degustación Mater Surroundings de 9 tiempos a S/ 988 y maridaje a S/ 456. El maridaje sin alcohol (S/ 256) viene de Caretas, junio de 2025. Según la reserva en Mesa247, los precios incluyen IGV y 12% de servicio.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Mater Surroundings (menú degustación, 9 tiempos)",
        "price": 988.0,
        "category": "fondo",
        "note": "Por persona; también existe la versión Vegetal Mater Surroundings (la página no indica si su precio es distinto)",
        "source_url": "https://kjolle.com/en/menu"
      },
      {
        "name": "Maridaje Mater Liquids (vinos y destilados)",
        "price": 456.0,
        "category": "bebida",
        "note": "La web oficial (2026) pone PEN 456 debajo de 'Nectars & Extracts' y 'Mater Liquids'; Caretas (junio 2025) lo atribuye al maridaje con alcohol. Adicional al menú",
        "source_url": "https://kjolle.com/en/menu"
      },
      {
        "name": "Maridaje sin alcohol ('Néctares')",
        "price": 256.0,
        "category": "bebida",
        "note": "Fuente: Caretas, junio de 2025 (no oficial); la web oficial no muestra un precio separado",
        "source_url": "https://caretas.pe/?p=755267"
      }
    ]
  },
  "rec:la-granja-azul": {
    "key": "rec:la-granja-azul",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta oficial del local de Santa Clara (PDF 'GRANJA AZUL, carta SANTA CLARA 2026' enlazado desde granjaazul.com.pe, agosto de 2026); incluyen impuestos y servicio. En Santa Clara el pollo se ofrece como opción ilimitada o en los lunch ejecutivos (no se ve el 1/4 o 1/2 de pollo suelto).",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Opción ilimitada por persona (pollo Granja Azul)",
        "price": 98.0,
        "category": "fondo",
        "note": "Incluye anticuchos mixtos, pollo ilimitado con papas, ensalada y una gaseosa o agua personal; solo en mesa",
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Lunch Ejecutivo 1",
        "price": 59.0,
        "category": "fondo",
        "note": "1/2 pollo con papas, ensalada, anticuchos mixtos y gaseosa; no válido fines de semana ni feriados",
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Lunch Ejecutivo 2",
        "price": 75.0,
        "category": "fondo",
        "note": "Medio lomo a la parrilla (200 g) con papas, ensalada y gaseosa; no válido fines de semana ni feriados",
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Menú de niño (3 a 10 años)",
        "price": 37.0,
        "category": "fondo",
        "note": "1/4 de pollo con papas, chicha o limonada y 1 bola de helado",
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Lomo de res (300 g.)",
        "price": 89.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Salmón 1998",
        "price": 68.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Anticuchos Granja Azul",
        "price": 18.0,
        "category": "entrada",
        "note": "Anticuchos de hígado de pollo",
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Anticuchos de corazón de res",
        "price": 28.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Anticuchos mixtos",
        "price": 24.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Brochetas de pollo Granja Azul",
        "price": 32.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Papas fritas peruanas",
        "price": 18.0,
        "category": "otro",
        "note": "Guarnición",
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Picarones de Santa Clara",
        "price": 19.0,
        "category": "postre",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Crepe Suzette",
        "price": 35.0,
        "category": "postre",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Crepe con manjar blanco",
        "price": 25.0,
        "category": "postre",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Chicha morada (vaso)",
        "price": 10.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Chicha morada (1 litro)",
        "price": 29.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Limonada clásica (vaso)",
        "price": 10.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Gaseosa",
        "price": 8.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Pisco Sour Clásico",
        "price": 28.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      },
      {
        "name": "Cerveza Pilsen",
        "price": 16.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://invertur.com.pe/granjaazul/cartagranjaazulsantaclara.pdf"
      }
    ]
  },
  "rec:la-lucha": {
    "key": "rec:la-lucha",
    "found": true,
    "confidence": "baja",
    "summary": "No hay carta oficial en línea (lalucha.com.pe solo dice 'Próximamente') ni ficha de delivery en Perú encontrada; el único dato es un rango general de precios de sánguches de una guía de viajes sin fecha.",
    "source_date": null,
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Sánguches y hamburguesas",
        "price": 23.0,
        "category": "fondo",
        "note": "Rango S/10–23 para sánguches y hamburguesas; guía sin fecha, sin precio por ítem",
        "source_url": "https://howtoperu.com/?p=3550"
      }
    ]
  },
  "rec:la-mar": {
    "key": "rec:la-mar",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta oficial de La Mar Lima (PDF 'La Mar 2026', actualizado en agosto de 2026) y de su carta de bebidas oficial; incluyen impuestos y recargo al consumo.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Cebiche clásico de pejerrey",
        "price": 69.0,
        "category": "fondo",
        "note": "Pesca de temporada S/ 86; pesca de lujo S/ 94",
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Cebiche clásico pesca de temporada",
        "price": 86.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Cebiche mixto",
        "price": 86.0,
        "category": "fondo",
        "note": "Pescado de temporada, pulpo y langostinos",
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Cebiche Tumbes (conchas negras)",
        "price": 69.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Trío de cebiches",
        "price": 139.0,
        "category": "fondo",
        "note": "Clásico, Nikkei y Mantaro",
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Tiradito criollo al ají amarillo (pesca de temporada)",
        "price": 79.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Causa limeña de pollo",
        "price": 49.0,
        "category": "entrada",
        "note": "De cangrejo S/ 78",
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "La Leche de Tigre (copa)",
        "price": 36.0,
        "category": "entrada",
        "note": "Copón S/ 56",
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Conchas de Paracas a la chalaca (unidad)",
        "price": 18.0,
        "category": "entrada",
        "note": "Precio por unidad",
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Chicharrón de pesca de temporada",
        "price": 89.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "La jalea La Mar para compartir",
        "price": 138.0,
        "category": "fondo",
        "note": "Para compartir",
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "El chaufa aeropuerto",
        "price": 79.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Arroz con mariscos",
        "price": 89.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "El saltado criollo de lomo fino",
        "price": 79.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Picarones",
        "price": 24.0,
        "category": "postre",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Suspiro a la limeña",
        "price": 27.0,
        "category": "postre",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-carta.pdf"
      },
      {
        "name": "Limonada",
        "price": 10.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-Bebidas.pdf"
      },
      {
        "name": "Chicha morada",
        "price": 12.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-Bebidas.pdf"
      },
      {
        "name": "Inca Kola / Coca Cola",
        "price": 8.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-Bebidas.pdf"
      },
      {
        "name": "Pisco sour",
        "price": 42.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-Bebidas.pdf"
      },
      {
        "name": "Cusqueña / Pilsen",
        "price": 15.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://lamarcebicheria.com/cartas/peru/LMR-PERU-Bebidas.pdf"
      }
    ]
  },
  "rec:la-picanteria": {
    "key": "rec:la-picanteria",
    "found": true,
    "confidence": "baja",
    "summary": "No hay carta con precios en línea: el pescado del día se vende por kilo según una pizarra que cambia a diario. El único precio concreto es el vino por copa 'desde 20 soles' de un artículo de Gestión de mayo de 2024; no se encontraron precios de platos fiables.",
    "source_date": "2024",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Vino por copa",
        "price": 20.0,
        "category": "bebida",
        "note": "Precio mínimo ('con precios desde los 20 soles'); otras copas cuestan más",
        "source_url": "https://gestion.pe/tendencias/estilos/la-picanteria-el-lugar-donde-la-mesa-siempre-es-una-fiesta-surquillo-pesca-del-dia-carta-de-vinos-g-de-gestion-noticia/"
      }
    ]
  },
  "rec:madam-tusan": {
    "key": "rec:madam-tusan",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta de salón oficial de Madam Tusan (PDF 'SALON_CARTA_MT_2026_v2' enlazado desde madamtusan.com.pe, editado en julio-agosto de 2026). Es la carta general de la cadena, no específica del local de Miraflores.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Wantán Frito (6 unidades)",
        "price": 20.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Siu Mai (4 unidades)",
        "price": 22.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Ha Kao (4 unidades)",
        "price": 23.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Fiesta al Vapor",
        "price": 42.0,
        "category": "entrada",
        "note": "Surtido de 8 piezas al vapor",
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Sopa Wantán",
        "price": 32.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Chaufa de Pollo",
        "price": 28.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Chaufa Samsi",
        "price": 32.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Aeropuerto de pollo saltado",
        "price": 34.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Pollo Chijaukay",
        "price": 43.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Pollo Tipakay",
        "price": 43.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Chancho con Piña",
        "price": 49.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Tallarín saltado de pollo y verduras",
        "price": 44.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Lomito Fino al Ajo y Tausí a la Plancha",
        "price": 68.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Banquete Clásico para 4",
        "price": 190.0,
        "category": "fondo",
        "note": "Para 4 personas; no aplica descuentos",
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Soufflé de Chocolate",
        "price": 26.0,
        "category": "postre",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Copa de Lychee",
        "price": 22.0,
        "category": "postre",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Gaseosa (Coca Cola, Inca Kola, etc.)",
        "price": 8.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Limonada clásica",
        "price": 10.0,
        "category": "bebida",
        "note": "Frozen, natural o mineral",
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Pisco Sour",
        "price": 28.0,
        "category": "bebida",
        "note": "Clásico o de maracuyá",
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      },
      {
        "name": "Cerveza Cusqueña",
        "price": 16.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://delosi-pidelo.s3.amazonaws.com/madam-tusan/carta/SALON_CARTA_MT_2026_v2.pdf"
      }
    ]
  },
  "rec:maido": {
    "key": "rec:maido",
    "found": true,
    "confidence": "alta",
    "summary": "Precios oficiales publicados en maido.pe (Experiencia Maido de 12 pasos, por persona, incluyen impuestos y recargo al consumo). Solo hay menú degustación, no carta. El precio de cada maridaje se obtiene restando el menú sin maridaje del total publicado.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Experiencia Maido (menú degustación 12 pasos) sin maridaje",
        "price": 1295.0,
        "category": "fondo",
        "note": "Por persona",
        "source_url": "https://www.maido.pe/"
      },
      {
        "name": "Maridaje Maido (vinos del Nuevo Mundo y sake)",
        "price": 690.0,
        "category": "bebida",
        "note": "Diferencia entre 'Con Maridaje Maido' S/ 1985 y 'Sin Maridaje' S/ 1295 por persona",
        "source_url": "https://www.maido.pe/"
      },
      {
        "name": "Maridaje Tokujou (vinos del Viejo Mundo y sake)",
        "price": 1230.0,
        "category": "bebida",
        "note": "Diferencia entre 'Con Maridaje Tokujou' S/ 2525 y 'Sin Maridaje' S/ 1295 por persona",
        "source_url": "https://www.maido.pe/"
      },
      {
        "name": "Maridaje sin alcohol (frutas nativas y tés)",
        "price": 364.0,
        "category": "bebida",
        "note": "Diferencia entre 'Con Maridaje sin alcohol' S/ 1659 y 'Sin Maridaje' S/ 1295 por persona",
        "source_url": "https://www.maido.pe/"
      }
    ]
  },
  "rec:mayta": {
    "key": "rec:mayta",
    "found": true,
    "confidence": "alta",
    "summary": "Precios oficiales de maytalima.com.pe: la página del menú degustación (2026) y la carta a la carta en PDF de febrero de 2026, con impuestos y recargo al consumo incluidos. La web no muestra precios de bebidas sueltas (solo maridajes).",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Bitácora Amazónica (menú degustación, 10 pasos)",
        "price": 998.0,
        "category": "fondo",
        "note": "Por persona; la página pone '998' sin indicar moneda, pero los maridajes están en PEN",
        "source_url": "https://maytalima.com.pe/carta/"
      },
      {
        "name": "Maridaje Añadas Especiales",
        "price": 740.0,
        "category": "bebida",
        "note": "Adicional al menú degustación",
        "source_url": "https://maytalima.com.pe/carta/"
      },
      {
        "name": "Maridaje Viñedos únicos",
        "price": 685.0,
        "category": "bebida",
        "note": "Adicional al menú degustación",
        "source_url": "https://maytalima.com.pe/carta/"
      },
      {
        "name": "Maridaje sin alcohol",
        "price": 345.0,
        "category": "bebida",
        "note": "Adicional al menú degustación",
        "source_url": "https://maytalima.com.pe/carta/"
      },
      {
        "name": "Ceviche Amazónico",
        "price": 84.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Tarta de Cebollas",
        "price": 59.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Ostras de Chimbote",
        "price": 39.0,
        "category": "entrada",
        "note": "Precio por unidad",
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Pulpo Tostado",
        "price": 79.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Corazones a la Brasa",
        "price": 69.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Langostinos Melcocha",
        "price": 74.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Pasta Rellena",
        "price": 79.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Arroz con Langostinos",
        "price": 99.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Paiche a la Brasa",
        "price": 98.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Lomo & Langostinos",
        "price": 99.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Cuy",
        "price": 99.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Sartén de Pato",
        "price": 299.0,
        "category": "fondo",
        "note": "Plato grande para compartir",
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Cacao",
        "price": 49.0,
        "category": "postre",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      },
      {
        "name": "Chirimoya & Lúcuma",
        "price": 48.0,
        "category": "postre",
        "note": null,
        "source_url": "https://maytalima.com.pe/wp-content/uploads/2026/02/CARTA-MAYTA-ESP-Feb26.pdf"
      }
    ]
  },
  "rec:merito": {
    "key": "rec:merito",
    "found": true,
    "confidence": "baja",
    "summary": "No hay precios oficiales publicados (la web y Mesa247 no los muestran). Lo único en soles es un rango de platos de una nota de Caretas de junio de 2025; el menú degustación solo aparece estimado en dólares (US$ 125) y se omitió.",
    "source_date": "2025",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Platos individuales",
        "price": 160.0,
        "category": "fondo",
        "note": "Rango S/ 55–160 'dependiendo del día', según Caretas (junio 2025)",
        "source_url": "https://caretas.pe/?p=755267"
      }
    ]
  },
  "rec:museo-del-pisco": {
    "key": "rec:museo-del-pisco",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta oficial de cócteles 2026 (PDF de oct. 2026) y de la carta de comida 2025 en museodelpisco.org, comunes a las sedes de Lima, Cusco y Arequipa. Ojo: la web oficial ubica ahora el local de Lima en Jr. Junín 201, no en Carabaya 193.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Pisco Sour",
        "price": 34.0,
        "category": "bebida",
        "note": "pisco Demonio de los Andes; +S/2 con pisco infusionado",
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Chilcano",
        "price": 32.0,
        "category": "bebida",
        "note": "+S/2 con pisco infusionado",
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Pisco Tonic",
        "price": 32.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Copa / Shot de pisco",
        "price": 24.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Chabuca",
        "price": 38.0,
        "category": "bebida",
        "note": "cóctel regional de Lima",
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Doña Lucha",
        "price": 38.0,
        "category": "bebida",
        "note": "clásico del Museo",
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Jose Antonio",
        "price": 34.0,
        "category": "bebida",
        "note": "clásico del Museo",
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Pisco Tasting",
        "price": 56.0,
        "category": "bebida",
        "note": "experiencia de cata",
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Pisco Sour Making",
        "price": 54.0,
        "category": "bebida",
        "note": "experiencia: prepara tu pisco sour",
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Museo Experience",
        "price": 160.0,
        "category": "bebida",
        "note": "seis cócteles en tamaño medio; maridaje de tapas +S/60",
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Fresquito (sin alcohol)",
        "price": 22.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2026/10/carta-cocteles-2026.pdf"
      },
      {
        "name": "Wings Criollas",
        "price": 30.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2025/06/menu_spanishMuseo2025.pdf"
      },
      {
        "name": "Anticuchos",
        "price": 38.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2025/06/menu_spanishMuseo2025.pdf"
      },
      {
        "name": "Museo Burgers",
        "price": 38.0,
        "category": "entrada",
        "note": "tres sliders",
        "source_url": "https://museodelpisco.org/wp-content/uploads/2025/06/menu_spanishMuseo2025.pdf"
      },
      {
        "name": "Tortilla Andina",
        "price": 28.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2025/06/menu_spanishMuseo2025.pdf"
      },
      {
        "name": "Piqueo de Museo",
        "price": 100.0,
        "category": "entrada",
        "note": "combo para compartir",
        "source_url": "https://museodelpisco.org/wp-content/uploads/2025/06/menu_spanishMuseo2025.pdf"
      },
      {
        "name": "Ceviche Nikkei",
        "price": 38.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2025/06/menu_spanishMuseo2025.pdf"
      },
      {
        "name": "Tiradito Limeño",
        "price": 38.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2025/06/menu_spanishMuseo2025.pdf"
      },
      {
        "name": "Lomo Saltado Barrio Chino",
        "price": 68.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2025/06/menu_spanishMuseo2025.pdf"
      },
      {
        "name": "Chumpi Chaufa",
        "price": 38.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2025/06/menu_spanishMuseo2025.pdf"
      },
      {
        "name": "El Famoso Veggie Burger",
        "price": 36.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://museodelpisco.org/wp-content/uploads/2025/06/menu_spanishMuseo2025.pdf"
      }
    ]
  },
  "rec:osaka": {
    "key": "rec:osaka",
    "found": true,
    "confidence": "media",
    "summary": "Precios de la carta 'To Go' de Osaka Lima en su web oficial (osakanikkei.com); la página no muestra símbolo de moneda ni fecha y puede diferir de la carta en salón. La carta de salón (Nikkei Bar) no publica precios.",
    "source_date": null,
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Ceviche Wasabi",
        "price": 68.0,
        "category": "entrada",
        "note": "Carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Ceviche Osaka",
        "price": 66.0,
        "category": "entrada",
        "note": "Carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Tiradito Perú",
        "price": 65.0,
        "category": "entrada",
        "note": "Carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Nikkei Salad",
        "price": 40.0,
        "category": "entrada",
        "note": "Carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Inca Gyoza",
        "price": 68.0,
        "category": "entrada",
        "note": "Carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Tumbo Shrimp",
        "price": 54.0,
        "category": "entrada",
        "note": "Carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Nigiri clásico de salmón (4 piezas)",
        "price": 54.0,
        "category": "fondo",
        "note": "Sashimi S/ 47 / nigiri S/ 54; carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "OSK Style Nigiri Inca (4 piezas)",
        "price": 58.0,
        "category": "fondo",
        "note": "Carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Makimono Nikkei",
        "price": 54.0,
        "category": "fondo",
        "note": "Dos tamaños: S/ 34 / S/ 54; carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Makimono Tuna Tartare",
        "price": 54.0,
        "category": "fondo",
        "note": "Dos tamaños: S/ 32 / S/ 54; carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Makimono Veggie Truffle",
        "price": 43.0,
        "category": "fondo",
        "note": "Dos tamaños: S/ 26 / S/ 43; carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "OSK Wok",
        "price": 72.0,
        "category": "fondo",
        "note": "S/ 58 (pollo, cerdo, langostino) o S/ 72 (lomo); carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Shiromi Brasa",
        "price": 98.0,
        "category": "fondo",
        "note": "Carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Pato Mochero",
        "price": 130.0,
        "category": "fondo",
        "note": "Carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Asado Gyūdon",
        "price": 190.0,
        "category": "fondo",
        "note": "Carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Makimono Especial (Osaka Pack)",
        "price": 265.0,
        "category": "otro",
        "note": "Pack para compartir; carta To Go",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Coca Cola / Zero",
        "price": 12.0,
        "category": "bebida",
        "note": "Inca Kola / Zero también S/ 12",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Agua Andea sin gas",
        "price": 14.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Cusqueña Dorada",
        "price": 18.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      },
      {
        "name": "Asahi",
        "price": 39.0,
        "category": "bebida",
        "note": "Cerveza japonesa",
        "source_url": "https://osakanikkei.com/es/lima-es/to-go-es/"
      }
    ]
  },
  "rec:pan-de-la-chola": {
    "key": "rec:pan-de-la-chola",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la tienda online oficial (elpandelachola.com), consultada en nov. 2026: panes, croissants y pastelería para llevar. No hay carta en línea del café con sánguches o bebidas.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Croissant",
        "price": 8.0,
        "category": "otro",
        "note": "precio de la tienda online (para llevar)",
        "source_url": "https://elpandelachola.com/categoria-producto/croissant-pasteleria/"
      },
      {
        "name": "Croissant con Almendras",
        "price": 14.0,
        "category": "otro",
        "note": "precio de la tienda online (para llevar)",
        "source_url": "https://elpandelachola.com/categoria-producto/croissant-pasteleria/"
      },
      {
        "name": "Pain au Chocolat",
        "price": 10.0,
        "category": "otro",
        "note": "precio de la tienda online (para llevar)",
        "source_url": "https://elpandelachola.com/categoria-producto/croissant-pasteleria/"
      },
      {
        "name": "Morning Bun",
        "price": 12.0,
        "category": "otro",
        "note": "precio de la tienda online (para llevar)",
        "source_url": "https://elpandelachola.com/categoria-producto/croissant-pasteleria/"
      },
      {
        "name": "Kion Twist",
        "price": 9.0,
        "category": "otro",
        "note": "precio de la tienda online (para llevar)",
        "source_url": "https://elpandelachola.com/categoria-producto/croissant-pasteleria/"
      },
      {
        "name": "Tartaleta de Pera",
        "price": 11.0,
        "category": "postre",
        "note": "precio de la tienda online (para llevar)",
        "source_url": "https://elpandelachola.com/categoria-producto/croissant-pasteleria/"
      },
      {
        "name": "Bizcocho de Manzana",
        "price": 60.0,
        "category": "postre",
        "note": "entero; tienda online",
        "source_url": "https://elpandelachola.com/categoria-producto/croissant-pasteleria/"
      },
      {
        "name": "Pan de la Chola – 700gr.",
        "price": 16.0,
        "category": "otro",
        "note": "pan entero; tienda online",
        "source_url": "https://elpandelachola.com/categoria-producto/panaderia/"
      },
      {
        "name": "Campesino de Semillas – 735gr.",
        "price": 18.0,
        "category": "otro",
        "note": "pan entero; tienda online",
        "source_url": "https://elpandelachola.com/categoria-producto/panaderia/"
      },
      {
        "name": "Focaccia",
        "price": 12.0,
        "category": "otro",
        "note": "tienda online",
        "source_url": "https://elpandelachola.com/categoria-producto/panaderia/"
      },
      {
        "name": "Pan de Pasas y Pecanas – 700gr.",
        "price": 22.0,
        "category": "otro",
        "note": "pan entero; tienda online",
        "source_url": "https://elpandelachola.com/categoria-producto/panaderia/"
      },
      {
        "name": "Baguette – 300gr.",
        "price": 10.0,
        "category": "otro",
        "note": "tienda online",
        "source_url": "https://elpandelachola.com/categoria-producto/panaderia/"
      },
      {
        "name": "Brioche – 430gr.",
        "price": 24.0,
        "category": "otro",
        "note": "tienda online",
        "source_url": "https://elpandelachola.com/categoria-producto/panaderia/"
      }
    ]
  },
  "rec:panchita": {
    "key": "rec:panchita",
    "found": true,
    "confidence": "alta",
    "summary": "Carta oficial en PDF de panchita.pe (archivos actualizados en octubre 2026); los precios incluyen impuestos y recargo al consumo.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Empanadas Panchita",
        "price": 19.0,
        "category": "entrada",
        "note": "De pastel de choclo o rocoto relleno",
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Tamalito verde",
        "price": 22.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Papa a la huancaína",
        "price": 34.0,
        "category": "entrada",
        "note": "Porción para compartir",
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Papa rellena",
        "price": 34.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Tequeños Panchita",
        "price": 39.0,
        "category": "entrada",
        "note": "5 unidades",
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Causa limeña de pollo",
        "price": 43.0,
        "category": "entrada",
        "note": "De langostinos: S/56",
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Cebiche limeño de pesca del día",
        "price": 68.0,
        "category": "entrada",
        "note": "Mixto S/78, corvina S/88",
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Anticuchos de corazón de res",
        "price": 58.0,
        "category": "entrada",
        "note": "De la parrilla",
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Pan con chicharrón",
        "price": 38.0,
        "category": "fondo",
        "note": "Sánguche",
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Sanguche de lomito",
        "price": 46.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Ají de gallina",
        "price": 49.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Suprema Panchita",
        "price": 59.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Arroz Panchita",
        "price": 59.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Seco limeño de asado de tira",
        "price": 78.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Arroz con pato",
        "price": 88.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.panchita.pe/static/b33e67a3a275c0d2e19cb9e085489443/PCH_Web_Platos_compressed.pdf"
      },
      {
        "name": "Suspiro a la limeña",
        "price": 26.0,
        "category": "postre",
        "note": "Porción grande; chica S/18",
        "source_url": "https://www.panchita.pe/static/6f5eb0b2af377fbd62216b49a7576b7f/PCH_Web_Postres.pdf"
      },
      {
        "name": "Picarones",
        "price": 24.0,
        "category": "postre",
        "note": null,
        "source_url": "https://www.panchita.pe/static/6f5eb0b2af377fbd62216b49a7576b7f/PCH_Web_Postres.pdf"
      },
      {
        "name": "Crema volteada",
        "price": 24.0,
        "category": "postre",
        "note": null,
        "source_url": "https://www.panchita.pe/static/6f5eb0b2af377fbd62216b49a7576b7f/PCH_Web_Postres.pdf"
      },
      {
        "name": "Chicha morada",
        "price": 12.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.panchita.pe/static/163f30edd4db4d97c64a8603eb890f27/PCH_Web_Bebidas_compressed.pdf"
      },
      {
        "name": "Limonada",
        "price": 10.0,
        "category": "bebida",
        "note": "Clásica, hierba luisa o hierbabuena",
        "source_url": "https://www.panchita.pe/static/163f30edd4db4d97c64a8603eb890f27/PCH_Web_Bebidas_compressed.pdf"
      },
      {
        "name": "Gaseosas",
        "price": 8.0,
        "category": "bebida",
        "note": "Inca Kola, Coca Cola, Sprite, Fanta",
        "source_url": "https://www.panchita.pe/static/163f30edd4db4d97c64a8603eb890f27/PCH_Web_Bebidas_compressed.pdf"
      },
      {
        "name": "Agua San Luis",
        "price": 7.5,
        "category": "bebida",
        "note": "Con o sin gas",
        "source_url": "https://www.panchita.pe/static/163f30edd4db4d97c64a8603eb890f27/PCH_Web_Bebidas_compressed.pdf"
      },
      {
        "name": "Pisco sour clásico",
        "price": 46.0,
        "category": "bebida",
        "note": "Catedral: S/58",
        "source_url": "https://www.panchita.pe/static/163f30edd4db4d97c64a8603eb890f27/PCH_Web_Bebidas_compressed.pdf"
      },
      {
        "name": "Chilcano",
        "price": 39.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.panchita.pe/static/163f30edd4db4d97c64a8603eb890f27/PCH_Web_Bebidas_compressed.pdf"
      },
      {
        "name": "Cerveza (Pilsen, Cusqueña)",
        "price": 15.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.panchita.pe/static/163f30edd4db4d97c64a8603eb890f27/PCH_Web_Bebidas_compressed.pdf"
      }
    ]
  },
  "rec:pardos": {
    "key": "rec:pardos",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la tienda online oficial pardoschicken.pe (2026). La web indica que esos precios aplican a delivery y para llevar por canales propios; en salón (Benavides) podrían variar.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "1/4 Pardos Brasa Para Mí",
        "price": 36.9,
        "category": "fondo",
        "note": "1/4 de pollo, papas fritas, ensalada y bebida personal; precio delivery/llevar",
        "source_url": "https://www.pardoschicken.pe/categorias/promociones-169"
      },
      {
        "name": "1/4 Pardos Parrillero Original Para Mí",
        "price": 38.9,
        "category": "fondo",
        "note": "Con papas, ensalada y bebida personal; precio delivery/llevar",
        "source_url": "https://www.pardoschicken.pe/categorias/promociones-169"
      },
      {
        "name": "Promoción Para 2",
        "price": 58.9,
        "category": "fondo",
        "note": "1/2 Pardos Brasa + papas + ensalada regular + 2 bebidas personales; precio delivery/llevar",
        "source_url": "https://www.pardoschicken.pe/categorias/promociones-169"
      },
      {
        "name": "1 Pardos Brasa",
        "price": 62.5,
        "category": "fondo",
        "note": "Pollo entero solo; precio delivery/llevar",
        "source_url": "https://www.pardoschicken.pe/categorias/pardos-brasa-166"
      },
      {
        "name": "1 Pardos Brasa con Papas y Ensalada Regular",
        "price": 88.9,
        "category": "fondo",
        "note": "Precio delivery/llevar",
        "source_url": "https://www.pardoschicken.pe/categorias/pardos-brasa-166"
      },
      {
        "name": "Chicharrón de Pollo (Fondo)",
        "price": 36.9,
        "category": "fondo",
        "note": "Con 1 guarnición y 1 complemento; precio delivery/llevar",
        "source_url": "https://www.pardoschicken.pe/categorias/chicharrones-159"
      },
      {
        "name": "Anticuchos de Corazón (Fondo)",
        "price": 33.9,
        "category": "fondo",
        "note": "Con 1 guarnición y 1 complemento; precio delivery/llevar",
        "source_url": "https://www.pardoschicken.pe/categorias/anticuchos-y-mollejitas-155"
      },
      {
        "name": "Piqueo Anticuchos",
        "price": 20.9,
        "category": "entrada",
        "note": "1 palo de anticucho con choclo y papa dorada",
        "source_url": "https://www.pardoschicken.pe/categorias/anticuchos-y-mollejitas-155"
      },
      {
        "name": "Palo de Anticucho",
        "price": 13.9,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.pardoschicken.pe/categorias/anticuchos-y-mollejitas-155"
      },
      {
        "name": "Papas fritas personales",
        "price": 11.9,
        "category": "otro",
        "note": null,
        "source_url": "https://www.pardoschicken.pe/categorias/guarniciones-164"
      },
      {
        "name": "Ensalada Cocida Regular",
        "price": 20.9,
        "category": "otro",
        "note": null,
        "source_url": "https://www.pardoschicken.pe/categorias/ensaladas-162"
      },
      {
        "name": "Porción Cheesecake de fresa",
        "price": 17.9,
        "category": "postre",
        "note": null,
        "source_url": "https://www.pardoschicken.pe/categorias/postres-168"
      },
      {
        "name": "Porción Torta de chocolate",
        "price": 17.9,
        "category": "postre",
        "note": null,
        "source_url": "https://www.pardoschicken.pe/categorias/postres-168"
      },
      {
        "name": "Botella Chicha 500ml",
        "price": 8.9,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.pardoschicken.pe/categorias/bebidas-156"
      },
      {
        "name": "Botella Chicha 1.5 Lt",
        "price": 17.9,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.pardoschicken.pe/categorias/bebidas-156"
      }
    ]
  },
  "rec:pescados-capitales": {
    "key": "rec:pescados-capitales",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la Carta Salón y la Carta Bar oficiales, enlazadas desde pescadoscapitales.com/carta (PDFs de noviembre de 2025, vigentes en la web en 2026).",
    "source_date": "2025",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Wantanes Capitales",
        "price": 39.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Tartare de salmón",
        "price": 38.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Pulpo al olivo",
        "price": 59.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Conchitas a la parmesana",
        "price": 56.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Causa de langostinos",
        "price": 57.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Cebiche clásico (pesca del día)",
        "price": 60.0,
        "category": "fondo",
        "note": "Pesca selección S/ 86",
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Cebiche mixto (pesca del día)",
        "price": 69.0,
        "category": "fondo",
        "note": "Pesca selección S/ 82",
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Cebiche nikkei",
        "price": 65.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "La Trinidad (trío de cebiches)",
        "price": 90.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Tiradito clásico (pesca del día)",
        "price": 53.0,
        "category": "fondo",
        "note": "Pesca selección S/ 74",
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Chicharrón de calamar",
        "price": 69.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Jalea Capital",
        "price": 81.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Arroz con mariscos",
        "price": 69.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Chaufa de mariscos",
        "price": 65.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Lomo saltado",
        "price": 59.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Ají de gallina",
        "price": 48.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Suspiro a la limeña",
        "price": 28.0,
        "category": "postre",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Picarones Capitales",
        "price": 28.0,
        "category": "postre",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1tPKpnTFGhvd_eDd4I_owaI53-wV9feYs/view"
      },
      {
        "name": "Chicha morada",
        "price": 12.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1T1qc-p5oB5zGvEmFJj40JAcE1crtspxv/view"
      },
      {
        "name": "Limonadas",
        "price": 10.0,
        "category": "bebida",
        "note": "Clásica, hierba luisa, hierba buena",
        "source_url": "https://drive.google.com/file/d/1T1qc-p5oB5zGvEmFJj40JAcE1crtspxv/view"
      },
      {
        "name": "Inca Kola / Coca Cola",
        "price": 10.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1T1qc-p5oB5zGvEmFJj40JAcE1crtspxv/view"
      },
      {
        "name": "Jugos",
        "price": 12.0,
        "category": "bebida",
        "note": "Maracuyá, fresa, piña, naranja y camu camu",
        "source_url": "https://drive.google.com/file/d/1T1qc-p5oB5zGvEmFJj40JAcE1crtspxv/view"
      },
      {
        "name": "Sour doble",
        "price": 35.0,
        "category": "bebida",
        "note": "Sección 'Los Sours' (clásico y sabores); Siete S/ 42, Catedral S/ 59",
        "source_url": "https://drive.google.com/file/d/1T1qc-p5oB5zGvEmFJj40JAcE1crtspxv/view"
      },
      {
        "name": "Chilcano regular",
        "price": 32.0,
        "category": "bebida",
        "note": "Mosto verde S/ 42",
        "source_url": "https://drive.google.com/file/d/1T1qc-p5oB5zGvEmFJj40JAcE1crtspxv/view"
      },
      {
        "name": "Cusqueña",
        "price": 15.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://drive.google.com/file/d/1T1qc-p5oB5zGvEmFJj40JAcE1crtspxv/view"
      }
    ]
  },
  "rec:punto-azul": {
    "key": "rec:punto-azul",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta de día publicada en la web oficial de Punto Azul (puntoazulrestaurante.com, página actualizada en mayo de 2026); es la carta general de la cadena, que incluye el local de San Martín 595 en Miraflores.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Leche de tigre",
        "price": 38.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Conchitas a la parmesana (1/2 docena)",
        "price": 37.0,
        "category": "entrada",
        "note": "Docena S/ 63",
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Pulpo al olivo",
        "price": 57.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Wantán de pescado (1/2 docena)",
        "price": 25.0,
        "category": "entrada",
        "note": "Docena S/ 41",
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Causa de langostinos",
        "price": 38.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Causa acevichada",
        "price": 54.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Ceviche de pescado",
        "price": 52.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Ceviche mixto",
        "price": 54.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Ceviche Punto Azul",
        "price": 55.0,
        "category": "fondo",
        "note": "De pescado o mixto en salsa de rocoto",
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Tiraditos",
        "price": 49.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Chicharrón mixto",
        "price": 61.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Arroz con mariscos",
        "price": 54.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Chaufa de mariscos",
        "price": 51.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Pescado a lo macho",
        "price": 62.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Lomo saltado",
        "price": 55.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Parihuela",
        "price": 55.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Crema volteada",
        "price": 26.0,
        "category": "postre",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Suspiro limeño",
        "price": 26.0,
        "category": "postre",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Coca Cola / Inca Kola 1/2 Lt",
        "price": 9.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Jarra de chicha",
        "price": 23.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Jarra limonada",
        "price": 23.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Cuzqueña",
        "price": 15.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      },
      {
        "name": "Mojito Criollo Tropical",
        "price": 23.0,
        "category": "bebida",
        "note": "Cóctel de pisco",
        "source_url": "https://puntoazulrestaurante.com/carta-dia/"
      }
    ]
  },
  "rec:quattro-d": {
    "key": "rec:quattro-d",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la web oficial de pedidos de Cafeladería 4D (4d.pe/pedir), consultada en nov. 2026; son precios de delivery/para llevar y podrían diferir de los del salón de Angamos.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Helado Cioccolato",
        "price": 26.0,
        "category": "postre",
        "note": "web de pedidos/delivery; no indica tamaño",
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Helado Fior di Panna",
        "price": 26.0,
        "category": "postre",
        "note": "web de pedidos/delivery; no indica tamaño",
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Doppiozero Lúcuma",
        "price": 30.0,
        "category": "postre",
        "note": "web de pedidos/delivery; no indica tamaño",
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Pack Gelato Compartir 1/2 Litro",
        "price": 63.0,
        "category": "postre",
        "note": "medio litro",
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Gelato de cuchara Tiramisú",
        "price": 23.9,
        "category": "postre",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Gelato de cuchara Duetto",
        "price": 32.9,
        "category": "postre",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Milkshake de Gelato o Sorbeto",
        "price": 26.9,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Sandwich 4d",
        "price": 42.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Club Sandwich",
        "price": 46.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Mantova",
        "price": 33.0,
        "category": "fondo",
        "note": "sándwich",
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Planchadito Italiano",
        "price": 36.9,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Lomo Saltado",
        "price": 62.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Ensalada Cesar de Pollo",
        "price": 35.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Desayuno americano",
        "price": 35.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Empanada de Carne de Res",
        "price": 17.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Torta de Chocolate (porción)",
        "price": 32.0,
        "category": "postre",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Pie de Limón (porción)",
        "price": 18.0,
        "category": "postre",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Café Americano",
        "price": 10.9,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Café Capuccino",
        "price": 15.9,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Jugo de Frutas 100% Natural",
        "price": 13.9,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      },
      {
        "name": "Vaso de Limonada",
        "price": 11.9,
        "category": "bebida",
        "note": null,
        "source_url": "https://www.4d.pe/pedir"
      }
    ]
  },
  "rec:rincon-que-no-conoces": {
    "key": "rec:rincon-que-no-conoces",
    "found": true,
    "confidence": "baja",
    "summary": "Precios de una nota de El Comercio de enero de 2018; no se encontró carta oficial ni fuente reciente, así que probablemente hayan subido.",
    "source_date": "2018",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Tamalito de choclo",
        "price": 12.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://elcomercio.pe/somos/receta-sazon-siempre-rincon-conoces-noticia-489280-noticia/"
      },
      {
        "name": "Papa rellena",
        "price": 15.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://elcomercio.pe/somos/receta-sazon-siempre-rincon-conoces-noticia-489280-noticia/"
      },
      {
        "name": "Frejoles con asado",
        "price": 37.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://elcomercio.pe/somos/receta-sazon-siempre-rincon-conoces-noticia-489280-noticia/"
      },
      {
        "name": "Arroz con pato (pierna)",
        "price": 36.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://elcomercio.pe/somos/receta-sazon-siempre-rincon-conoces-noticia-489280-noticia/"
      },
      {
        "name": "Arroz con pato (pecho)",
        "price": 38.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://elcomercio.pe/somos/receta-sazon-siempre-rincon-conoces-noticia-489280-noticia/"
      },
      {
        "name": "Tacu tacu con seco de cabrito",
        "price": 47.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://elcomercio.pe/somos/receta-sazon-siempre-rincon-conoces-noticia-489280-noticia/"
      },
      {
        "name": "Buffet criollo",
        "price": 69.5,
        "category": "otro",
        "note": "Incluye carapulcra, frejoles, cau cau, olluquito y sangrecita",
        "source_url": "https://elcomercio.pe/somos/receta-sazon-siempre-rincon-conoces-noticia-489280-noticia/"
      }
    ]
  },
  "rec:san-antonio": {
    "key": "rec:san-antonio",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta digital oficial (pasteleriasanantonio.com/carta-digital), consultada en nov. 2026; es la carta de delivery de la cadena y podría diferir algo de la del local.",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Triple Tricolor (Pan Miga Blanco)",
        "price": 16.5,
        "category": "fondo",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/"
      },
      {
        "name": "Butifarra San Antonio (Pan Cristal)",
        "price": 23.5,
        "category": "fondo",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/"
      },
      {
        "name": "Chicharrón San Antonio (Pan Cristal)",
        "price": 23.9,
        "category": "fondo",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/"
      },
      {
        "name": "Pollo Especial (A la Plancha)",
        "price": 23.9,
        "category": "fondo",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/"
      },
      {
        "name": "Bowl Mila",
        "price": 29.5,
        "category": "fondo",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/"
      },
      {
        "name": "Tamal de Pollo",
        "price": 11.9,
        "category": "entrada",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/"
      },
      {
        "name": "Humita Verde con Pollo",
        "price": 10.5,
        "category": "entrada",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/"
      },
      {
        "name": "Empanada Especial de Carne",
        "price": 12.5,
        "category": "entrada",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/"
      },
      {
        "name": "Quiche de Alcachofa",
        "price": 14.9,
        "category": "entrada",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/"
      },
      {
        "name": "Waffles con Helado",
        "price": 27.9,
        "category": "postre",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/"
      },
      {
        "name": "Cheesecake Horneado de Fresas (porción)",
        "price": 13.9,
        "category": "postre",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/categoria-producto/postres/en-porcion/"
      },
      {
        "name": "Crema Volteada",
        "price": 14.9,
        "category": "postre",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/categoria-producto/postres/en-porcion/"
      },
      {
        "name": "Bismarck",
        "price": 14.9,
        "category": "postre",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/categoria-producto/postres/en-porcion/"
      },
      {
        "name": "Alfajor Tradicional",
        "price": 9.9,
        "category": "postre",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/categoria-producto/postres/en-porcion/"
      },
      {
        "name": "Americano",
        "price": 8.5,
        "category": "bebida",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/categoria-producto/bebidas-calientes/"
      },
      {
        "name": "Capuccino",
        "price": 9.9,
        "category": "bebida",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/categoria-producto/bebidas-calientes/"
      },
      {
        "name": "Chocolate Caliente",
        "price": 13.5,
        "category": "bebida",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/categoria-producto/bebidas-calientes/"
      },
      {
        "name": "Jugo de Mango",
        "price": 13.9,
        "category": "bebida",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/categoria-producto/bebida-frias/"
      },
      {
        "name": "Limonada",
        "price": 11.5,
        "category": "bebida",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/categoria-producto/bebida-frias/"
      },
      {
        "name": "Chicha Morada",
        "price": 11.5,
        "category": "bebida",
        "note": null,
        "source_url": "https://pasteleriasanantonio.com/carta-digital/categoria-producto/bebida-frias/"
      }
    ]
  },
  "rec:senorio-de-sulco": {
    "key": "rec:senorio-de-sulco",
    "found": true,
    "confidence": "alta",
    "summary": "Precios de la carta oficial en PDF publicada en senoriodesulco.com: platos y postres (PDF de mayo 2025) y bebidas/cócteles (PDF de abril 2026).",
    "source_date": "2026",
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Causa limeña con pollo",
        "price": 38.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Papa a la huancaína",
        "price": 28.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Cebiche de pescado",
        "price": 55.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Anticuchos de corazón",
        "price": 34.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Papa rellena",
        "price": 29.0,
        "category": "entrada",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Sopa a la criolla",
        "price": 38.0,
        "category": "entrada",
        "note": "Sopa",
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Piqueo Señorío de Sulco",
        "price": 99.0,
        "category": "entrada",
        "note": "Piqueo para compartir",
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Ají de gallina",
        "price": 46.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Lomo saltado",
        "price": 59.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Huatia sulcana",
        "price": 60.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Arroz con pato norteño",
        "price": 60.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Arroz con mariscos",
        "price": 56.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Lechoncito horneado al pisco",
        "price": 95.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Chupe de camarones",
        "price": 72.0,
        "category": "fondo",
        "note": "Sopa",
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Pechuga de pollo a la plancha",
        "price": 39.0,
        "category": "fondo",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/platos-es.pdf"
      },
      {
        "name": "Picarones",
        "price": 22.0,
        "category": "postre",
        "note": "4 aros",
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/postres-es.pdf"
      },
      {
        "name": "Suspiro de limeña",
        "price": 23.0,
        "category": "postre",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/postres-es.pdf"
      },
      {
        "name": "Mazamorra morada",
        "price": 19.0,
        "category": "postre",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/postres-es.pdf"
      },
      {
        "name": "Chicha morada",
        "price": 10.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/cocteles.pdf"
      },
      {
        "name": "Limonada clásica",
        "price": 10.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/cocteles.pdf"
      },
      {
        "name": "Inca Kola, Coca Cola",
        "price": 8.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/cocteles.pdf"
      },
      {
        "name": "Jugo de piña y naranja",
        "price": 16.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/cocteles.pdf"
      },
      {
        "name": "Pisco sour",
        "price": 36.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/cocteles.pdf"
      },
      {
        "name": "Chilcano clásico",
        "price": 34.0,
        "category": "bebida",
        "note": null,
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/cocteles.pdf"
      },
      {
        "name": "Cuzqueña",
        "price": 13.0,
        "category": "bebida",
        "note": "Dorada, trigo, negra",
        "source_url": "https://api.senoriodesulco.com/storage/menu-restaurant/cocteles.pdf"
      }
    ]
  },
  "rec:wa-lok": {
    "key": "rec:wa-lok",
    "found": true,
    "confidence": "baja",
    "summary": "Solo dos precios, de una guía de viajes brasileña (Melhores Destinos) sin fecha, que se refiere al local de Wa Lok en Av. Angamos Oeste 700 (Miraflores), no al de Jr. Paruro. No se encontró carta oficial ni delivery con precios, así que pueden estar desactualizados.",
    "source_date": null,
    "searched_at": "2026-11-05T12:00:00-05:00",
    "items": [
      {
        "name": "Pato pekinés",
        "price": 53.0,
        "category": "fondo",
        "note": "Guía sin fecha; local de Angamos Oeste (Miraflores)",
        "source_url": "https://guia.melhoresdestinos.com.br/wa-lok-lima-101-1812-l.html"
      },
      {
        "name": "Langostinos a la plancha",
        "price": 61.0,
        "category": "fondo",
        "note": "Guía sin fecha; local de Angamos Oeste (Miraflores)",
        "source_url": "https://guia.melhoresdestinos.com.br/wa-lok-lima-101-1812-l.html"
      }
    ]
  }
}
