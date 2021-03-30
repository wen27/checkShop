const productDOM = document.querySelector(".productsList");
const HtmlProductUi = document.querySelector(".services-ui")

//display UI to products.html Page
class UI {
  
  displayHtmlProducts(products) {
    let data = "";
    products.forEach(({name,price,imageUrl,type}) => {
      data += `
      <div class="col-sm-4">
      <ul class="agile_services_bottom_l_grid1">
      <li><img src="${imageUrl}"/></li>
      <li>${name}</li>
      <li>${price}</li>
      <li>
          <a href="products.html"><input type="button" value="前往商品" class="add_to_cart" /></a>
      </li>
      <div class="w3_service_bottom_grid_pos">
          <a href="# ">
              <p>${type}</p>
              <img src="/images/logoWhite.png ">
          </a>
      </div>
  </ul>
  </div>`
    });
    HtmlProductUi.innerHTML = data;
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
      alert('資料連線錯誤'+ err +',請聯繫服務人員');
    }
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  const productList = new Products();
  const ui = new UI();
  const products = await productList.getProducts();
  ui.displayHtmlProducts(products)

});

// //navTogg
// const cartNav = document.querySelector(".cartNav");
// cartNav.addEventListener("click",function(){
//   // menuList.style.display = "none";
//   '#toggle:checked~.menu_list'.style.display = "none";
// })

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


