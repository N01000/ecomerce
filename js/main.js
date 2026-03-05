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



const btnSearch = document.getElementById('btn-toggle-search');



const btnCats = document.getElementById('btn-categorias');

const selectCats = document.getElementById('filtro-categoria');



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

    showToast("No hay stock disponible de este producto.", "error");

    return;

  }



  const item = carrito.find((item) => item.id === idProducto);



  if (item) {

    // si ya tengo en carrito la misma cantidad que el stock, no dejo sumar más

    if (item.cantidad >= prod.stock) {

      showToast("Alcanzaste el stock máximo de este producto.", "error");

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

  actualizarContadorCarrito();

  showToast("Producto agregado al carrito 🤘", "success");

  console.log("Carrito actualizado:", carrito);

}



// -------------------------

// CARGA Y RENDER DE PRODUCTOS

// -------------------------



function actualizarContadorCarrito() {

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);



  const badge = document.querySelector("#cart-count");

  if (badge) badge.textContent = total;

}

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

// Aplica los filtros y vuelve a renderizar

function filtrarProductos(catManual = null) {
  // Si catManual tiene algo (clic en menú), usamos eso.
  // Si es null (teclado), usamos el valor del selectCategoria.
  const categoria = selectCategoria.value;
  const texto = inputBusqueda.value.toLowerCase();
  let listaFiltrada = productos;

  // 1. FILTRO POR CATEGORÍA
  if (categoria && categoria !== "todos") {
    listaFiltrada = listaFiltrada.filter(p => p.categoria === categoria);
  }

  // 2. FILTRO POR BÚSQUEDA
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

// Funcion de la barra de búsqueda (toggle)

// -------------------------


btnSearch.addEventListener('click', () => {

    inputBusqueda.classList.toggle('active');

    if (inputBusqueda.classList.contains('active')) {

        inputBusqueda.focus(); // Para que el usuario pueda escribir directo

    }

});

// 1. Selección de elementos (Asegurate que estos IDs existan en tu HTML)
const botonMenu = document.getElementById('btn-categorias');
const menuLateral = document.getElementById('menu-lateral-real');
const elOverlay = document.getElementById('overlay');
const botonCerrar = document.getElementById('btn-close-side');

// 2. Lógica de apertura
if (botonMenu && menuLateral && elOverlay) {
    botonMenu.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("Ingeniería: Abriendo menú...");
        menuLateral.classList.add('active');
        elOverlay.classList.add('active');
    });

    // 3. Lógica de cierre
    const cerrarMenu = () => {
        menuLateral.classList.remove('active');
        elOverlay.classList.remove('active');
    };

    if (botonCerrar) botonCerrar.onclick = cerrarMenu;
    elOverlay.onclick = cerrarMenu;
} else {
    // Si ves este error en la consola (F12), es porque un ID está mal escrito
    console.error("Error de IDs: Revisá que el nav sea 'menu-lateral-real' y el botón 'btn-categorias'");
}

// 1. Buscamos todos los ítems de la lista en el menú lateral real
const itemsCategorias = document.querySelectorAll('#menu-lateral-real .menu-links li');

// --- EN EL EVENTO DE CLIC DEL MENÚ LATERAL ---
itemsCategorias.forEach(item => {
    item.addEventListener('click', () => {
        const valor = item.getAttribute('data-value');

        // 1. Forzamos el valor en el select oculto
        selectCategoria.value = valor;

        console.log("Ingeniería: Categoría seleccionada ->", valor);

        // 2. Llamamos al filtro
        filtrarProductos();

        // 3. Cerramos el menú
        document.getElementById('menu-lateral-real').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    });
});

// -------------------------

// INICIALIZACIÓN

// -------------------------



cargarCarritoDesdeLS(); // primero traemos lo que ya había

cargarProductos();      // y después cargamos los productos

actualizarContadorCarrito();//actualiza contador de productos en el carrito