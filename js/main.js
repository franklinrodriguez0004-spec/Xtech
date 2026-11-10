// ============================================================
// XTECH - PUNTO DE ENTRADA
// index.html carga solo este archivo (type="module").
// Acá se importan los demás módulos y se arranca la aplicación.
// ============================================================
import { iniciarTema, iniciarDrawers } from "./ui.js";
import { iniciarCarrito, renderizarCarrito } from "./carrito.js";
import { iniciarFavoritos, renderizarFavoritos } from "./favoritos.js";
import { iniciarProductos, renderizarCatalogo } from "./productos.js";
import { iniciarContacto } from "./contacto.js";

// Conectamos los eventos de cada parte de la página.
iniciarTema();
iniciarDrawers();
iniciarCarrito();
iniciarFavoritos(renderizarCatalogo);
iniciarProductos();
iniciarContacto();

// Dibujamos el catálogo, el carrito y los favoritos guardados.
renderizarCatalogo();
renderizarCarrito();
renderizarFavoritos();
