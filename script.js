fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    const listContainer = document.getElementById("list");
    const cartCount = document.getElementById("cart-count");
    const cartBottom = document.getElementById("cart-bottom");
    const emptyCart = document.getElementById("empty-cart");
    const confirmation = document.getElementById("confirmation");
    confirmation.style.display = "none";

    let orderConfirmed = false;

    cartBottom.style.display = "none";
    emptyCart.style.display = "block";

    cartCount.innerText = "Your Cart (0)";
    let cart = [];

    data.forEach((item) => {
      item.count = 0; // Initialize count property for each item

      listContainer.innerHTML += `<div id="${item.name}" class="item">
        <div data-name="${item.name}" id="image-wrapper-${
        item.name
      }" class="image-wrapper">     
          <img class="item-image" src="${item.image.mobile}" />
        </div>
        <div class="button-container">
          <div id="button-${item.name}" data-name="${
        item.name
      }" class="add-to-cart">
            <div id="add-to-cart-${item.name}" class="add-to-cart-btn">
            <img src="./assets/images/icon-add-to-cart.svg"/>
            <span>Add to Cart</span>
            </div>
            <div id="quantity-controls-${
              item.name
            }" class="quantity-controls" style="display: none;">
              <img id="increment-btn-${item.name}" data-name="${
        item.name
      }" src="./assets/images/icon-increment-quantity.svg"/>
              <span id="item-count-${item.name}">0</span>
              <img id="decrement-btn-${item.name}" data-name="${
        item.name
      }" src="./assets/images/icon-decrement-quantity.svg"/>
            </div>
          </div>
        </div>
        <p class="item-category">${item.category}</p>
        <h3 class="item-name"><strong>${item.name}</strong></h3>
        <p class="item-price">$${item.price.toFixed(2)}</p>
      </div>`;
    });

    function showModalDisplay(cart) {
      orderConfirmed = true;
      confirmation.style.display = "block";
      const orderTotal = document.getElementById("modal-total");

      const orderList = document.getElementById("order-list");

      let total = 0;
      let itemCount = 0;

      orderList.innerHTML = "";

      cart.forEach((item) => {
        if (item.count > 0) {
          total += item.price * item.count;

          orderList.innerHTML += `<div class="order-item">
          <div class="thumbnail">
            <img src="${item.image.mobile}"/>
             <div class="left">
              <h5>${item.name}</h5>
              <span class="cart-item-count"><strong>${
                item.count
              }x</strong></span>
              <span class="cart-item-price">@ $${item.price.toFixed(2)}</span>
              
            </div>
          </div>
           
            <div class="right">
             <span class="cart-item-total">$${(item.price * item.count).toFixed(
               2
             )}</span>
          </div>`;
        }
      });
      orderTotal.textContent = `$${total.toFixed(2)}`;
    }

    function updateCartDisplay(cart) {
      const cartList = document.getElementById("cart");
      const orderTotal = document.getElementById("order-total");
      let total = 0;
      let itemCount = 0;

      cartList.innerHTML = "";
      const orderList = document.getElementById("order-list");

      cart.forEach((item) => {
        if (item.count > 0) {
          total += item.price * item.count;
          itemCount += item.count;

          cartList.innerHTML += `<div class="cart-item">
            <div class="left">
              <h5>${item.name}</h5>
              <span class="cart-item-count"><strong>${
                item.count
              }x</strong></span>
              <span class="cart-item-price">@ $${item.price.toFixed(2)}</span>
              <span class="cart-item-total">$${(
                item.price * item.count
              ).toFixed(2)}</span>
            </div>
            <div class="right">
              <img class="remove-button" data-name="${
                item.name
              }" src="./assets/images/icon-remove-item.svg"/>
            </div>
          </div>`;
        }
      });

      orderTotal.innerHTML = `$${total.toFixed(2)}`;
      cartCount.textContent = `Your Cart (${itemCount})`;

      if (itemCount === 0) {
        cartBottom.style.display = "none";
        emptyCart.style.display = "block";
      } else {
        cartBottom.style.display = "block";
        emptyCart.style.display = "none";
      }

      const removeButtons = document.querySelectorAll(".remove-button");

      removeButtons.forEach((btn) => {
        btn.addEventListener("click", function (event) {
          const itemName = event.currentTarget.getAttribute("data-name");
          const item = data.find((i) => i.name === itemName);
          if (item.count > 0) {
            item.count = 0;
            const addToCartBtn = document.getElementById(
              `add-to-cart-${item.name}`
            );
            const quantityControls = document.getElementById(
              `quantity-controls-${item.name}`
            );
            addToCartBtn.style.display = "flex";
            quantityControls.style.display = "none";
            const imageWrapper = document.getElementById(
              `image-wrapper-${item.name}`
            );
            imageWrapper.style.border = "none";
            updateCartDisplay(cart);
          }
        });
      });

      const confirmButton = document.getElementById("confirm-button");

      confirmButton.addEventListener("click", function (event) {
        showModalDisplay(cart);
      });
    }

    data.forEach((item) => {
      const addToCartBtn = document.getElementById(`add-to-cart-${item.name}`);
      const quantityControls = document.getElementById(
        `quantity-controls-${item.name}`
      );
      const imageWrapper = document.getElementById(
        `image-wrapper-${item.name}`
      );

      addToCartBtn.addEventListener("click", function () {
        item.count++;
        document.getElementById(`item-count-${item.name}`).textContent =
          item.count;
        addToCartBtn.style.display = "none";
        quantityControls.style.display = "block";
        imageWrapper.style.border = "2px solid hsl(14, 86%, 42%)";

        if (!cart.includes(item)) {
          cart.push(item);
        }
        updateCartDisplay(cart);
      });

      const incrementBtn = document.getElementById(
        `increment-btn-${item.name}`
      );
      incrementBtn.addEventListener("click", function () {
        item.count++;
        document.getElementById(`item-count-${item.name}`).textContent =
          item.count;
        updateCartDisplay(cart);
      });

      const decrementBtn = document.getElementById(
        `decrement-btn-${item.name}`
      );
      decrementBtn.addEventListener("click", function () {
        if (item.count > 0) {
          item.count--;
          document.getElementById(`item-count-${item.name}`).textContent =
            item.count;
          if (item.count === 0) {
            addToCartBtn.style.display = "flex";
            imageWrapper.style.border = "none";

            quantityControls.style.display = "none";
            cart = cart.filter((i) => i.name !== item.name);
          }
          updateCartDisplay(cart);
        }
      });
    });

    const newOrder = document.getElementById("new-order");
    newOrder.addEventListener("click", function (event) {
      orderConfirmed = false;
      confirmation.style.display = "none";
    });
  });
