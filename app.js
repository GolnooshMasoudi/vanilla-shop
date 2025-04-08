import { productsData } from "./products.js";
const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDOM = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

let cart = [];

let buttonsDOM = [];
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
          <button class="btn add-to-cart" data-id=${item.id}>add to cart</button>
        </div>`;
      productsDOM.innerHTML = result;
    });
  }

  getAddTocartBtns() {
    const addTocartBtns = [...document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addTocartBtns;
    // console.log(addTocartBtns);
    // console.log(buttons);
    addTocartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      console.log(id);
      //check if this product id is in the cart or not!
      const isInCart = cart.find((p) => {
        p.id === id;
        parseInt(id);
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
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
        // console.log(addedProduct);

        //add to cart
        cart = [...cart, addedProduct];

        //save cart to local storage
        Storage.saveCart(cart);
        //update cart value
        //add to cart item
        this.setCartValue(cart);
        this.addCartItems(addedProduct);
      });
    });
  }
  setCartValue(cart) {
    //cart items
    //cart total price
    let tempCartItems = 0; //! current cart Items
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerHTML = `totalPrice = ${totalPrice.toFixed(2)} $`;
    cartItems.innerText = tempCartItems;
    // console.log(tempCartItems);
  }
  addCartItems(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <img class="cart-item-img" src=${cartItem.imageUrl} />
            <div class="cart-item-desc">
              <h4>${cartItem.title}</h4>
              <h5>$ ${cartItem.price}</h5>
            </div>
            <div class="cart-item-conteoller">
              <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
              <p>${cartItem.quantity}</p>
              <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
            </div>
            <i class="fa-regular fa-trash-can" data-id=${cartItem.id}></i>`;
    cartContent.appendChild(div);
  }
  setUpApp() {
    //get cart from storage
    cart = Storage.getCart() || [];
    //add cart Item and show in the modal
    cart.forEach((cartItem) => this.addCartItems(cartItem));
    //set values :price + items
    this.setCartValue(cart);
  }
  cartLogic() {
    //clear cart
    clearCart.addEventListener("click", () => this.clearCart());
    //cart functionality
    cartContent.addEventListener("click", (event) => {
      // console.log(event.target);
      if (event.target.classList.contains("fa-chevron-up")) {
        console.log("add");
        console.log(event.target.dataset.id);
        const addQuantity = event.target;
        //get item from cart
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addedItem.quantity++;
        //update cart value
        this.setCartValue(cart);
        //save cart
        Storage.saveCart(cart);
        //update cart item in UI
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        // console.log("down");
        const subQuantity = event.target;
        //get item from cart
        const substractedItem = cart.find(
          (cItem) => cItem.id == subQuantity.dataset.id
        );
        if ((substractedItem.quantity = 1)) {
          this.removeItem(substractedItem.id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        substractedItem.quantity--;
        //update cart value
        this.setCartValue(cart);
        //save cart
        Storage.saveCart(cart);
        //update cart item in UI
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      } else if (event.target.classList.contains("fa-trash-can")) {
        // console.log("delete");
        const removeItem = event.target;
        const _removedItem = cart.find((c) => c.id == removeItem.dataset.id);
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
        //remove from cartItem
        //removem method
      }
    });
  }
  removeItem(id) {
    // console.log("removeItem triggered");
    // console.log(id);
    //! update cart
    cart = cart.filter((cItem) => cItem.id !== id);
    //update total price and cart items
    this.setCartValue(cart);
    //update storage
    Storage.saveCart(cart);
    //get add to cart btn
    this.getSingleButton(id);
  }
  clearCart() {
    //remove

    cart.forEach((cItem) => this.removeItem(cItem.id));
    //remove cart content children
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  getSingleButton(id) {
    const button = buttonsDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "add to cart";
    button.disabled = false;
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
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  // console.log(productsData);
  const ui = new UI();
  //set up: go to local storage and get carts and set up app
  ui.setUpApp();

  ui.displayProducts(productsData);
  Storage.saveProducts(productsData);
  ui.getAddTocartBtns();
  ui.cartLogic();
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
