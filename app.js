// ============================================================
// XTECH - APLICACIÓN DEL CATÁLOGO, CARRITO Y FAVORITOS
// Este archivo controla el comportamiento de la página.
// querySelector() busca un elemento HTML por su selector CSS.
// querySelectorAll() busca todos los elementos que coinciden.
// ============================================================

const contenedorProductos = document.querySelector("#contenedor-productos");
const contenedorFiltros = document.querySelector("#contenedor-filtros");
const inputSearch = document.querySelector("#input-search");

const contenedorItemsCarrito = document.querySelector("#contenedor-items-carrito");
const contenedorItemsFavoritos = document.querySelector("#contenedor-items-favoritos");
const badgeCart = document.querySelector("#badge-cart");
const badgeFavs = document.querySelector("#badge-favs");
const cartTotalCount = document.querySelector("#cart-total-count");
const cartTotalPrice = document.querySelector("#cart-total-price");

const cartDrawer = document.querySelector("#cart-drawer");
const cartOverlay = document.querySelector("#cart-drawer-overlay");
const favsDrawer = document.querySelector("#favs-drawer");
const favsOverlay = document.querySelector("#favs-drawer-overlay");
const modalCheckout = document.querySelector("#modal-checkout");

// Recuperamos el carrito guardado en el navegador.
// localStorage.getItem() obtiene el texto guardado.
// JSON.parse() convierte ese texto nuevamente en un array.
// Si todavía no hay nada guardado, usamos un array vacío.
let carrito = JSON.parse(localStorage.getItem("xtech_carrito")) || [];
// Recuperamos los identificadores de los productos favoritos.
// Se guardan solo los ID porque los datos completos están en datos.js.
let favoritos = JSON.parse(localStorage.getItem("xtech_favoritos")) || [];
// Variables que recuerdan qué categoría y qué texto se están buscando.
let filtroActual = "todos";
let busquedaActual = "";

// Convierte un número en un precio con símbolo y formato de moneda.
// Por ejemplo: 120 USD o 255.599 ARS, según la configuración regional.
function formatearMoneda(precio, moneda) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: moneda === "USD" ? 2 : 0
  }).format(precio);
}

