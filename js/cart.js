// -------------------------
// REFERENCIAS AL DOM
// -------------------------
const cartItemsContainer = document.querySelector("#cart-items");
const cartEmptyText = document.querySelector("#cart-empty");
const cartTotalText = document.querySelector("#cart-total");
const btnVaciar = document.querySelector("#vaciar-carrito");

btnVaciar.addEventListener("click", () => {
  if (confirm("¿Seguro que querés vaciar el carrito?")) {
    carrito = [];
    guardarCarritoEnLS();
    renderCarrito();
  }
});
// Carrito local (se sincroniza con localStorage)
let carrito = [];

// -------------------------
// LOCALSTORAGE
// -------------------------
function cargarCarritoDesdeLS() {
  const data = localStorage.getItem("carrito");
  carrito = data ? JSON.parse(data) : [];
}

function guardarCarritoEnLS() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// -------------------------
// LÓGICA DEL CARRITO
// -------------------------
function calcularTotal() {
  return carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
}

function renderCarrito() {
  cartItemsContainer.innerHTML = "";

  if (!carrito.length) {
    cartEmptyText.style.display = "block";
    cartTotalText.textContent = "Total: $0";
    return;
  }

  cartEmptyText.style.display = "none";

  carrito.forEach((item) => {
    const row = document.createElement("div");
    row.classList.add("cart-row");

    row.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" class="cart-img">
      <span class="cart-name">${item.nombre}</span>
      <span class="cart-price">$${item.precio.toLocaleString("es-AR")}</span>
      <div class="cart-qty">
        <button class="btn-menos" data-id="${item.id}">-</button>
        <span>${item.cantidad}</span>
        <button class="btn-mas" data-id="${item.id}">+</button>
      </div>
      <span class="cart-subtotal">
        $${(item.precio * item.cantidad).toLocaleString("es-AR")}
      </span>
      <button class="btn-eliminar" data-id="${item.id}">x</button>
    `;

    cartItemsContainer.appendChild(row);
  });

  const total = calcularTotal();
  cartTotalText.textContent = `Total: $${total.toLocaleString("es-AR")}`;
}

// -------------------------
// MANEJO DE BOTONES (+, -, x)
// -------------------------
cartItemsContainer.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  // + cantidad
  if (e.target.classList.contains("btn-mas")) {
    const item = carrito.find((p) => p.id === id);
    if (!item) return;

     // si ya está en el máximo de stock, no dejo sumar
    if (item.stock && item.cantidad >= item.stock) {
    alert("No podés agregar más, no hay stock disponible.");
    return;
  }

    item.cantidad += 1;
  }

  // - cantidad
  if (e.target.classList.contains("btn-menos")) {
    const item = carrito.find((p) => p.id === id);
    if (!item) return;

    if (item.cantidad > 1) {
      item.cantidad -= 1;
    } else {
      // si llega a 0, lo saco del carrito
      carrito = carrito.filter((p) => p.id !== id);
    }
  }

  // eliminar directamente
  if (e.target.classList.contains("btn-eliminar")) {
    carrito = carrito.filter((p) => p.id !== id);
  }

  guardarCarritoEnLS();
  renderCarrito();
});

// -------------------------
// INICIALIZAR
// -------------------------
cargarCarritoDesdeLS();
renderCarrito();
