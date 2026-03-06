// -------------------------
// REFERENCIAS AL DOM
// -------------------------
const cartItemsContainer = document.querySelector("#cart-items");
const cartEmptyText = document.querySelector("#cart-empty");
const cartTotalText = document.querySelector("#cart-total");
const btnVaciar = document.querySelector("#vaciar-carrito");
let btnFinalizar = document.querySelector("#finalizar-compra");

// Si el botón finalizar no existe, lo creamos
if (!btnFinalizar) {
  btnFinalizar = document.createElement("button");
  btnFinalizar.id = "finalizar-compra";
  btnFinalizar.className = "btn-finalizar";
  btnFinalizar.textContent = "💳 Finalizar Compra";
  
  if (cartTotalText && cartTotalText.parentNode) {
    const contenedor = document.createElement("div");
    contenedor.style.display = "flex";
    contenedor.style.justifyContent = "flex-end";
    contenedor.style.margin = "20px 0";
    contenedor.appendChild(btnFinalizar);
    cartTotalText.parentNode.appendChild(contenedor);
  } else {
    document.body.appendChild(btnFinalizar);
  }
}

// Carrito local
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
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = "";

  if (!carrito.length) {
    if (cartEmptyText) cartEmptyText.style.display = "block";
    if (cartTotalText) cartTotalText.textContent = "Total: $0";
    return;
  }

  if (cartEmptyText) cartEmptyText.style.display = "none";

  carrito.forEach((item) => {
    const row = document.createElement("div");
    row.classList.add("cart-row");

    row.innerHTML = `
      <div class="cart-item">
        <img src="${item.imagen}" alt="${item.nombre}" class="cart-img">
        <div class="cart-detalle">
          <h3>${item.nombre}</h3>
          <p class="cart-price">$${item.precio.toLocaleString("es-AR")}</p>
          <div class="cart-qty">
            <button class="btn-menos" data-id="${item.id}">-</button>
            <span>${item.cantidad}</span>
            <button class="btn-mas" data-id="${item.id}">+</button>
          </div>
          <p class="cart-subtotal">
            Subtotal: $${(item.precio * item.cantidad).toLocaleString("es-AR")}
          </p>
          <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(row);
  });

  const total = calcularTotal();
  if (cartTotalText) cartTotalText.textContent = `Total: $${total.toLocaleString("es-AR")}`;
}

// -------------------------
// VACIAR CARRITO
// -------------------------
if (btnVaciar) {
  btnVaciar.addEventListener("click", () => {
    if (confirm("¿Seguro que querés vaciar el carrito?")) {
      carrito = [];
      guardarCarritoEnLS();
      renderCarrito();
    }
  });
}

// -------------------------
// MÉTODOS DE PAGO (3 OPCIONES CON SUB-OPCIONES)
// -------------------------
function mostrarMetodosPago() {
  return new Promise((resolve) => {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'pago-overlay';
    
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'pago-modal';
    
    // Contenido del modal (3 opciones principales)
    modal.innerHTML = `
      <div class="pago-modal-header">
        <h2>💳 ELEGÍ TU MÉTODO DE PAGO</h2>
        <p class="pago-subheader">(ninguno funciona, es parte de la experiencia)</p>
      </div>
      
      <div class="pago-grid">
        <!-- DÉBITO -->
        <div class="pago-opcion" data-metodo="debito">
          <span class="pago-emoji">💳</span>
          <span class="pago-nombre">Tarjeta de Débito</span>
          <span class="pago-estado">(Visa, Mastercard, Cabal, etc)</span>
        </div>
        
        <!-- CRÉDITO -->
        <div class="pago-opcion" data-metodo="credito">
          <span class="pago-emoji">🏦</span>
          <span class="pago-nombre">Tarjeta de Crédito</span>
          <span class="pago-estado">(Visa, Mastercard, American Express)</span>
        </div>
        
      <!-- MERCADO PAGO CON LOGO -->
<div class="pago-opcion" data-metodo="mercadopago">
  <img src="Iconos/logoMP.svg" style="width: 200px; height: auto; margin-bottom: 5px;">
  <span class="pago-nombre">Mercado Pago</span>
  <span class="pago-estado">(dinero congelado)</span>
</div>
      
      <div class="pago-modal-footer">
        <button class="pago-cerrar">❌ Cancelar compra</button>
      </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Sub-opciones para cada método
    const subOpciones = {
      'debito': [
        { nombre: 'Visa Débito', frase: '❌ Visa Débito? No hay saldo... como tu cuenta bancaria' },
        { nombre: 'Mastercard Débito', frase: '❌ Mastercard Débito? Master-deuda, mejor no' },
        { nombre: 'Cabal Débito', frase: '❌ Cabal? Cable a tierra... no funciona' },
        { nombre: 'Maestro', frase: '❌ Maestro? El único maestro acá es el que te está cagando' }
      ],
      'credito': [
        { nombre: 'Visa Crédito', frase: '❌ Visa? Rechazada. Probá con una de trueque' },
        { nombre: 'Mastercard Crédito', frase: '❌ Mastercard? Master-cagada, no hay crédito' },
        { nombre: 'American Express', frase: '❌ Amex? No expreses más, no funciona' },
        { nombre: 'Naranja', frase: '❌ Naranja? Está exprimida, no queda nada' }
      ],
      'mercadopago': [
        { nombre: 'Mercado Pago', frase: '❌ Dinero congelado por 90 días (o 90 años)' },
        { nombre: 'Mercado Crédito', frase: '❌ Te prestamos? No, mejor no' }
      ]
    };
    
    // Frases generales por si no hay sub-opciones
    const frasesGenericas = [
      '❌ Rechazado. Como tu última cita',
      '❌ Fondos insuficientes... en tu cuenta y en tu vida',
      '❌ Error 404: dinero no encontrado',
      '❌ No funciona. Como el bondi cuando llueve'
    ];
    
    // Event listeners para las opciones principales
    modal.querySelectorAll('.pago-opcion').forEach(opcion => {
      opcion.addEventListener('click', function() {
        const metodo = this.dataset.metodo;
        const opciones = subOpciones[metodo] || [];
        
        // Si hay sub-opciones, mostrarlas
        if (opciones.length > 0) {
          // Crear selector de sub-opciones
          const subMenu = document.createElement('div');
          subMenu.className = 'pago-submenu';
          subMenu.innerHTML = `
            <h3>Elegí tu tarjeta:</h3>
            ${opciones.map((op, i) => 
              `<button class="pago-subopcion" data-frase="${op.frase}">${op.nombre}</button>`
            ).join('')}
            <button class="pago-volver">⬅️ Volver</button>
          `;
          
          // Reemplazar el grid con el submenu
          const grid = modal.querySelector('.pago-grid');
          grid.style.display = 'none';
          modal.insertBefore(subMenu, modal.querySelector('.pago-modal-footer'));
          
          // Event listeners para sub-opciones
          subMenu.querySelectorAll('.pago-subopcion').forEach(btn => {
            btn.addEventListener('click', function() {
              const frase = this.dataset.frase || frasesGenericas[Math.floor(Math.random() * frasesGenericas.length)];
              alert(frase);
              
              // Easter egg: después de 3 intentos
              const intentos = this.dataset.intentos || 0;
              this.dataset.intentos = Number(intentos) + 1;
              
              if (this.dataset.intentos >= 3) {
                setTimeout(() => {
                  if (confirm('🎉 ¡Milagro! Por insistente, te dejamos comprar. ¿Aceptás?')) {
                    document.body.removeChild(overlay);
                    resolve(true);
                  }
                }, 500);
              }
            });
          });
          
          // Volver al menú principal
          subMenu.querySelector('.pago-volver').addEventListener('click', () => {
            subMenu.remove();
            grid.style.display = 'grid';
          });
          
        } else {
          // Si no hay sub-opciones, mensaje genérico
          const fraseRandom = frasesGenericas[Math.floor(Math.random() * frasesGenericas.length)];
          alert(fraseRandom);
          
          // Efecto visual
          this.style.animation = 'pago-error 0.3s';
          setTimeout(() => {
            this.style.animation = '';
          }, 300);
        }
      });
    });
    
    // Cerrar modal
    modal.querySelector('.pago-cerrar').addEventListener('click', () => {
      document.body.removeChild(overlay);
      resolve(false);
    });
    
    // Cerrar si tocan el fondo
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        resolve(false);
      }
    });
  });
}

