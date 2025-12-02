// cart.js

let cart = [];

// 1. Cargar carrito desde localStorage
export function loadCart() {
  const saved = localStorage.getItem('cart');
  cart = saved ? JSON.parse(saved) : [];
  return cart;
}

// 2. Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 3. Agregar producto al carrito
export function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.cantidad += 1;
  } else {
    cart.push({
      ...product,
      cantidad: 1
    });
  }

  saveCart();
  console.log('Carrito actualizado:', cart);
}