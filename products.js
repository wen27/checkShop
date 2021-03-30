const productDOM = document.querySelector(".productsList");
const cartDOM = document.querySelector(".cart");
const cartContent = document.querySelector(".cart__centent");
// const openCart = document.querySelector(".cart__icon");
const openCart = document.querySelector(".cartNav");
const closeCart = document.querySelector(".close__cart");
const overlay = document.querySelector(".cart__overlay");
const cartTotal = document.querySelector(".cart__total");
const clearCartBtn = document.querySelector(".clear__cart");
const itemTotals = document.querySelector(".item__total");
const succbtn = document.querySelector(".success__cart");
const succlay = document.querySelector(".succAlert__overlay");
const succAlert = document.querySelector(".succAlert");
const message = document.querySelector(".mess");

let cart = [];

let buttonDOM = [];

//display UI to products.html Page
class UI {
  displayProducts(products) {
    let results = "";
    products.forEach(({id,name,price,imageUrl,des}) => {
      results += `
      <div class="col-sm-4">
        <div class="image__container">
          <img src=${imageUrl} alt="" /> 
          <div class="price"> <span>${name}</span> NT : ${price} 元</div>
          <p>${des}</p>
          <button class="btn addToCart" data-id= ${id} >加入購物車</button>
        </div>
      </div>`
    });
    productDOM.innerHTML = results;
  }
 
  getButtons() {
    const buttons = [...document.querySelectorAll(".addToCart")];
    buttonDOM = buttons;
    buttons.forEach(button => {
      const id = button.dataset.id;
      const inCart = cart.find(item => item.id === parseInt(id, 10));

      if (inCart) {
        button.innerText = "已加入購物車";
        button.disabled = true;
      }

      button.addEventListener("click", e => {
        e.preventDefault();
        e.target.innerHTML = "已加入購物車";
        e.target.disabled = true;

        // Get product from products
        const cartItem = { ...Storage.getProduct(id), amount: 1 };

        // Add product to cart
        cart = [...cart, cartItem];

        // save the cart in local storage
        Storage.saveCart(cart);
        // set cart values
        this.setItemValues(cart);
        // display the cart item
        this.addCartItem(cartItem);
        // show the cart
      });
    });
  }

  setItemValues(cart) {
    let tempTotal = 0;
    let itemTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal);
    itemTotals.innerText = itemTotal;
  }

  addCartItem({ id,name,price,imageUrl, }) {
    const div = document.createElement("div");
    div.classList.add("cart__item");
    div.innerHTML = `
    <img src=${imageUrl}>
          <div>
            <h3>${name}</h3>
            <h3 class="price">$${price}</h3>
          </div>
          <div>
            <span class="increase" data-id=${id}>
              <svg>
                <use xlink:href="./images/sprite.svg#icon-angle-up"></use>
              </svg>
            </span>
            <p class="item__amount">1</p>
            <span class="decrease" data-id=${id}>
              <svg>
                <use xlink:href="./images/sprite.svg#icon-angle-down"></use>
              </svg>
            </span>
          </div>

            <span class="remove__item" data-id=${id}>
              <svg>
                <use xlink:href="./images/sprite.svg#icon-trash"></use>
              </svg>
            </span>

        </div>`;
    cartContent.appendChild(div);
  }

  show() {
    cartDOM.classList.add("show");
    overlay.classList.add("show");
  }

  hide() {
    cartDOM.classList.remove("show");
    overlay.classList.remove("show");
  }

  setAPP() {
    cart = Storage.getCart();
    this.setItemValues(cart);
    this.populate(cart);
    openCart.addEventListener("click", this.show);
    closeCart.addEventListener("click", this.hide);
  }

  populate(cart) {
    cart.forEach(item => this.addCartItem(item));
  }

  cartLogic() {
    // Clear Cart
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
      this.hide();
    });
    // Order competed
    succbtn.addEventListener("click",()=>{
      this.hide();
      this.SuccessOrder();
    });
    // Cart Functionality
    cartContent.addEventListener("click", e => {
      e.preventDefault();
      const target = e.target.closest("span");
      const targetElement = target.classList.contains("remove__item");
      if (!target) return;

      if (targetElement) {
        const id = parseInt(target.dataset.id);
        this.removeItem(id);
        cartContent.removeChild(target.parentElement);
      } else if (target.classList.contains("increase")) {
        const id = parseInt(target.dataset.id, 10);
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount++;
        Storage.saveCart(cart);
        this.setItemValues(cart);
        target.nextElementSibling.innerText = tempItem.amount;
      } else if (target.classList.contains("decrease")) {
        const id = parseInt(target.dataset.id, 10);
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount--;
        if(tempItem.amount === 0) {
          this.Ordershow();
          setTimeout(this.Orderhide ,1000);
          message.innerHTML = '<i class="fa fa-check-circle"></i>&nbsp;商品不能少於1件';
          return;
        }
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setItemValues(cart);
          target.previousElementSibling.innerText = tempItem.amount;
        } else {
          this.removeItem(id);
          cartContent.removeChild(target.parentElement.parentElement);
        }
      }
    });
  }

  clearCart() {
    const cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }

  Ordershow() {
    succAlert.classList.add("show");
    succlay.classList.add("show");
  }

  Orderhide() {
    succAlert.classList.remove("show");
    succlay.classList.remove("show");
  }
  SuccessOrder(){
    cart = Storage.getCart();

    if(cart.length > 0){
      this.clearCart();
      this.Ordershow();
      setTimeout(this.Orderhide ,2000);
      message.innerHTML = '<i class="fa fa-check-circle"></i>&nbsp;購買成功';
    }else {
      this.Ordershow();
      setTimeout(this.Orderhide ,2000);
      message.innerHTML = '<i class="fa fa-exclamation-triangle"></i>&nbsp;購物車沒有清單';
    }
  }
  
  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setItemValues(cart);
    Storage.saveCart(cart);

    let button = this.singleButton(id);
    button.disabled = false;
    button.innerText = "加入購物車";
  }

  singleButton(id) {
    return buttonDOM.find(button => parseInt(button.dataset.id) === id);
  }
}
//Get products.json data
class Products {
  async getProducts() {
    try {
      const result = await fetch("products.json");
      const data = await result.json();
      const products = data.items;
      return products;
    } catch (err) {
      console.log(err);
    }
  }
}

// Save to localStorage
class Storage {
  static saveProduct(obj) {
    localStorage.setItem("products", JSON.stringify(obj));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getProduct(id) {
    const products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === parseFloat(id, 10));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const productList = new Products();
  const ui = new UI();

  ui.setAPP();

  const products = await productList.getProducts();
  ui.displayProducts(products);
  Storage.saveProduct(products);
  ui.getButtons();
  ui.cartLogic();
});
const navOpen = document.querySelector("#navOpen");
const navClose = document.querySelector("#navClose");
const menuList = document.querySelector(".menu_list")
navOpen.addEventListener("click",function(){
  menuList.style.display = "block";
  navOpen.style.display = "none";
  navClose.style.display = "block";

})
navClose.addEventListener("click",function(){
  menuList.style.display = "none";
  navClose.style.display = "none";
  navOpen.style.display = "block"; 
})


