// products page favorites + contact form checker
// (touchstone project)

// key for saving favorites in localStorage
var favKey = "nsBakeryFavorites";

// grabs the array of favorites from local storage
// if theres nothing saved yet it just returns an empty array
function getFavorites() {
  var saved = localStorage.getItem(favKey);
  if (saved == null) {
    return [];
  }
  return JSON.parse(saved);
}

function saveFavorites(favArr) {
  localStorage.setItem(favKey, JSON.stringify(favArr));
}

// figures out the product name from the card (h3 has the price in it too
// so i have to strip that part out)
function getProductName(card) {
  var heading = card.querySelector("h3");
  var priceSpan = heading.querySelector(".price");
  var name = heading.textContent;
  if (priceSpan) {
    name = name.replace(priceSpan.textContent, "");
  }
  return name.trim();
}

// adds/removes an item from favorites when you click the button
function toggleFavorite(name) {
  var favs = getFavorites();
  var index = favs.indexOf(name);

  if (index == -1) {
    // not a favorite yet, add it
    favs.push(name);
  } else {
    // already favorited, remove it
    favs.splice(index, 1);
  }

  saveFavorites(favs);
  return favs;
}

function makeFavBtn(name) {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn";

  // set how it looks to start
  var favs = getFavorites();
  if (favs.indexOf(name) != -1) {
    btn.textContent = "★ Favorited";
    btn.classList.add("favorited");
  } else {
    btn.textContent = "☆ Add to Favorites";
  }

  btn.addEventListener("click", function () {
    var updatedFavs = toggleFavorite(name);

    if (updatedFavs.indexOf(name) != -1) {
      btn.textContent = "★ Favorited";
      btn.classList.add("favorited");
    } else {
      btn.textContent = "☆ Add to Favorites";
      btn.classList.remove("favorited");
    }

    renderFavoritesSummary(updatedFavs);
  });

  return btn;
}

// updates the little "My Favorites" box at the top of the page
function renderFavoritesSummary(favs) {
  var box = document.getElementById("favorites-summary");
  if (!box) return;

  if (favs.length === 0) {
    box.innerHTML = "<h2>My Favorites</h2><p>You haven't favorited anything yet. Click \"Add to Favorites\" on any item below.</p>";
    return;
  }

  var html = "<h2>My Favorites</h2><ul>";
  for (var i = 0; i < favs.length; i++) {
    html += "<li>" + favs[i] + "</li>";
  }
  html += "</ul>";
  box.innerHTML = html;
}

function setupFavoritesBox() {
  var intro = document.querySelector(".page-intro");
  if (!intro) return;

  var box = document.createElement("div");
  box.id = "favorites-summary";
  intro.insertAdjacentElement("afterend", box);
}

// runs on the products page only
function initProducts() {
  var cards = document.querySelectorAll(".product-card");
  if (cards.length === 0) {
    return; // not on the products page, skip all this
  }

  setupFavoritesBox();

  for (var i = 0; i < cards.length; i++) {
    var name = getProductName(cards[i]);
    var btn = makeFavBtn(name);
    cards[i].appendChild(btn);
  }

  renderFavoritesSummary(getFavorites());
}


// ------ contact form stuff below ------

// pretty basic email check, not perfect but catches the obvious stuff
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showFieldError(field, msg) {
  // check if we already made an error box for this field
  var next = field.nextElementSibling;
  var errBox;

  if (next && next.classList.contains("error-message")) {
    errBox = next;
  } else {
    errBox = document.createElement("span");
    errBox.className = "error-message";
    field.insertAdjacentElement("afterend", errBox);
  }

  errBox.textContent = msg;

  if (msg) {
    field.classList.add("invalid-field");
  } else {
    field.classList.remove("invalid-field");
  }
}

function checkName() {
  var field = document.getElementById("name");
  var val = field.value.trim();

  if (val === "") {
    showFieldError(field, "Please enter your name.");
    return false;
  }
  if (val.length < 2) {
    showFieldError(field, "Name must be at least 2 characters.");
    return false;
  }

  showFieldError(field, "");
  return true;
}

function checkEmail() {
  var field = document.getElementById("email");
  var val = field.value.trim();

  if (val === "") {
    showFieldError(field, "Please enter your email address.");
    return false;
  }
  if (!emailRegex.test(val)) {
    showFieldError(field, "Please enter a valid email, like name@example.com");
    return false;
  }

  showFieldError(field, "");
  return true;
}

function checkRequestType() {
  var field = document.getElementById("request-type");
  if (field.value === "") {
    showFieldError(field, "Please choose a request type.");
    return false;
  }
  showFieldError(field, "");
  return true;
}

function checkItems() {
  var field = document.getElementById("items");
  var val = field.value.trim();

  if (val === "") {
    showFieldError(field, "Please tell us what you're looking for.");
    return false;
  }
  if (val.length > 500) {
    showFieldError(field, "Please keep this under 500 characters.");
    return false;
  }

  showFieldError(field, "");
  return true;
}

function initContactForm() {
  var form = document.querySelector(".contact-layout form");
  if (!form) {
    return; // not on the contact page
  }

  // check fields again as the user types so the error goes away
  document.getElementById("name").addEventListener("input", checkName);
  document.getElementById("email").addEventListener("input", checkEmail);
  document.getElementById("request-type").addEventListener("change", checkRequestType);
  document.getElementById("items").addEventListener("input", checkItems);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nameOk = checkName();
    var emailOk = checkEmail();
    var typeOk = checkRequestType();
    var itemsOk = checkItems();

    // console.log(nameOk, emailOk, typeOk, itemsOk);

    if (!nameOk || !emailOk || !typeOk || !itemsOk) {
      return;
    }

    // no backend for this yet so just show an alert
    alert("Thanks! Your request has been received. We'll be in touch soon to confirm details.");
    form.reset();
  });
}

initProducts();
initContactForm();
