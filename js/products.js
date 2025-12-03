const URL_PRODUCTOS = "./data/productos.json";
const STORAGE_KEY = "carrito";

const contenedorDetalle = document.querySelector("#detalle-producto");
const badgeCarrito = document.querySelector("#cart-count");

// Lee el id de la URL: product.html?id=3
const params = new URLSearchParams(window.location.search);
const idProducto = Number(params.get("id"));

if (!idProducto) {
  contenedorDetalle.innerHTML = "<p>Producto no válido.</p>";
}

// Actualiza el contador del carrito en el header
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  if (badgeCarrito) {
    badgeCarrito.textContent = total;
  }
}

// Carga el JSON y busca el producto por id
async function cargarDetalleProducto() {
  try {
    const respuesta = await fetch(URL_PRODUCTOS);
    if (!respuesta.ok) {
      throw new Error("No se pudo cargar productos.json");
    }

    const productos = await respuesta.json();
    const producto = productos.find((p) => p.id === idProducto);

    if (!producto) {
      contenedorDetalle.innerHTML = "<p>Producto no encontrado 😢</p>";
      return;
    }

    renderDetalle(producto);
  } catch (error) {
    console.error(error);
    contenedorDetalle.innerHTML =
      "<p>Ocurrió un error al cargar el producto 😢</p>";
  }
}

// Dibuja el detalle del producto
function renderDetalle(prod) {
  contenedorDetalle.innerHTML = `
    <article class="detalle-card">
      <img src="${prod.imagen}" alt="${prod.nombre}" class="detalle-img">

      <div class="detalle-body">
        <h2>${prod.nombre}</h2>
        <p class="detalle-price">
          $${prod.precio.toLocaleString("es-AR")}
        </p>
        <p><strong>Categoría:</strong> ${prod.categoria}</p>
        <p><strong>Stock disponible:</strong> ${prod.stock}</p>
        <p class="detalle-desc">${prod.descripcion}</p>

        <button id="btn-agregar-detalle">Agregar al carrito</button>
      </div>
    </article>
  `;

  const btn = document.querySelector("#btn-agregar-detalle");
  btn.addEventListener("click", () => agregarAlCarritoDesdeDetalle(prod));
}

// Agrega el producto al carrito desde el detalle
function agregarAlCarritoDesdeDetalle(producto) {
  let carrito = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (producto.stock <= 0) {
    showToast("No hay stock disponible.", "error");
    return;
  }

  const existente = carrito.find((item) => item.id === producto.id);

  if (existente) {
    if (existente.cantidad >= producto.stock) {
      showToast("Ya tenés el máximo disponible en el carrito.", "error");
      return;
    }
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      stock: producto.stock,
      cantidad: 1,
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  actualizarContadorCarrito();
  showToast("Producto agregado al carrito 🤘", "success");
}

// Inicializar
actualizarContadorCarrito();
cargarDetalleProducto();
