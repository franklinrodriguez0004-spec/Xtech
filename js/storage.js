// ============================================================
// STORAGE: lectura y escritura segura de localStorage
// localStorage puede fallar: el navegador puede bloquearlo (modo privado,
// permisos) o el texto guardado puede estar dañado y JSON.parse() lanza error.
// Estas dos funciones usan try/catch para que la página siga funcionando.
// ============================================================

// Lee una clave y la convierte de texto JSON a su valor original.
// - clave: nombre con el que se guardó el dato.
// - porDefecto: valor que se devuelve si no hay dato o está dañado.
// - validar: función opcional que comprueba que el dato tenga la forma esperada
//   (por ejemplo, que sea un array). Si devuelve false, se usa porDefecto.
export function leerStorage(clave, porDefecto, validar = () => true) {
  try {
    const texto = localStorage.getItem(clave);
    if (texto === null) return porDefecto;
    const dato = JSON.parse(texto);
    return validar(dato) ? dato : porDefecto;
  } catch (error) {
    console.error(`No se pudo leer "${clave}" de localStorage:`, error);
    return porDefecto;
  }
}

// Convierte el valor a texto JSON y lo guarda.
// Devuelve true si se guardó y false si falló (por ejemplo, almacenamiento lleno).
export function guardarStorage(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.error(`No se pudo guardar "${clave}" en localStorage:`, error);
    return false;
  }
}
