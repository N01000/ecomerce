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

// referencias a los filtros del HTML
const selectCategoria = document.querySelector("#filtro-categoria");
const inputBusqueda = document.querySelector("#busqueda");

// cuando cambian, filtramos
selectCategoria.addEventListener("change", filtrarProductos);
inputBusqueda.addEventListener("input", filtrarProductos);


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
  const prod = productos.find((p) => p.id === idProducto);
  if (!prod) return;

  // si no hay stock, salimos
  if (prod.stock <= 0) {
    alert("No hay stock disponible de este producto.");
    return;
  }

  const item = carrito.find((item) => item.id === idProducto);

  if (item) {
    // si ya tengo en carrito la misma cantidad que el stock, no dejo sumar más
    if (item.cantidad >= prod.stock) {
      alert("Producto sin stock.");
      return;
    }
    item.cantidad += 1;
  } else {
    carrito.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      imagen: prod.imagen,
      stock: prod.stock,   // guardo stock también en el carrito
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

    const sinStock = prod.stock <= 0;

    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <div class="card-body">
        <h3>${prod.nombre}</h3>
        <p class="card-price">$${prod.precio.toLocaleString("es-AR")}</p>
        <p class="card-stock">
          ${sinStock ? "Sin stock" : "Stock: " + prod.stock}
        </p>
        <button class="btn-agregar" data-id="${prod.id}" ${sinStock ? "disabled" : ""}>
          ${sinStock ? "No disponible" : "Agregar al carrito"}
        </button>
        <button class="btn-detalle" data-id="${prod.id}">
          Ver detalle
        </button>
      </div>
    `;

    contenedorProductos.appendChild(card);
  });
}

function filtrarProductos() {
  const categoria = selectCategoria.value;        // "remeras", "pantalones", etc.
  const texto = inputBusqueda.value.toLowerCase(); // texto de búsqueda

  let listaFiltrada = productos;

  // FILTRO POR CATEGORÍA
  if (categoria !== "todos") {
    listaFiltrada = listaFiltrada.filter(p => p.categoria === categoria);
  }

  // FILTRO POR BÚSQUEDA
  if (texto.trim() !== "") {
    listaFiltrada = listaFiltrada.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
  }

  renderizarProductos(listaFiltrada);
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
  // Redirigimos a la página de detalle con el id en la URL
  window.location.href = `product.html?id=${id}`;
}
});

// -------------------------
// INICIALIZACIÓN
// -------------------------

cargarCarritoDesdeLS(); // primero traemos lo que ya había
cargarProductos();      // y después cargamos los productos

