// ============================================================
// FAVORITOS
// El array favoritos almacena los ID de los productos marcados.
// ============================================================
import { productos } from "./datos.js";
import { formatearMoneda, mostrarToast } from "./ui.js";
import { agregarAlCarrito } from "./carrito.js";
import { leerStorage, guardarStorage } from "./storage.js";

const contenedorItemsFavoritos = document.querySelector("#contenedor-items-favoritos");
const badgeFavs = document.querySelector("#badge-favs");

// Recuperamos los identificadores de los productos favoritos.
// Se guardan solo los ID porque los datos completos están en datos.js.
// Si el dato está dañado o no es un array de números, empezamos con una lista vacía.
let favoritos = leerStorage(
  "xtech_favoritos",
  [],
  dato => Array.isArray(dato) && dato.every(Number.isInteger)
);

// Función que main.js nos entrega para avisar al catálogo que debe
// volver a dibujarse (así favoritos.js no necesita importar productos.js).
let alCambiarFavoritos = () => {};

// Responde si un producto está marcado como favorito.
export function esFavorito(id) {
  return favoritos.includes(id);
}

// Alterna el estado de favorito: si ya estaba, lo quita; si no, lo agrega.
export function toggleFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(favId => favId !== id);
    mostrarToast("Quitaste el producto de favoritos.");
  } else {
    favoritos.push(id);
    mostrarToast("Producto guardado en favoritos.");
  }
  guardarStorage("xtech_favoritos", favoritos);
  alCambiarFavoritos();
  renderizarFavoritos();
}

// Muestra en el panel lateral todos los productos guardados como favoritos.
export function renderizarFavoritos() {
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

// Conecta el listener del panel de favoritos.
// alCambiar es la función que redibuja el catálogo.
export function iniciarFavoritos(alCambiar) {
  alCambiarFavoritos = alCambiar;

  // Un solo listener administra los botones "Agregar al carrito" y "Quitar"
  // del panel de favoritos, aunque sus elementos se creen dinámicamente.
  contenedorItemsFavoritos.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-fav-action]");
    if (!boton) return;
    const id = Number(boton.dataset.id);
    if (boton.dataset.favAction === "agregar") agregarAlCarrito(id);
    if (boton.dataset.favAction === "quitar") toggleFavorito(id);
  });
}
