
$(function () {
  // Main Menu JS
  $(window).scroll(function () {
    if ($(this).scrollTop() < 50) {
      $("nav").removeClass("site-top-nav");
      $("#back-to-top").fadeOut();
    } else {
      $("nav").addClass("site-top-nav");
      $("#back-to-top").fadeIn();
    }
  });

  // Shopping Cart Toggle JS
  $("#shopping-cart").on("click", function () {
    $("#cart-content").toggle("blind", "", 500);
  });

  // Back-To-Top Button JS
  $("#back-to-top").click(function (event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1000
    );
  });

  // Delete Cart Item JS
  $(document).on("click", ".btn-delete", function (event) {
    event.preventDefault();
    $(this).closest("tr").remove();
    updateTotal();
  });

  // Update Total Price JS
  function updateTotal() {
    let total = 0;
    $("#cart-content tr").each(function () {
      const rowTotal = parseFloat($(this).find("td:nth-child(5)").text().replace("$", ""));
      if (!isNaN(rowTotal)) {
        total += rowTotal;
      }
    });
    $("#cart-content th:nth-child(5)").text("$" + total.toFixed(2));
    $(".tbl-full th:nth-child(6)").text("$" + total.toFixed(2));
  }
});
// script.js

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".food-menu-box form input[type='submit']");
    const cartBadge = document.querySelector("#shopping-cart .badge");

    let cartCount = parseInt(cartBadge.textContent) || 0;

    addToCartButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault(); // prevent form refresh

            // get the quantity value from input[type="number"]
            const qtyInput = button.parentElement.querySelector("input[type='number']");
            let qty = parseInt(qtyInput.value) || 1;

            // update cart count
            cartCount += qty;
            cartBadge.textContent = cartCount;

            // Optional: show alert/notification
            alert(`${qty} item(s) added to cart!`);
        });
    });
});
// script.js

document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".food-menu-box form input[type='submit']");
    const cartBadge = document.querySelector("#shopping-cart .badge");
    const cartTable = document.querySelector(".cart-table");

    let cart = []; // store items in array

    // Function to update badge and cart table
    function updateCart() {
        // Update badge
        let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.textContent = totalQty;

        // Remove old rows (except header)
        let rows = cartTable.querySelectorAll("tr:not(:first-child)");
        rows.forEach(r => r.remove());

        // Add new rows
        let grandTotal = 0;
        cart.forEach((item, index) => {
            let row = document.createElement("tr");

            row.innerHTML = `
                <td><img src="${item.img}" alt="${item.name}" width="50"></td>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>$${(item.price * item.qty).toFixed(2)}</td>
                <td><a href="#" class="btn-delete" data-index="${index}">&times;</a></td>
            `;

            cartTable.appendChild(row);
            grandTotal += item.price * item.qty;
        });

        // Total row
        let totalRow = document.createElement("tr");
        totalRow.innerHTML = `
            <th colspan="4">Total</th>
            <th>$${grandTotal.toFixed(2)}</th>
            <th></th>
        `;
        cartTable.appendChild(totalRow);

        // Save cart to localStorage (so we can use in order.html)
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Add to cart
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            const foodBox = button.closest(".food-menu-box");
            const name = foodBox.querySelector("h4").textContent;
            const price = parseFloat(foodBox.querySelector(".food-price").textContent.replace("$", ""));
            const img = foodBox.querySelector("img").src;
            const qtyInput = foodBox.querySelector("input[type='number']");
            const qty = parseInt(qtyInput.value) || 1;

            // Check if item already exists in cart
            let existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty += qty;
            } else {
                cart.push({ name, price,qty });
            }

            updateCart();
        });
    });

    // Delete item
    cartTable.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-delete")) {
            e.preventDefault();
            const index = e.target.getAttribute("data-index");
            cart.splice(index, 1);
            updateCart();
        }
    });

    // Load cart if exists (for both index.html & order.html)
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        updateCart();
    }
});
// script.js

document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".food-menu-box form input[type='submit']");
    const cartBadge = document.querySelector("#shopping-cart .badge");
    const cartTable = document.querySelector(".cart-table");
    const confirmBtn = document.querySelector(".btn-primary[href='order.html']");
    const searchForm = document.querySelector(".food-search form");
    const searchInput = searchForm ? searchForm.querySelector("input[type='search']") : null;
    const foodBoxes = document.querySelectorAll(".food-menu-box");

    let cart = [];

    // Function to update badge and cart table
    function updateCart() {
        let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.textContent = totalQty;

        // Clear old rows (except header)
        let rows = cartTable.querySelectorAll("tr:not(:first-child)");
        rows.forEach(r => r.remove());

        // Insert items
        let grandTotal = 0;
        cart.forEach((item, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.img}" alt="${item.name}" width="50"></td>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>$${(item.price * item.qty).toFixed(2)}</td>
                <td><a href="#" class="btn-delete" data-index="${index}">&times;</a></td>
            `;
            cartTable.appendChild(row);
            grandTotal += item.price * item.qty;
        });

        if (cart.length > 0) {
            let totalRow = document.createElement("tr");
            totalRow.innerHTML = `
                <th colspan="4">Total</th>
                <th>$${grandTotal.toFixed(2)}</th>
                <th></th>
            `;
            cartTable.appendChild(totalRow);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Add to cart
    addToCartButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            const foodBox = button.closest(".food-menu-box");
            const name = foodBox.querySelector("h4").textContent;
            const price = parseFloat(foodBox.querySelector(".food-price").textContent.replace("$", ""));
            const img = foodBox.querySelector("img").src;
            const qtyInput = foodBox.querySelector("input[type='number']");
            const qty = parseInt(qtyInput.value) || 1;

            let existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty += qty;
            } else {
                cart.push({ name, price, img, qty });
            }

            updateCart();
        });
    });

    // Delete item
    cartTable.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-delete")) {
            e.preventDefault();
            const index = e.target.getAttribute("data-index");
            cart.splice(index, 1);
            updateCart();
        }
    });

    // Confirm Order → clear cart
    if (confirmBtn) {
        confirmBtn.addEventListener("click", (e) => {
            if (!confirm("Are you sure you want to confirm this order?")) {
                e.preventDefault();
                return;
            }
            // cart = [];
            // updateCart();
            // localStorage.removeItem("cart");
            // alert("Order confirmed! Thank you for ordering.");
        });
    }

    // Load cart from storage
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        updateCart();
    }

    // 🔍 Search Functionality
    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let query = searchInput.value.toLowerCase().trim();

            foodBoxes.forEach(box => {
                let foodName = box.querySelector("h4").textContent.toLowerCase();
                if (foodName.includes(query) || query === "") {
                    box.style.display = "block"; // show
                } else {
                    box.style.display = "none"; // hide
                }
            });
        });
    }
});

