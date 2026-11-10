// ============================================================
// CARRITO DE COMPRAS
// Cada elemento del array carrito guarda un ID de producto y su cantidad.
// Incluye también el checkout (finalización de compra de demostración).
// ============================================================
import { productos } from "./datos.js";
import { formatearMoneda, mostrarToast, cerrarDrawer } from "./ui.js";
import { leerStorage, guardarStorage } from "./storage.js";

const contenedorItemsCarrito = document.querySelector("#contenedor-items-carrito");
const badgeCart = document.querySelector("#badge-cart");
const cartTotalCount = document.querySelector("#cart-total-count");
const cartTotalPrice = document.querySelector("#cart-total-price");
const cartDrawer = document.querySelector("#cart-drawer");
const cartOverlay = document.querySelector("#cart-drawer-overlay");
const modalCheckout = document.querySelector("#modal-checkout");

// Comprueba que lo leído de localStorage tenga la forma de un carrito válido:
// un array donde cada elemento tenga un id y una cantidad numéricos.
function esCarritoValido(dato) {
  return Array.isArray(dato) && dato.every(item =>
    item && Number.isInteger(item.id) && Number.isInteger(item.cantidad) && item.cantidad > 0
  );
}

// Recuperamos el carrito guardado en el navegador con leerStorage().
// Si no hay nada guardado, o el dato está dañado, usamos un array vacío
// y la página sigue funcionando.
let carrito = leerStorage("xtech_carrito", [], esCarritoValido);

// Agrega un producto al carrito. Si ya existe, aumenta su cantidad
// en lugar de crear una segunda línea para el mismo producto.
export function agregarAlCarrito(id) {
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

// Guardamos el array en localStorage con guardarStorage() (que ya maneja errores).
// Después actualizamos lo que se ve en pantalla.
function guardarYActualizarCarrito() {
  guardarStorage("xtech_carrito", carrito);
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
export function renderizarCarrito() {
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

// Conecta los eventos del carrito y del checkout.
// Se llama una sola vez desde main.js.
export function iniciarCarrito() {
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

  // ----------------------------------------------------------
  // CHECKOUT / FINALIZACIÓN DE COMPRA DE DEMOSTRACIÓN
  // Esta parte simula una compra: no procesa pagos reales ni envía pedidos.
  // ----------------------------------------------------------
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
}
