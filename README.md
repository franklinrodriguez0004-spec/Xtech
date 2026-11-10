# XTECH

Catálogo web de **componentes y periféricos de PC** (PC armadas, mouse, teclados y monitores) con carrito de compras, favoritos y buscador. Proyecto desarrollado con HTML, CSS y JavaScript puro (sin librerías).

## Rubro

Venta de tecnología y hardware: PC Gamer armadas, mouse, teclados mecánicos y monitores. Los precios se muestran en USD o ARS según el producto.

## Funcionalidades

- **Catálogo dinámico**: las tarjetas se generan desde un array de productos (`js/datos.js`) con `filter()` y `map()`.
- **Filtros por categoría**: Todos, PC Gamer, Mouse, Teclados y Monitores.
- **Buscador con debounce**: busca por nombre o descripción, pero espera 300 ms después de la última tecla (`setTimeout` y `clearTimeout`).
- **Carrito de compras**: agregar, sumar, restar y eliminar productos, con **control de stock** (no deja superar las unidades disponibles).
- **Totales por moneda**: los subtotales en USD y ARS se calculan por separado.
- **Favoritos**: marcar y quitar productos, con contador y panel lateral.
- **Persistencia**: carrito, favoritos y tema se guardan en `localStorage`, con `try/catch` para que la página funcione aunque el dato esté dañado.
- **Modo oscuro** que se recuerda entre visitas.
- **Checkout de demostración**: formulario que simula la confirmación del pedido (no procesa pagos reales).
- **Formulario de contacto** con validación en JavaScript y mensaje de éxito.
- Botón flotante de WhatsApp y diseño adaptable a celulares.

## Estructura del proyecto

```
Xtech/
├── index.html
├── style.css
├── js/
│   ├── main.js        # punto de entrada: importa y arranca todo
│   ├── datos.js       # array de productos
│   ├── productos.js   # catálogo, filtros y buscador (debounce)
│   ├── carrito.js     # carrito, totales y checkout
│   ├── favoritos.js   # lista de favoritos
│   ├── ui.js          # formato de precios, toast, paneles laterales y tema
│   ├── storage.js     # lectura/escritura segura de localStorage (try/catch)
│   └── contacto.js    # validación del formulario de contacto
├── pcs/  mouse/  teclado/  monitores/   # imágenes de los productos
└── README.md
```

## Cómo ejecutarlo

El proyecto usa **ES Modules** (`<script type="module">`), y los navegadores bloquean los módulos cuando se abre el HTML con doble clic (`file://`). Hay que abrirlo con un servidor local:

**Opción 1 – VS Code (recomendada)**
1. Instalar la extensión **Live Server**.
2. Click derecho sobre `index.html` → **Open with Live Server**.

**Opción 2 – Terminal**
```bash
# con Python
python -m http.server 8000
# o con Node
npx serve
```
Luego abrir `http://localhost:8000` en el navegador.

## Tecnologías

HTML5 · CSS3 · JavaScript (ES Modules) · localStorage
