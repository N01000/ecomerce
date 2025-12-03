// toast.js

function getToastContainer() {
  let container = document.querySelector("#toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Muestra un mensaje flotante (toast)
 * @param {string} mensaje - Texto a mostrar
 * @param {"success"|"error"|"info"} tipo - Tipo de mensaje (clase CSS)
 */
function showToast(mensaje, tipo = "success") {
  const container = getToastContainer();

  const toast = document.createElement("div");
  toast.classList.add("toast", `toast--${tipo}`);
  toast.textContent = mensaje;

  container.appendChild(toast);

  // desaparecer después de 2 segundos
  setTimeout(() => {
    toast.classList.add("toast--hide");
    setTimeout(() => {
      toast.remove();
    }, 300); // tiempo de transición
  }, 2000);
}