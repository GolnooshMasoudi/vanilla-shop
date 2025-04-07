import { productsData } from "./products.js";
const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDOM = document.querySelector(".products-center");

let cart = [];
class Products {
  // I could get it from api too!
  getProducts() {
    return productsData;
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
          <div class="img-container">
            <img src=${item.imageUrl} class="product-img" />
          </div>
          <div class="product-desc">
            <p class="product-price">$ ${item.price}</p>
            <p class="product-title">${item.title}</p>
          </div>
          <button class="btn add-to-cart" data-id=${item.id}>
            <i class="fas fa-shopping-cart"></i>
            add to cart
          </button>
        </div>`;
      productsDOM.innerHTML = result;
    });
  }

  getAddTocartBtns() {
    const addTocartBtns = document.querySelectorAll(".add-to-cart");
    // console.log(addTocartBtns);
    const buttons = [...addTocartBtns];
    // console.log(buttons);
    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      console.log(id);
      //check if this product id is in the cart or not!
      const isInCart = cart.find((p) => {
        p.id === id;
      });
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        console.log(event.target.dataset.id);
        event.target.innerText = "In Cart";
        event.target.disabled = true;

        //get product from product
        const addedProduct = Storage.getProduct(id);
        console.log(addedProduct);
        //add to cart
        cart = [...cart, { ...addedProduct, quantity: 1 }];
        //save cart to local storage
        Storage.saveCart(cart);
        //update cart value
        //add to cart item
      });
    });
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  // console.log(productsData);
  const ui = new UI();
  ui.displayProducts(productsData);
  Storage.saveProducts(productsData);
  ui.getAddTocartBtns();
});

//cart items modal
function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
