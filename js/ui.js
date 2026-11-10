// ============================================================
// UI: utilidades de interfaz compartidas
// Formato de precios, notificaciones (toast), paneles laterales y modo oscuro.
// Solo depende de storage.js: lo importan carrito, favoritos y main.
// ============================================================
import { leerStorage, guardarStorage } from "./storage.js";

// Convierte un número en un precio con símbolo y formato de moneda.
// Por ejemplo: USD 120 o ARS 255.599, según la configuración regional.
export function formatearMoneda(precio, moneda) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: moneda === "USD" ? 2 : 0
  }).format(precio);
}

// ============================================================
// NOTIFICACIONES (TOAST)
// Mensajes breves que aparecen y desaparecen automáticamente.
// ============================================================
// Crea un mensaje temporal. El tipo "error" cambia su apariencia.
export function mostrarToast(mensaje, tipo = "exito") {
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
// PANELES LATERALES (DRAWERS)
// Funciones para abrir y cerrar el carrito y la lista de favoritos.
// ============================================================
// Muestra el fondo oscuro y desplaza el panel lateral hacia la pantalla.
export function abrirDrawer(drawer, overlay) {
  overlay.hidden = false;
  requestAnimationFrame(() => {
    overlay.classList.add("visible");
    drawer.classList.add("abierto");
    drawer.setAttribute("aria-hidden", "false");
  });
}

// Quita las clases que mantienen abierto el panel y, después de la
// transición, oculta el fondo para que no interfiera con la página.
export function cerrarDrawer(drawer, overlay) {
  drawer.classList.remove("abierto");
  overlay.classList.remove("visible");
  drawer.setAttribute("aria-hidden", "true");
  setTimeout(() => { overlay.hidden = true; }, 250);
}

// Conecta los botones de abrir/cerrar de ambos paneles laterales.
export function iniciarDrawers() {
  const cartDrawer = document.querySelector("#cart-drawer");
  const cartOverlay = document.querySelector("#cart-drawer-overlay");
  const favsDrawer = document.querySelector("#favs-drawer");
  const favsOverlay = document.querySelector("#favs-drawer-overlay");

  document.querySelector("#btn-open-cart").addEventListener("click", () => abrirDrawer(cartDrawer, cartOverlay));
  document.querySelector("#btn-close-cart").addEventListener("click", () => cerrarDrawer(cartDrawer, cartOverlay));
  cartOverlay.addEventListener("click", () => cerrarDrawer(cartDrawer, cartOverlay));

  document.querySelector("#btn-favs-drawer").addEventListener("click", () => abrirDrawer(favsDrawer, favsOverlay));
  document.querySelector("#btn-close-favs").addEventListener("click", () => cerrarDrawer(favsDrawer, favsOverlay));
  favsOverlay.addEventListener("click", () => cerrarDrawer(favsDrawer, favsOverlay));
}

// ============================================================
// MODO OSCURO
// Se recuerda la elección del usuario usando localStorage.
// ============================================================
export function iniciarTema() {
  const themeBtn = document.querySelector("#toggle-theme");

  // Cambia el texto del botón según el tema que esté activo.
  function actualizarTextoTema() {
    themeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️ Modo claro" : "🌙 Modo oscuro";
  }

  // leerStorage() devuelve "claro" si no hay dato o si está dañado.
  if (leerStorage("xtech_tema", "claro") === "oscuro") {
    document.body.classList.add("dark-mode");
  }
  actualizarTextoTema();

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const tema = document.body.classList.contains("dark-mode") ? "oscuro" : "claro";
    guardarStorage("xtech_tema", tema);
    actualizarTextoTema();
  });
}
