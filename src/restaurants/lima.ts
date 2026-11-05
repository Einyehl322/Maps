/**
 * Guía de Lima: sitios reales, no ejemplos inventados.
 *
 * Las coordenadas se resolvieron contra OpenStreetMap (Nominatim) local por local.
 * Cuando OSM no tiene el punto exacto del negocio, el pin cae sobre su calle y el
 * sitio queda marcado con `approx`: la ficha lo avisa en vez de fingir precisión.
 *
 * Los precios son orientativos por persona (soles) y cambian; la carta manda.
 */

import type { PriceLevel } from './price'

export type RecCategory =
  | 'cevicheria'
  | 'sanguche'
  | 'pasta'
  | 'criollo'
  | 'nikkei'
  | 'chifa'
  | 'pollo'
  | 'anticucho'
  | 'alta-cocina'
  | 'cafe'
  | 'bar'
  | 'mercado'

export const REC_CATEGORIES: {
  id: RecCategory
  label: string
  /** Etiqueta corta que se guarda en el campo "cocina" del restaurante. */
  cuisine: string
  emoji: string
}[] = [
  { id: 'cevicheria', label: 'Cevicherías', cuisine: 'Cevichería', emoji: '🐟' },
  { id: 'sanguche', label: 'Sangucherías', cuisine: 'Sanguchería', emoji: '🥪' },
  { id: 'criollo', label: 'Criollo', cuisine: 'Criolla', emoji: '🍲' },
  { id: 'pasta', label: 'Pastas y pizza', cuisine: 'Italiana', emoji: '🍝' },
  { id: 'nikkei', label: 'Nikkei', cuisine: 'Nikkei', emoji: '🍣' },
  { id: 'chifa', label: 'Chifa', cuisine: 'Chifa', emoji: '🥡' },
  { id: 'pollo', label: 'Pollo a la brasa', cuisine: 'Pollería', emoji: '🍗' },
  { id: 'anticucho', label: 'Anticuchos y carnes', cuisine: 'Parrilla', emoji: '🔥' },
  { id: 'alta-cocina', label: 'Alta cocina', cuisine: 'Alta cocina', emoji: '⭐' },
  { id: 'cafe', label: 'Café y dulce', cuisine: 'Cafetería', emoji: '☕' },
  { id: 'bar', label: 'Bares y pisco', cuisine: 'Bar', emoji: '🍸' },
  { id: 'mercado', label: 'Mercados', cuisine: 'Mercado', emoji: '🧺' },
]

export type Recommendation = {
  /** Slug estable: sirve para saber si ya lo tienes guardado. */
  id: string
  name: string
  category: RecCategory
  district: string
  address: string
  lng: number
  lat: number
  /** El pin cae en la calle, no en la puerta: OSM no tiene el local. */
  approx?: boolean
  /** 1 = barato · 2 = medio · 3 = caro · 4 = menú degustación. */
  price: PriceLevel
  /** Por qué merece la pena. */
  about: string
  /** Qué pedir. */
  dishes: string[]
}

// Los rangos de precio se comparten con los lugares guardados.
export { PRICE_LABELS, priceMark } from './price'

/** Centro de Lima metropolitana (Plaza San Martín, más o menos). */
export const LIMA_CENTER: [number, number] = [-77.0345, -12.0553]

