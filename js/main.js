// Ruta al JSON
const URL_PRODUCTOS = "./data/productos.json";

// Contenedor donde vamos a meter las tarjetas
const contenedorProductos = document.querySelector("#productos-container");

// Acá guardaremos la lista para usarla después (filtros, carrito, etc.)
let productos = [];

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
        <button class="btn-agregar" data-id="${prod.id}">
          Agregar al carrito
        </button>
        <button class="btn-detalle" data-id="${prod.id}">
          Ver detalle
        </button>
      </div>
    `;

    contenedorProductos.appendChild(card);
  });
}

// Llamamos a la función cuando carga el JS
cargarProductos();
