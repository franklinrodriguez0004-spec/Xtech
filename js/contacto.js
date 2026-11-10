// ============================================================
// FORMULARIO DE CONTACTO
// Se valida con JavaScript y se muestra un mensaje de éxito en pantalla.
// No se envía a ningún servidor: es una simulación para la demostración.
// ============================================================
import { mostrarToast } from "./ui.js";

// Expresión regular simple para comprobar el formato de un email:
// texto + @ + texto + punto + texto, sin espacios.
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reglas de cada campo. Cada función devuelve un texto de error,
// o una cadena vacía si el valor es correcto.
const reglas = {
  nombre: (valor) => valor.length < 3 ? "Ingresá tu nombre (mínimo 3 caracteres)." : "",
  email: (valor) => !REGEX_EMAIL.test(valor) ? "Ingresá un correo electrónico válido." : "",
  mensaje: (valor) => valor.length < 10 ? "Escribí tu consulta (mínimo 10 caracteres)." : ""
};

// Muestra u oculta el error de un campo y marca el input en rojo si es inválido.
function mostrarError(campo, texto) {
  document.querySelector(`#error-${campo}`).textContent = texto;
  document.querySelector(`#${campo}`).classList.toggle("invalido", texto !== "");
}

// Valida todos los campos. Devuelve true solo si ninguno tiene errores.
function validarFormulario(form) {
  let valido = true;
  for (const campo of Object.keys(reglas)) {
    const error = reglas[campo](form.elements[campo].value.trim());
    mostrarError(campo, error);
    if (error) valido = false;
  }
  return valido;
}

// Conecta el envío del formulario. Se llama una sola vez desde main.js.
export function iniciarContacto() {
  const form = document.querySelector("#form-contacto");
  const mensajeExito = document.querySelector("#contacto-exito");
  let temporizadorExito;

  form.addEventListener("submit", (e) => {
    // preventDefault() evita que el navegador recargue la página al enviar.
    e.preventDefault();
    mensajeExito.hidden = true;

    if (!validarFormulario(form)) {
      mostrarToast("Revisá los campos marcados.", "error");
      return;
    }

    const nombre = form.elements.nombre.value.trim();
    form.reset();
    mensajeExito.textContent = `¡Gracias, ${nombre}! Recibimos tu consulta y te vamos a responder pronto.`;
    mensajeExito.hidden = false;

    // El mensaje de éxito se oculta solo después de 8 segundos.
    clearTimeout(temporizadorExito);
    temporizadorExito = setTimeout(() => { mensajeExito.hidden = true; }, 8000);
  });

  // Cuando el usuario corrige un campo, quitamos su error al instante.
  form.addEventListener("input", (e) => {
    if (reglas[e.target.name]) mostrarError(e.target.name, "");
  });
}
