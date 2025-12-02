// misma ruta que en main.js
const URL_PRODUCTOS = "./data/productos.json";

// contenedor donde mostramos el detalle
const contenedorDetalle = document.querySelector("#detalle-producto");

// 1) leer el id que viene en la URL: product.html?id=3
const params = new URLSearchParams(window.location.search);
const idProducto = Number(params.get("id"));

// por si no vino id en la URL
if (!idProducto) {
  contenedorDetalle.innerHTML = "<p>Producto no válido.</p>";
}

// 2) cargar el JSON, buscar el producto y mostrarlo
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

    // 3) Render del detalle
    contenedorDetalle.innerHTML = `
      <article class="detalle-card">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="detalle-body">
          <h2>${producto.nombre}</h2>
          <p class="detalle-price">
            $${producto.precio.toLocaleString("es-AR")}
          </p>
          <p class="detalle-desc">${producto.descripcion}</p>
          <p class="detalle-stock">Stock disponible: ${producto.stock}</p>

          <button id="btn-agregar-detalle" data-id="${producto.id}">
            Agregar al carrito
          </button>
        </div>
      </article>
    `;

    let cantidad = 1;



    // 4) botón de agregar al carrito desde la vista detalle
    const btnAgregar = document.querySelector("#btn-agregar-detalle");
    btnAgregar.addEventListener("click", () =>
      agregarAlCarritoDesdeDetalle(producto)
    );
  } catch (error) {
    console.error(error);
    contenedorDetalle.innerHTML =
      "<p>Ocurrió un error al cargar el producto 😢</p>";
  }
}

// 5) función simple para sumar al carrito usando localStorage
function agregarAlCarritoDesdeDetalle(producto) {
  const STORAGE_KEY = "carrito";

  let carrito = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const existente = carrito.find((item) => item.id === producto.id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1,
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  alert("Producto agregado al carrito 🛒");

    let cantidad = 1;

  // botones de cantidad
  document.querySelector("#btn-plus").addEventListener("click", () => {
    if (cantidad < producto.stock) cantidad++;
    actualizarCantidad();
  });

  document.querySelector("#btn-minus").addEventListener("click", () => {
    if (cantidad > 1) cantidad--;
    actualizarCantidad();
  });

  function actualizarCantidad() {
    document.querySelector("#detalle-cantidad").textContent = cantidad;
}
}



// ejecutar al cargar la página
cargarDetalleProducto();