// -------------------------
// FINALIZAR COMPRA
// -------------------------
if (btnFinalizar) {
  btnFinalizar.addEventListener("click", async () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío 😓");
      return;
    }

    const resultado = await mostrarMetodosPago();
    
    if (resultado === false) {
      alert("Compra cancelada. Seguí intentando...");
      return;
    }

    alert("🎉 ¡Felicitaciones! Por insistente, lograste comprar. Tu pedido se procesó (en un universo paralelo).");

    carrito = [];
    guardarCarritoEnLS();
    renderCarrito();

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  });
}

// -------------------------
// MANEJO DE BOTONES (+, -, x)
// -------------------------
if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains("btn-mas")) {
      const item = carrito.find((p) => p.id === id);
      if (!item) return;

      if (item.stock && item.cantidad >= item.stock) {
        alert("No podés agregar más, no hay stock disponible.");
        return;
      }

      item.cantidad += 1;
    }

    if (e.target.classList.contains("btn-menos")) {
      const item = carrito.find((p) => p.id === id);
      if (!item) return;

      if (item.cantidad > 1) {
        item.cantidad -= 1;
      } else {
        carrito = carrito.filter((p) => p.id !== id);
      }
    }

    if (e.target.classList.contains("btn-eliminar")) {
      carrito = carrito.filter((p) => p.id !== id);
    }

    guardarCarritoEnLS();
    renderCarrito();
  });
}

// -------------------------
// INICIALIZAR
// -------------------------
cargarCarritoDesdeLS();
renderCarrito();