export const LIMA_RECOMMENDATIONS: Recommendation[] = [
  // ---------- Cevicherías y marisquerías ----------
  {
    id: 'la-mar',
    name: 'La Mar Cebichería',
    category: 'cevicheria',
    district: 'Miraflores',
    address: 'Av. Mariscal La Mar 770',
    lng: -77.04535,
    lat: -12.11339,
    price: 3,
    about:
      'La cevichería de Gastón Acurio y la puerta de entrada más fácil al pescado limeño. Solo mediodía y no toman reserva: se llega temprano o se espera con un chilcano.',
    dishes: ['Cebiche clásico', 'Leche de tigre', 'Causa de pulpo', 'Chicharrón de pescado'],
  },
  {
    id: 'chez-wong',
    name: 'Chez Wong',
    category: 'cevicheria',
    district: 'La Victoria',
    address: 'Enrique León García 114',
    lng: -77.02247,
    lat: -12.08197,
    price: 3,
    about:
      'El comedor de Javier Wong: sin carta, sin letrero, un lenguado que filetea delante de ti en una plancha. Solo almuerzo y hay que reservar por teléfono.',
    dishes: ['Cebiche de lenguado', 'Lenguado saltado'],
  },
  {
    id: 'al-toke-pez',
    name: 'Al Toke Pez',
    category: 'cevicheria',
    district: 'Surquillo',
    address: 'Av. Angamos Este 886',
    lng: -77.02262,
    lat: -12.11339,
    price: 1,
    about:
      'Barra de diez taburetes en plena avenida donde Tomás Matsufuji, doctor en química, cocina uno de los platos más baratos y mejores de Lima. Cola desde antes de abrir.',
    dishes: ['Combinado (cebiche + chaufa + tallarín saltado)', 'Jalea', 'Leche de tigre'],
  },
  {
    id: 'canta-rana',
    name: 'Canta Rana',
    category: 'cevicheria',
    district: 'Barranco',
    address: 'Pasaje Génova 101',
    lng: -77.02232,
    lat: -12.14676,
    price: 2,
    about:
      'Clásico barranquino desde 1980, con las paredes forradas de banderines de fútbol. Nada moderno, todo correcto.',
    dishes: ['Cebiche mixto', 'Chicharrón de calamar', 'Arroz con mariscos'],
  },
  {
    id: 'sonia',
    name: 'Restaurante Sonia',
    category: 'cevicheria',
    district: 'Chorrillos',
    address: 'Av. Agustín Lozano La Rosa',
    lng: -77.03112,
    lat: -12.16815,
    price: 2,
    about:
      'Casa de familia a dos calles del muelle de pescadores de Chorrillos: el pescado entra por la mañana y se acaba a media tarde.',
    dishes: ['Cebiche de la casa', 'Chupe de camarones', 'Parihuela'],
  },
  {
    id: 'el-mercado',
    name: 'El Mercado',
    category: 'cevicheria',
    district: 'Miraflores',
    address: 'Av. Hipólito Unanue 203',
    lng: -77.04866,
    lat: -12.11138,
    price: 3,
    about:
      'El patio marino de Rafael Osterling, bajo toldo y con luz de mediodía. Solo almuerzo, ambiente ruidoso y alegre.',
    dishes: ['Cebiche del día', 'Tiradito', 'Arroz con mariscos'],
  },
  {
    id: 'pescados-capitales',
    name: 'Pescados Capitales',
    category: 'cevicheria',
    district: 'Miraflores',
    address: 'Av. Mariscal La Mar 1337',
    lng: -77.04971,
    lat: -12.10943,
    price: 2,
    about:
      'Carta construida sobre el chiste de los pecados capitales, terraza amplia y raciones generosas. Buen sitio para ir en grupo.',
    dishes: ['Cebiche', 'Tiradito', 'Arroz meloso de mariscos'],
  },
  {
    id: 'punto-azul',
    name: 'Punto Azul',
    category: 'cevicheria',
    district: 'Miraflores',
    address: 'Calle San Martín 595',
    lng: -77.02818,
    lat: -12.12637,
    price: 2,
    about:
      'Porciones descomunales a precio de barrio: media ración suele bastar para dos. Cola a la puerta los fines de semana.',
    dishes: ['Cebiche', 'Chicharrón de pescado', 'Arroz con mariscos'],
  },
  {
    id: 'la-picanteria',
    name: 'La Picantería',
    category: 'cevicheria',
    district: 'Surquillo',
    address: 'Jr. Francisco Moreno 388',
    lng: -77.02377,
    lat: -12.11679,
    price: 2,
    about:
      'Picantería norteña de Héctor Solís: eliges el pescado entero por peso y decides cómo lo preparan. Mesas compartidas y chicha de jora en jarra.',
    dishes: ['Pescado entero a la parrilla', 'Sudado', 'Arroz con pato', 'Chicha de jora'],
  },
  {
    id: 'la-red',
    name: 'Cevichería La Red',
    category: 'cevicheria',
    district: 'Miraflores',
    address: 'Av. La Mar 391',
    lng: -77.04454,
    lat: -12.11445,
    approx: true,
    price: 2,
    about:
      'De las veteranas de la avenida La Mar, anterior al boom gastronómico. Cocina marina sin adornos.',
    dishes: ['Cebiche', 'Jalea mixta', 'Sudado de mero'],
  },

  // ---------- Sangucherías ----------
  {
    id: 'el-chinito',
    name: 'El Chinito',
    category: 'sanguche',
    district: 'Cercado de Lima',
    address: 'Jr. Chancay 894',
    lng: -77.04082,
    lat: -12.04922,
    price: 1,
    about:
      'Chicharronería desde 1960 y la vara de medir del pan con chicharrón: cerdo, camote frito y salsa criolla. Desayuno de domingo por antonomasia.',
    dishes: ['Pan con chicharrón', 'Pan con pavo', 'Tamal'],
  },
  {
    id: 'la-lucha',
    name: 'La Lucha Sanguchería',
    category: 'sanguche',
    district: 'Miraflores',
    address: 'Av. Diagonal 308 (Parque Kennedy)',
    lng: -77.03029,
    lat: -12.12076,
    price: 1,
    about:
      'Abre hasta la madrugada junto al Parque Kennedy. Papas nativas fritas y jugos naturales al lado del sánguche.',
    dishes: ['Butifarra', 'Pan con chicharrón', 'Papas nativas', 'Jugo de maracuyá'],
  },
  {
    id: 'el-cordano',
    name: 'Bar Cordano',
    category: 'sanguche',
    district: 'Cercado de Lima',
    address: 'Jr. Áncash 202',
    lng: -77.02892,
    lat: -12.0449,
    price: 1,
    about:
      'Abierto en 1905 frente al Palacio de Gobierno, con las mismas estanterías de madera y camareros de chaqueta. Historia del centro con butifarra.',
    dishes: ['Butifarra', 'Sánguche de jamón del país', 'Pisco sour'],
  },
  {
    id: 'juanito',
    name: 'Juanito de Barranco',
    category: 'sanguche',
    district: 'Barranco',
    address: 'Av. Almirante Miguel Grau 270',
    lng: -77.02068,
    lat: -12.14952,
    price: 1,
    about:
      'Bodega-bar de 1937 en la plaza de Barranco. Se pide en la barra, se bebe de pie y el jamón del país se corta a la vista.',
    dishes: ['Sánguche de jamón del país', 'Butifarra', 'Chilcano'],
  },

  // ---------- Pastas y pizza ----------
  {
    id: 'mambrino',
    name: 'La Trattoria di Mambrino',
    category: 'pasta',
    district: 'Santiago de Surco',
    address: 'Av. Javier Prado Este 4200 (Jockey Plaza)',
    lng: -76.97697,
    lat: -12.08573,
    price: 3,
    about:
      'La casa de Sandra Plevisani: pasta fresca del día y una carta de postres que es media razón para venir.',
    dishes: ['Pasta fresca del día', 'Ravioles', 'Postres de la casa'],
  },
  {
    id: 'bodega-trattoria',
    name: 'La Bodega de la Trattoria',
    category: 'pasta',
    district: 'Miraflores',
    address: 'Av. Armendáriz 299',
    lng: -77.02786,
    lat: -12.13288,
    price: 2,
    about:
      'Italiano de barrio fiable, con horno de leña y salón grande. Funciona igual de bien para una cena tranquila que para llevar a la familia.',
    dishes: ['Pastas caseras', 'Pizza al horno de leña', 'Lasaña'],
  },
  {
    id: 'antica-trattoria',
    name: 'Antica Trattoria',
    category: 'pasta',
    district: 'Barranco',
    address: 'Av. San Martín 201',
    lng: -77.02415,
    lat: -12.13785,
    approx: true,
    price: 2,
    about:
      'Casona barranquina con velas y ladrillo visto, de las italianas más antiguas de la zona. Sitio de cena de sábado.',
    dishes: ['Pastas rellenas', 'Pizzas', 'Tiramisú'],
  },
  {
    id: 'il-postino',
    name: 'Il Postino',
    category: 'pasta',
    district: 'Miraflores',
    address: 'Calle Narciso de la Colina 401',
    lng: -77.02664,
    lat: -12.11822,
    price: 2,
    about:
      'Trattoria pequeña y sin pretensiones en una esquina residencial. Carta corta, pasta hecha en casa.',
    dishes: ['Fettuccine caseros', 'Ravioles', 'Osobuco'],
  },

  // ---------- Criollo y tradicional ----------
  {
    id: 'isolina',
    name: 'Isolina Taberna Peruana',
    category: 'criollo',
    district: 'Barranco',
    address: 'Av. Prolongación San Martín 101',
    lng: -77.02238,
    lat: -12.14764,
    price: 2,
    about:
      'José del Castillo rescata la comida de casa limeña en raciones enormes servidas en fuente para compartir. La carta llega escrita a mano en un papel.',
    dishes: ['Cau cau de mondonguito', 'Tallarín rojo con asado', 'Ají de gallina', 'Escabeche'],
  },
  {
    id: 'panchita',
    name: 'Panchita',
    category: 'criollo',
    district: 'Miraflores',
    address: 'Calle Dos de Mayo 298',
    lng: -77.0312,
    lat: -12.11776,
    price: 2,
    about:
      'La criollería de Acurio: parrilla de anticuchos a la entrada, tamales, y un recorrido cómodo por los clásicos peruanos.',
    dishes: ['Anticuchos', 'Tamalito verde', 'Seco de res', 'Causa'],
  },
  {
    id: 'rincon-que-no-conoces',
    name: 'El Rincón que no Conoces',
    category: 'criollo',
    district: 'Lince',
    address: 'Jr. Bernardo Alcedo 363',
    lng: -77.02893,
    lat: -12.08384,
    approx: true,
    price: 2,
    about:
      'La cocina que dejó Teresa Izquierdo, referencia de la comida criolla más tradicional. Solo mediodía y en un barrio sin turistas.',
    dishes: ['Carapulcra con sopa seca', 'Seco de cabrito', 'Arroz con pato'],
  },
  {
    id: 'el-bolivariano',
    name: 'El Bolivariano',
    category: 'criollo',
    district: 'Pueblo Libre',
    address: 'Pasaje Santa Rosa 291',
    lng: -77.06388,
    lat: -12.07678,
    price: 2,
    about:
      'Casona republicana con patio, a un paso del Museo Larco. El bufé criollo de domingo es una institución familiar.',
    dishes: ['Bufé criollo (domingos)', 'Chicharrón', 'Chilcano de pisco'],
  },
  {
    id: 'museo-larco-cafe',
    name: 'Museo Larco Café Restaurant',
    category: 'criollo',
    district: 'Pueblo Libre',
    address: 'Av. Simón Bolívar 1515',
    lng: -77.07076,
    lat: -12.07227,
    price: 3,
    about:
      'El restaurante del Museo Larco, en una terraza entre los jardines de buganvillas del museo. Cocina peruana; perfecto para comer después de la visita.',
    dishes: ['Cocina peruana de la carta', 'Postres', 'Pisco sour'],
  },
  {
    id: 'huaca-pucllana',
    name: 'Huaca Pucllana',
    category: 'criollo',
    district: 'Miraflores',
    address: 'Calle General Borgoño cuadra 8',
    lng: -77.03304,
    lat: -12.11106,
    price: 3,
    about:
      'La terraza da a la pirámide preinca iluminada de noche: se viene tanto por la vista como por el plato. Conviene reservar mesa exterior.',
    dishes: ['Lomo saltado', 'Cordero al horno', 'Suspiro limeño'],
  },

  // ---------- Nikkei ----------
  {
    id: 'maido',
    name: 'Maido',
    category: 'nikkei',
    district: 'Miraflores',
    address: 'Calle San Martín 399',
    lng: -77.03061,
    lat: -12.12539,
    price: 4,
    about:
      'Mitsuharu Tsumura lleva dos décadas afinando el cruce entre Japón y la costa peruana. Fue número 1 de The World’s 50 Best en 2025: se reserva con mucha antelación.',
    dishes: ['Menú Nikkei Experience', 'Nigiris del día', 'Rabo de 50 horas'],
  },
  {
    id: 'osaka',
    name: 'Osaka',
    category: 'nikkei',
    district: 'San Isidro',
    address: 'Av. Pardo y Aliaga 660',
    lng: -77.03872,
    lat: -12.10604,
    price: 3,
    about:
      'Nikkei de salón oscuro y coctelería seria, con barra de sushi a la vista. Va bien para cena larga.',
    dishes: ['Tiraditos', 'Nigiris flameados', 'Tataki de atún'],
  },
  {
    id: 'hanzo',
    name: 'Hanzo',
    category: 'nikkei',
    district: 'San Isidro',
    address: 'Av. Los Conquistadores 598',
    lng: -77.03696,
    lat: -12.10187,
    price: 3,
    about:
      'Japonés-peruano de ejecución fina y ambiente de after office en pleno San Isidro financiero.',
    dishes: ['Tiradito nikkei', 'Rolls', 'Gyozas'],
  },

  // ---------- Chifa ----------
  {
    id: 'chifa-titi',
    name: 'Chifa Titi',
    category: 'chifa',
    district: 'San Isidro',
    address: 'Av. Javier Prado Este 1210',
    lng: -77.01574,
    lat: -12.0902,
    price: 3,
    about:
      'Chifa de manteles y servicio antiguo, abierto desde 1958. El chifa "de ocasión" de las familias limeñas.',
    dishes: ['Pato pekinés', 'Langostinos con kion', 'Arroz chaufa'],
  },
  {
    id: 'wa-lok',
    name: 'Chifa Wa Lok',
    category: 'chifa',
    district: 'Barrio Chino',
    address: 'Jr. Paruro 878',
    lng: -77.02512,
    lat: -12.0521,
    price: 2,
    about:
      'En pleno Barrio Chino, con carritos de dim sum al mediodía. Salón enorme y carta interminable.',
    dishes: ['Dim sum', 'Chancho asado', 'Sopa wantán'],
  },
  {
    id: 'madam-tusan',
    name: 'Madam Tusan',
    category: 'chifa',
    district: 'Miraflores',
    address: 'Av. Santa Cruz 859',
    lng: -77.03751,
    lat: -12.11145,
    price: 2,
    about:
      'La versión de Acurio del chifa: más colorida y ordenada que las del centro, cómoda si vas con niños.',
    dishes: ['Wantán frito', 'Arroz chaufa', 'Pato crocante'],
  },

  // ---------- Pollo a la brasa ----------
  {
    id: 'la-granja-azul',
    name: 'La Granja Azul',
    category: 'pollo',
    district: 'Ate',
    address: 'Antigua Carretera Central, Santa Clara',
    lng: -76.89053,
    lat: -12.01644,
    approx: true,
    price: 2,
    about:
      'Donde nació el pollo a la brasa a finales de los años 40. Está lejos, en Santa Clara, y el pollo es a discreción: se va en plan excursión.',
    dishes: ['Pollo a la brasa a discreción', 'Papas fritas', 'Ensalada'],
  },
  {
    id: 'pardos',
    name: 'Pardos Chicken',
    category: 'pollo',
    district: 'Miraflores',
    address: 'Av. Alfredo Benavides 730',
    lng: -77.02554,
    lat: -12.12542,
    price: 2,
    about:
      'La cadena de brasa más fiable de Lima. No es descubrimiento, pero resuelve una cena cualquiera con buenas cremas y anticuchos.',
    dishes: ['Pollo a la brasa', 'Anticuchos', 'Ají de gallina'],
  },

  // ---------- Anticuchos y carnes ----------
  {
    id: 'grimanesa',
    name: 'Anticuchos de la Tía Grimanesa',
    category: 'anticucho',
    district: 'Miraflores',
    address: 'Av. Tudela y Varela 466',
    lng: -77.04574,
    lat: -12.11356,
    price: 1,
    about:
      'Grimanesa Vargas empezó con una carretilla en los años 70 y acabó en local propio sin cambiar el punto del corazón. Se hace cola de pie.',
    dishes: ['Anticuchos de corazón', 'Rachi', 'Pan con anticucho'],
  },
  {
    id: 'osso',
    name: 'Osso Carnicería y Salumería',
    category: 'anticucho',
    district: 'La Molina',
    address: 'Calle Tahití 175',
    lng: -76.9174,
    lat: -12.07646,
    price: 3,
    about:
      'Renzo Garibaldi madura la carne en casa y la vende en la misma sala donde la come. Carnicería, charcutería y mesa, todo en uno.',
    dishes: ['Cortes madurados', 'Hamburguesa de la casa', 'Tabla de charcutería'],
  },

  // ---------- Alta cocina ----------
  {
    id: 'central',
    name: 'Central',
    category: 'alta-cocina',
    district: 'Barranco',
    address: 'Av. Pedro de Osma 301',
    lng: -77.02254,
    lat: -12.15257,
    price: 4,
    about:
      'Virgilio Martínez ordena el menú por altitudes del Perú, del fondo del mar a los 4.000 metros. Fue número 1 de The World’s 50 Best en 2023; la reserva se abre con meses de antelación.',
    dishes: ['Menú degustación por ecosistemas', 'Maridaje de bebidas nativas'],
  },
  {
    id: 'kjolle',
    name: 'Kjolle',
    category: 'alta-cocina',
    district: 'Barranco',
    address: 'Av. Pedro de Osma 301 (misma casa que Central)',
    lng: -77.02254,
    lat: -12.15257,
    approx: true,
    price: 4,
    about:
      'La casa de Pía León, en el mismo edificio que Central pero más luminosa y menos ceremoniosa. Producto peruano llevado al color.',
    dishes: ['Menú degustación', 'Platos de tubérculos andinos'],
  },
  {
    id: 'mayta',
    name: 'Mayta',
    category: 'alta-cocina',
    district: 'Miraflores',
    address: 'Av. Mariscal La Mar 1285',
    lng: -77.04924,
    lat: -12.10986,
    price: 4,
    about:
      'Jaime Pesaque trabaja producto amazónico y andino con técnica precisa. Entre los mejores de Latinoamérica sin la lista de espera de Central.',
    dishes: ['Menú degustación', 'Cebiche de conchas', 'Cocina amazónica'],
  },
  {
    id: 'merito',
    name: 'Mérito',
    category: 'alta-cocina',
    district: 'Barranco',
    address: 'Jr. 28 de Julio 206',
    lng: -77.02127,
    lat: -12.15078,
    approx: true,
    price: 3,
    about:
      'Local minúsculo de Juan Luis Martínez, con carta corta que cambia y raíces venezolanas sobre producto peruano. Informal y de los más difíciles de reservar.',
    dishes: ['Carta corta del día', 'Vegetales al carbón', 'Postres de cacao'],
  },
  {
    id: 'astrid-y-gaston',
    name: 'Astrid y Gastón',
    category: 'alta-cocina',
    district: 'San Isidro',
    address: 'Casa Moreyra, Av. Paz Soldán 290',
    lng: -77.03508,
    lat: -12.09644,
    price: 4,
    about:
      'El restaurante que arrancó el boom, hoy en una hacienda del siglo XVII con huerto propio. Tiene menú degustación y carta más asequible en la barra.',
    dishes: ['Menú degustación', 'Cuy pekinés', 'Causa'],
  },
  {
    id: 'rafael',
    name: 'Rafael',
    category: 'alta-cocina',
    district: 'Miraflores',
    address: 'Calle San Martín 300',
    lng: -77.03137,
    lat: -12.12531,
    price: 3,
    about:
      'Rafael Osterling en su sala de siempre: cocina peruana con acento mediterráneo, servicio pulido y sin discurso de menú largo.',
    dishes: ['Pulpo al olivo', 'Tiradito', 'Arroz con pato'],
  },

  // ---------- Café y dulce ----------
  {
    id: 'pan-de-la-chola',
    name: 'El Pan de la Chola',
    category: 'cafe',
    district: 'Miraflores',
    address: 'Av. Mariscal La Mar 918',
    lng: -77.04649,
    lat: -12.11233,
    price: 2,
    about:
      'Panadería de masa madre y café de origen peruano; el desayuno más buscado de la zona. Local pequeño y siempre lleno.',
    dishes: ['Pan de masa madre', 'Huevos con palta', 'Café filtrado'],
  },
  {
    id: 'bisetti',
    name: 'Tostaduría Bisetti',
    category: 'cafe',
    district: 'Barranco',
    address: 'Av. Pedro de Osma 116',
    lng: -77.02187,
    lat: -12.14995,
    price: 1,
    about:
      'Tostadero histórico de Barranco reconvertido en cafetería de especialidad. Tuestan allí mismo cafés de fincas peruanas.',
    dishes: ['Filtrado de origen', 'Cortado', 'Alfajores'],
  },
  {
    id: 'san-antonio',
    name: 'Pastelería San Antonio',
    category: 'cafe',
    district: 'Miraflores',
    address: 'Av. Vasco Núñez de Balboa 770',
    lng: -77.02396,
    lat: -12.12966,
    price: 1,
    about:
      'Pastelería-cafetería limeña de toda la vida: vitrina larga, empanadas y tarta de chocolate. Sitio de merienda con la familia.',
    dishes: ['Empanadas', 'Torta de chocolate', 'Alfajores'],
  },
  {
    id: 'quattro-d',
    name: 'Heladería 4D',
    category: 'cafe',
    district: 'Miraflores',
    address: 'Av. Angamos Oeste 408',
    lng: -77.03257,
    lat: -12.1136,
    price: 1,
    about:
      'Heladería italiana clásica de Miraflores, abierta desde los años 80. Los sabores peruanos (lúcuma, chirimoya) son los que hay que pedir.',
    dishes: ['Helado de lúcuma', 'Helado de chirimoya', 'Copa con merengue'],
  },
  {
    id: 'puku-puku',
    name: 'Puku Puku Café',
    category: 'cafe',
    district: 'Miraflores',
    address: 'Junto al Parque Reducto (varias sedes en Lima)',
    lng: -77.03129,
    lat: -12.13151,
    price: 1,
    about:
      'Café de especialidad peruano con varias sedes pequeñas; buena parada rápida para un filtrado decente sin desviarte.',
    dishes: ['Filtrado del día', 'Flat white', 'Bollería'],
  },

  // ---------- Bares y pisco ----------
  {
    id: 'carnaval',
    name: 'Carnaval',
    category: 'bar',
    district: 'San Isidro',
    address: 'Av. Pardo y Aliaga',
    lng: -77.03877,
    lat: -12.10589,
    price: 3,
    about:
      'La coctelería de Aarón Díaz, habitual en las listas de mejores bares del mundo. Tragos de autor con insumos peruanos y bastante teatro.',
    dishes: ['Coctelería de autor', 'Pisco sour de la casa'],
  },
  {
    id: 'museo-del-pisco',
    name: 'Museo del Pisco',
    category: 'bar',
    district: 'Cercado de Lima',
    address: 'Jr. Carabaya 193 (Centro Histórico)',
    lng: -77.02957,
    lat: -12.04577,
    price: 2,
    about:
      'Bar-escuela dedicado al pisco: catas por uva y explicación de cada trago. La parada obvia después de ver el centro.',
    dishes: ['Pisco sour', 'Chilcano', 'Cata de piscos por uva'],
  },

  // ---------- Mercados ----------
  {
    id: 'mercado-surquillo',
    name: 'Mercado de Surquillo',
    category: 'mercado',
    district: 'Surquillo',
    address: 'Jr. Leonardo Barbieri 742',
    lng: -77.02408,
    lat: -12.11071,
    price: 1,
    about:
      'El mercado al que van los cocineros de Miraflores, cruzando la Vía Expresa. Frutas amazónicas, ajíes, quesos y puestos donde comen los del barrio.',
    dishes: ['Puestos de cebiche', 'Frutas amazónicas', 'Jugos'],
  },
  {
    id: 'mercado-central',
    name: 'Mercado Central de Lima',
    category: 'mercado',
    district: 'Cercado de Lima',
    address: 'Jr. Cusco, junto al Barrio Chino',
    lng: -77.02757,
    lat: -12.05268,
    price: 1,
    about:
      'Mercado histórico pegado al Barrio Chino: caos, puestos de comida y la mejor forma de entender la despensa limeña. Ojo con las carteras.',
    dishes: ['Caldo de gallina', 'Jugos surtidos', 'Puestos de chifa'],
  },
]

export function categoryOf(id: RecCategory) {
  return REC_CATEGORIES.find((item) => item.id === id) ?? REC_CATEGORIES[0]
}
