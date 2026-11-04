// ============================================================
// DATOS DEL CATÁLOGO XTECH
// Este archivo contiene únicamente la información de los productos.
// Se utiliza un array (lista) llamado productos.
// Cada objeto representa un producto y tiene estas propiedades:
// id: identificador único.
// nombre: nombre que se muestra en la tarjeta.
// categoria: grupo al que pertenece y que usan los filtros.
// descripcion: características principales.
// precio: valor numérico del producto.
// moneda: moneda del precio (USD o ARS).
// imagen: ruta de la fotografía del producto.
// stock: unidades disponibles.
// Los datos están separados de app.js para organizar mejor el proyecto.
// ============================================================
const productos = [
  // Cada bloque entre llaves {} representa un producto del catálogo.
  {
    id: 1,
    nombre: "PC AMD Ryzen 7 5700X",
    categoria: "PC Gamer",
    descripcion: "RTX 4060 Ti · 16 GB RAM DDR4 3200 MHz · SSD NVMe 1 TB · Gabinete RGB + fuente 650W",
    precio: 1215,
    moneda: "USD",
    imagen: "PC ARMADAS/PC1.png",
    stock: 5
  },
  {
    id: 2,
    nombre: "PC AMD Ryzen 5 4600G",
    categoria: "PC Gamer",
    descripcion: "RTX 2060 Ti · 16 GB RAM DDR4 3200 MHz · SSD NVMe 1 TB · Gabinete + fuente 650W",
    precio: 1146,
    moneda: "USD",
    imagen: "PC ARMADAS/pc2.png",
    stock: 8
  },
  {
    id: 3,
    nombre: "PC AMD Ryzen 7 7700X",
    categoria: "PC Gamer",
    descripcion: "RTX 4060 Ti · 32 GB RAM DDR4 3200 MHz · SSD NVMe 1 TB · Gabinete RGB + fuente 650W",
    precio: 1365,
    moneda: "USD",
    imagen: "PC ARMADAS/pc3.png",
    stock: 4
  },
  {
    id: 4,
    nombre: "Logitech G502 HERO / G502 X",
    categoria: "Mouse",
    descripcion: "26.000 DPI · 11 zonas RGB personalizables · Sensor óptico · Diseño ergonómico",
    precio: 120,
    moneda: "USD",
    imagen: "mouse/mouse1.png",
    stock: 10
  },
  {
    id: 5,
    nombre: "Logitech G502 HERO",
    categoria: "Mouse",
    descripcion: "16.000 DPI · Sensor óptico HERO 25K · 11 botones programables · Pesos ajustables",
    precio: 80,
    moneda: "USD",
    imagen: "mouse/mouse2.png",
    stock: 12
  },
  {
    id: 6,
    nombre: "Logitech G203 LIGHTSYNC",
    categoria: "Mouse",
    descripcion: "8.000 DPI · Luces RGB LIGHTSYNC · 6 botones programables · Diseño compacto",
    precio: 40,
    moneda: "USD",
    imagen: "mouse/mouse3.png",
    stock: 15
  },
  {
    id: 7,
    nombre: "Logitech G PRO X TKL",
    categoria: "Teclados",
    descripcion: "Teclado mecánico · Switches Logitech G · Iluminación RGB · USB / inalámbrico",
    precio: 199.99,
    moneda: "USD",
    imagen: "teclado/teclado1.png",
    stock: 7
  },
  {
    id: 8,
    nombre: "Razer BlackWidow V3",
    categoria: "Teclados",
    descripcion: "Teclado mecánico Tenkeyless · Switches Razer · Iluminación RGB",
    precio: 99.99,
    moneda: "USD",
    imagen: "teclado/teclado2.png",
    stock: 9
  },
  {
    id: 9,
    nombre: "SteelSeries Apex Pro TKL",
    categoria: "Teclados",
    descripcion: "Teclado mecánico · Switches SteelSeries · Iluminación RGB",
    precio: 249.99,
    moneda: "USD",
    imagen: "teclado/teclado3.png",
    stock: 5
  },
  {
    id: 10,
    nombre: "Arkham Gaming 25 pulgadas",
    categoria: "Monitores",
    descripcion: "Full HD 1920x1080 · Panel IPS · 200 Hz · HDMI y DisplayPort",
    precio: 255599,
    moneda: "ARS",
    imagen: "monitores/monitor-25-arkham-gaming-200hz-1-removebg-preview.png",
    stock: 6
  },
  {
    id: 11,
    nombre: "Gigabyte GS25F2",
    categoria: "Monitores",
    descripcion: "Full HD 1920x1080 · Panel IPS · 200 Hz · FreeSync Premium",
    precio: 220499,
    moneda: "ARS",
    imagen: "monitores/69879-producto-1-removebg-preview.png",
    stock: 8
  },
  {
    id: 12,
    nombre: "Samsung Odyssey G3 24 pulgadas",
    categoria: "Monitores",
    descripcion: "Full HD 1920x1080 · Panel VA · 165 Hz · FreeSync y G-Sync Compatible",
    precio: 189999,
    moneda: "ARS",
    imagen: "monitores/D_Q_NP_2X_819342-MLA83755565125_042025-E-removebg-preview.png",
    stock: 10
  }
];
