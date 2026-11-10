// ============================================================
// CATÁLOGO DE PRODUCTOS
// filter() selecciona los productos que cumplen las condiciones.
// map() transforma cada producto en una tarjeta HTML.
// Las comillas invertidas permiten usar template strings e insertar
// valores con ${...} dentro del HTML.
// ============================================================
import { productos } from "./datos.js";
import { formatearMoneda } from "./ui.js";
import { agregarAlCarrito } from "./carrito.js";
import { esFavorito, toggleFavorito } from "./favoritos.js";

const contenedorProductos = document.querySelector("#contenedor-productos");
const contenedorFiltros = document.querySelector("#contenedor-filtros");
const inputSearch = document.querySelector("#input-search");

// Variables que recuerdan qué categoría y qué texto se están buscando.
let filtroActual = "todos";
let busquedaActual = "";

// Tiempo de espera (en milisegundos) antes de buscar, después de la última tecla.
const RETRASO_BUSQUEDA = 300;
// Guarda el identificador del temporizador pendiente para poder cancelarlo.
let temporizadorBusqueda;

// Dibuja nuevamente las tarjetas cuando cambia la búsqueda,
// la categoría o el estado de favoritos.
export function renderizarCatalogo() {
  // Primero comprobamos si cada producto pertenece a la categoría elegida
  // y si su nombre o descripción contiene el texto buscado.
  const productosFiltrados = productos.filter(producto => {
    const coincideCategoria = filtroActual === "todos" || producto.categoria === filtroActual;
    const texto = busquedaActual.toLowerCase();
    const coincideBusqueda = producto.nombre.toLowerCase().includes(texto) ||
      producto.descripcion.toLowerCase().includes(texto);
    return coincideCategoria && coincideBusqueda;
  });

  // Si no hay coincidencias, limpiamos las tarjetas y mostramos
  // un mensaje para avisar que no se encontraron productos.
  if (productosFiltrados.length === 0) {
    contenedorProductos.innerHTML = "";
    document.querySelector("#empty-catalog-state").hidden = false;
    return;
  }

  document.querySelector("#empty-catalog-state").hidden = true;

  // Generamos una tarjeta HTML por cada producto filtrado.
  // esFavorito() permite saber si el producto ya está en favoritos.
  contenedorProductos.innerHTML = productosFiltrados.map(producto => {
    const marcado = esFavorito(producto.id);
    return `
      <article class="producto-card">
        <div class="imagen-producto">
          <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
          <span class="categoria-producto">${producto.categoria}</span>
          <button type="button" class="btn-fav-card ${marcado ? "es-favorito" : ""}"
            data-action="fav" data-id="${producto.id}" aria-label="Agregar a favoritos">
            ${marcado ? "♥" : "♡"}
          </button>
        </div>
        <div class="contenido-card">
          <h3>${producto.nombre}</h3>
          <p class="descripcion-producto">${producto.descripcion}</p>
          <div class="datos-producto">
            <strong>${formatearMoneda(producto.precio, producto.moneda)}</strong>
            <span>Stock: ${producto.stock}</span>
          </div>
          <button type="button" class="btn-agregar" data-action="add-cart" data-id="${producto.id}">
            🛒 Agregar al carrito
          </button>
        </div>
      </article>
    `;
  }).join("");
}

// Conecta los eventos del catálogo: clics en tarjetas, filtros y buscador.
export function iniciarProductos() {
  // DELEGACIÓN DE EVENTOS EN EL CATÁLOGO:
  // En vez de crear un listener para cada botón, escuchamos los clics
  // en el contenedor general. closest() encuentra el botón correspondiente
  // incluso si el usuario toca el texto o el ícono que está dentro del botón.
  contenedorProductos.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-action]");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.action;

    if (accion === "add-cart") agregarAlCarrito(id);
    if (accion === "fav") toggleFavorito(id);
  });

  // Cuando se toca un filtro, actualizamos la categoría activa,
  // cambiamos el estilo del botón seleccionado y volvemos a dibujar el catálogo.
  contenedorFiltros.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-category]");
    if (!boton) return;

    filtroActual = boton.dataset.category;
    document.querySelectorAll(".btn-filter").forEach(btn => btn.classList.remove("activo"));
    boton.classList.add("activo");
    renderizarCatalogo();
  });

  // BUSCADOR CON DEBOUNCE:
  // El evento "input" se ejecuta con cada tecla, pero no buscamos en cada una.
  // clearTimeout() cancela la búsqueda pendiente y setTimeout() programa una nueva:
  // solo se busca cuando el usuario deja de escribir durante RETRASO_BUSQUEDA ms.
  inputSearch.addEventListener("input", (e) => {
    clearTimeout(temporizadorBusqueda);
    const texto = e.target.value;
    temporizadorBusqueda = setTimeout(() => {
      busquedaActual = texto;
      renderizarCatalogo();
    }, RETRASO_BUSQUEDA);
  });
}
