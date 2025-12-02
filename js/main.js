/// -------------------------
// CONFIG Y VARIABLES
// -------------------------

// Ruta al JSON
const URL_PRODUCTOS = "./data/productos.json";

// Contenedor donde vamos a meter las tarjetas
const contenedorProductos = document.querySelector("#productos-container");

// Acá guardaremos la lista para usarla después (filtros, carrito, etc.)
let productos = [];

// Carrito (se va a sincronizar con localStorage)
let carrito = [];

// -------------------------
// CARRITO + LOCALSTORAGE
// -------------------------

function cargarCarritoDesdeLS() {
  const data = localStorage.getItem("carrito");
  carrito = data ? JSON.parse(data) : [];
}

function guardarCarritoEnLS() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(idProducto) {
  // Busco el producto en el array productos
  const prod = productos.find((p) => p.id === idProducto);
  if (!prod) return;

  // ¿Ya está en el carrito?
  const item = carrito.find((item) => item.id === idProducto);

  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      imagen: prod.imagen,
      cantidad: 1,
    });
  }

  guardarCarritoEnLS();
  console.log("Carrito actualizado:", carrito);
}

// -------------------------
// CARGA Y RENDER DE PRODUCTOS
// -------------------------

// Función principal: carga los productos y los muestra
async function cargarProductos() {
  try {
    const respuesta = await fetch(URL_PRODUCTOS);
    if (!respuesta.ok) {
      throw new Error("No se pudo cargar productos.json");
    }

    productos = await respuesta.json();
    renderizarProductos(productos);
  } catch (error) {
    console.error(error);
    contenedorProductos.innerHTML =
      "<p>Hubo un error al cargar los productos 😢</p>";
  }
}

// Dibuja las tarjetas en el HTML
function renderizarProductos(lista) {
  // Limpio primero
  contenedorProductos.innerHTML = "";

  lista.forEach((prod) => {
    const card = document.createElement("article");
    card.classList.add("card-producto");

    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <div class="card-body">
        <h3>${prod.nombre}</h3>
        <p class="card-price">$${prod.precio.toLocaleString("es-AR")}</p>
        <button class="btn-agregar" data-id="${prod.id}">Agregar al carrito</button>
        <button class="btn-detalle" data-id="${prod.id}">Ver detalle</button>
      </div>
    `;

    contenedorProductos.appendChild(card);
  });
}

// -------------------------
// EVENTOS
// -------------------------

// Delegación de eventos para los botones dentro de las tarjetas
contenedorProductos.addEventListener("click", (e) => {
  // Botón "Agregar al carrito"
  if (e.target.classList.contains("btn-agregar")) {
    const id = Number(e.target.dataset.id);
    agregarAlCarrito(id);
  }

  // Botón "Ver detalle" (dejamos listo para después)
  if (e.target.classList.contains("btn-detalle")) {
    const id = Number(e.target.dataset.id);
    console.log("Ver detalle de id:", id);
    // Más adelante: redirigir a product.html?id=ID
  }
});

// -------------------------
// INICIALIZACIÓN
// -------------------------

cargarCarritoDesdeLS(); // primero traemos lo que ya había
cargarProductos();      // y después cargamos los productos