// ============================================================
// CATÁLOGO
// filter() selecciona los productos que cumplen las condiciones.
// map() transforma cada producto en una tarjeta HTML.
// Las comillas invertidas permiten usar template strings e insertar
// valores con ${...} dentro del HTML.
// ============================================================
// Dibuja nuevamente las tarjetas cuando cambia la búsqueda,
// la categoría o el estado de favoritos.
function renderizarCatalogo() {
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
  // includes() permite saber si el ID del producto ya está en favoritos.
  contenedorProductos.innerHTML = productosFiltrados.map(producto => {
    const esFavorito = favoritos.includes(producto.id);
    return `
      <article class="producto-card">
        <div class="imagen-producto">
          <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
          <span class="categoria-producto">${producto.categoria}</span>
          <button type="button" class="btn-fav-card ${esFavorito ? "es-favorito" : ""}"
            data-action="fav" data-id="${producto.id}" aria-label="Agregar a favoritos">
            ${esFavorito ? "♥" : "♡"}
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

// Este listener permite que los enlaces de navegación con data-category
// también seleccionen una categoría. Si no hay ninguno, no hace nada.
document.querySelector(".menu").addEventListener("click", (e) => {
  const enlace = e.target.closest("a[data-category]");
  if (!enlace) return;
  filtroActual = enlace.dataset.category;
  document.querySelectorAll(".btn-filter").forEach(btn => {
    btn.classList.toggle("activo", btn.dataset.category === filtroActual);
  });
  renderizarCatalogo();
});

// El evento "input" se ejecuta cada vez que cambia el texto del buscador.
inputSearch.addEventListener("input", (e) => {
  busquedaActual = e.target.value;
  renderizarCatalogo();
});

// ============================================================
// CARRITO DE COMPRAS
// Cada elemento del array carrito guarda un ID de producto y su cantidad.
// ============================================================
// Agrega un producto al carrito. Si ya existe, aumenta su cantidad
// en lugar de crear una segunda línea para el mismo producto.
function agregarAlCarrito(id) {
  // find() busca en el array de productos el objeto con ese ID.
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  // Comprobamos si ese producto ya estaba agregado al carrito.
  const existente = carrito.find(item => item.id === id);

  if (existente) {
    // No permitimos superar la cantidad disponible en el stock.
    if (existente.cantidad >= producto.stock) {
      mostrarToast("No hay más unidades disponibles de este producto.", "error");
      return;
    }
    existente.cantidad++;
  } else {
    carrito.push({ id: producto.id, cantidad: 1 });
  }

  guardarYActualizarCarrito();
  mostrarToast("Producto agregado al carrito.");
}

// Aumenta o disminuye la cantidad. El parámetro cambio vale 1 o -1.
function cambiarCantidadCarrito(id, cambio) {
  const item = carrito.find(p => p.id === id);
  const producto = productos.find(p => p.id === id);
  if (!item || !producto) return;

  // Calculamos la cantidad que tendría el producto después del cambio.
  const nuevaCantidad = item.cantidad + cambio;

  // Si al disminuir llega a cero, quitamos el producto del carrito.
  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }
  if (nuevaCantidad > producto.stock) {
    mostrarToast(`Stock máximo: ${producto.stock} unidades.`, "error");
    return;
  }

  item.cantidad = nuevaCantidad;
  guardarYActualizarCarrito();
}

// filter() crea un nuevo array dejando afuera el producto cuyo ID recibimos.
function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  guardarYActualizarCarrito();
  mostrarToast("Producto eliminado del carrito.");
}

// Elimina todos los productos del carrito después de comprobar
// que realmente haya algo para vaciar.
function vaciarCarrito() {
  if (carrito.length === 0) {
    mostrarToast("El carrito ya está vacío.", "error");
    return;
  }
  carrito = [];
  guardarYActualizarCarrito();
  mostrarToast("Carrito vaciado.");
}

// Guardamos el array como texto JSON en localStorage.
// Después actualizamos lo que se ve en pantalla.
function guardarYActualizarCarrito() {
  localStorage.setItem("xtech_carrito", JSON.stringify(carrito));
  renderizarCarrito();
}

// Calcula los subtotales agrupados por moneda.
// Es importante porque no se deben sumar directamente ARS y USD.
function obtenerTotalesPorMoneda() {
  return carrito.reduce((totales, item) => {
    const producto = productos.find(p => p.id === item.id);
    if (!producto) return totales;
    totales[producto.moneda] = (totales[producto.moneda] || 0) + producto.precio * item.cantidad;
    return totales;
  }, {});
}

// Convierte los totales calculados en pequeños bloques HTML
// para mostrarlos en el carrito y en la confirmación de compra.
function htmlTotales() {
  const totales = obtenerTotalesPorMoneda();
  const monedas = Object.entries(totales);
  if (monedas.length === 0) return "<p class='carrito-vacio'>No hay productos en el carrito.</p>";
  return monedas.map(([moneda, total]) => `
    <div class="linea-total">
      <span>Total ${moneda}</span>
      <strong>${formatearMoneda(total, moneda)}</strong>
    </div>
  `).join("");
}

// Actualiza el contador, los precios y la lista de productos del carrito.
function renderizarCarrito() {
  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
  badgeCart.textContent = cantidadTotal;
  cartTotalCount.textContent = cantidadTotal;
  cartTotalPrice.innerHTML = htmlTotales();

  if (carrito.length === 0) {
    contenedorItemsCarrito.innerHTML = "<p class='carrito-vacio'>El carrito está vacío. Agregá algún producto para comenzar.</p>";
    return;
  }

  contenedorItemsCarrito.innerHTML = carrito.map(item => {
    const producto = productos.find(p => p.id === item.id);
    if (!producto) return "";
    return `
      <article class="item-drawer">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="item-datos">
          <h3>${producto.nombre}</h3>
          <strong>${formatearMoneda(producto.precio, producto.moneda)}</strong>
          <div class="controles-cantidad">
            <button type="button" data-cart-action="menos" data-id="${producto.id}" aria-label="Disminuir">−</button>
            <span>${item.cantidad}</span>
            <button type="button" data-cart-action="mas" data-id="${producto.id}" aria-label="Aumentar">+</button>
          </div>
        </div>
        <button type="button" class="btn-eliminar" data-cart-action="eliminar" data-id="${producto.id}">Eliminar</button>
      </article>
    `;
  }).join("");
}

// DELEGACIÓN DE EVENTOS DEL CARRITO:
// Un único listener controla los botones +, - y Eliminar que se generan
// dinámicamente dentro del panel lateral.
contenedorItemsCarrito.addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-cart-action]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.cartAction;
  if (accion === "mas") cambiarCantidadCarrito(id, 1);
  if (accion === "menos") cambiarCantidadCarrito(id, -1);
  if (accion === "eliminar") eliminarDelCarrito(id);
});

document.querySelector("#btn-vaciar-carrito").addEventListener("click", vaciarCarrito);

// ============================================================
// FAVORITOS
// El array favoritos almacena los ID de los productos marcados.
// ============================================================
// Alterna el estado de favorito: si ya estaba, lo quita; si no, lo agrega.
function toggleFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(favId => favId !== id);
    mostrarToast("Quitaste el producto de favoritos.");
  } else {
    favoritos.push(id);
    mostrarToast("Producto guardado en favoritos.");
  }
  localStorage.setItem("xtech_favoritos", JSON.stringify(favoritos));
  renderizarCatalogo();
  renderizarFavoritos();
}

// Muestra en el panel lateral todos los productos guardados como favoritos.
function renderizarFavoritos() {
  badgeFavs.textContent = favoritos.length;

  if (favoritos.length === 0) {
    contenedorItemsFavoritos.innerHTML = "<p class='carrito-vacio'>Todavía no guardaste favoritos.</p>";
    return;
  }

  const productosFavoritos = productos.filter(p => favoritos.includes(p.id));
  contenedorItemsFavoritos.innerHTML = productosFavoritos.map(producto => `
    <article class="item-drawer">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="item-datos">
        <h3>${producto.nombre}</h3>
        <strong>${formatearMoneda(producto.precio, producto.moneda)}</strong>
        <button type="button" class="btn-agregar-fav" data-fav-action="agregar" data-id="${producto.id}">
          Agregar al carrito
        </button>
      </div>
      <button type="button" class="btn-eliminar" data-fav-action="quitar" data-id="${producto.id}">Quitar</button>
    </article>
  `).join("");
}

// Un solo listener administra los botones "Agregar al carrito" y "Quitar"
// del panel de favoritos, aunque sus elementos se creen dinámicamente.
contenedorItemsFavoritos.addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-fav-action]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  if (boton.dataset.favAction === "agregar") agregarAlCarrito(id);
  if (boton.dataset.favAction === "quitar") toggleFavorito(id);
});

// ============================================================
// PANELES LATERALES (DRAWERS)
// Funciones para abrir y cerrar el carrito y la lista de favoritos.
// ============================================================
// Muestra el fondo oscuro y desplaza el panel lateral hacia la pantalla.
function abrirDrawer(drawer, overlay) {
  overlay.hidden = false;
  requestAnimationFrame(() => {
    overlay.classList.add("visible");
    drawer.classList.add("abierto");
    drawer.setAttribute("aria-hidden", "false");
  });
}

// Quita las clases que mantienen abierto el panel y, después de la
// transición, oculta el fondo para que no interfiera con la página.
function cerrarDrawer(drawer, overlay) {
  drawer.classList.remove("abierto");
  overlay.classList.remove("visible");
  drawer.setAttribute("aria-hidden", "true");
  setTimeout(() => { overlay.hidden = true; }, 250);
}

document.querySelector("#btn-open-cart").addEventListener("click", () => abrirDrawer(cartDrawer, cartOverlay));
document.querySelector("#btn-close-cart").addEventListener("click", () => cerrarDrawer(cartDrawer, cartOverlay));
cartOverlay.addEventListener("click", () => cerrarDrawer(cartDrawer, cartOverlay));

document.querySelector("#btn-favs-drawer").addEventListener("click", () => abrirDrawer(favsDrawer, favsOverlay));
document.querySelector("#btn-close-favs").addEventListener("click", () => cerrarDrawer(favsDrawer, favsOverlay));
favsOverlay.addEventListener("click", () => cerrarDrawer(favsDrawer, favsOverlay));

// ============================================================
// CHECKOUT / FINALIZACIÓN DE COMPRA DE DEMOSTRACIÓN
// Esta parte simula una compra: no procesa pagos reales ni envía pedidos.
// ============================================================
// Al tocar "Finalizar compra", comprobamos que el carrito no esté vacío.
// Si hay productos, mostramos el formulario de demostración.
document.querySelector("#btn-checkout").addEventListener("click", () => {
  if (carrito.length === 0) {
    mostrarToast("El carrito está vacío.", "error");
    return;
  }
  document.querySelector("#modal-checkout-total").innerHTML = htmlTotales();
  cerrarDrawer(cartDrawer, cartOverlay);
  modalCheckout.hidden = false;
});

document.querySelector("#btn-close-modal").addEventListener("click", () => {
  modalCheckout.hidden = true;
});

modalCheckout.addEventListener("click", (e) => {
  if (e.target === modalCheckout) modalCheckout.hidden = true;
});

// Evitamos que el formulario recargue la página con preventDefault().
// Luego mostramos el mensaje de confirmación y vaciamos el carrito.
document.querySelector("#form-checkout").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.querySelector("#form-nombre").value.trim();
  modalCheckout.hidden = true;
  carrito = [];
  guardarYActualizarCarrito();
  e.target.reset();
  mostrarToast(`¡Gracias, ${nombre}! El pedido de demostración fue confirmado.`);
});

// ============================================================
// NOTIFICACIONES (TOAST)
// Mensajes breves que aparecen y desaparecen automáticamente.
// ============================================================
let toastTemporizador;
// Crea un mensaje temporal. El tipo "error" cambia su apariencia.
function mostrarToast(mensaje, tipo = "exito") {
  const contenedor = document.querySelector("#toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${tipo === "error" ? "toast-error" : ""}`;
  toast.textContent = mensaje;
  contenedor.appendChild(toast);

  setTimeout(() => toast.classList.add("toast-visible"), 10);
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 250);
  }, 2500);
}

// ============================================================
// MODO OSCURO
// Se recuerda la elección del usuario usando localStorage.
// ============================================================
const themeBtn = document.querySelector("#toggle-theme");
if (localStorage.getItem("xtech_tema") === "oscuro") {
  document.body.classList.add("dark-mode");
}
actualizarTextoTema();

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const tema = document.body.classList.contains("dark-mode") ? "oscuro" : "claro";
  localStorage.setItem("xtech_tema", tema);
  actualizarTextoTema();
});

// Cambia el texto del botón según el tema que esté activo.
function actualizarTextoTema() {
  themeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️ Modo claro" : "🌙 Modo oscuro";
}

// ============================================================
// INICIALIZACIÓN
// Estas llamadas se ejecutan al cargar el archivo JavaScript.
// Dibujan el catálogo, el carrito y los favoritos guardados.
// ============================================================
renderizarCatalogo();
renderizarCarrito();
renderizarFavoritos();
