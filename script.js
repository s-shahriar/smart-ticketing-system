var state = {
  ticketBought: 0,
  restSeats: 40,
  selectedSeats: [],
  price: 0,
  grandTotal: 0,
};

function moveToTicket() {
  const buyTicketsButton = document.getElementById("ticket-btn");
  const ticketSection = document.getElementById("ticket-section");
  buyTicketsButton.addEventListener("click", function () {
    ticketSection.scrollIntoView({ behavior: "smooth" });
  });
}

function applyOnClickHandler() {
  const seatRows = document.querySelectorAll(".seat-row");

  for (let i = 0; i < seatRows.length; i++) {
    const buttons = seatRows[i].querySelectorAll("button");
    for (let j = 0; j < buttons.length; j++) {
      buttons[j].addEventListener("click", seatClick);
    }
  }
}

function setElementValue(elementID, value) {
  if (elementID == "restSeats") {
    document.getElementById(elementID).innerText = value + " " + "seats left";
  } else {
    document.getElementById(elementID).innerText = value;
  }
}

function seatClick(event) {
  const { target } = event;
  const checkTick = target.classList.contains("selected");
  const seatName = target.id;

  if (!checkTick) {
    if (state.ticketBought + 1 <= 4) {
      state.ticketBought++;
      state.restSeats--;
      increase(target, state.ticketBought, state.restSeats, seatName);
    } else {
      alert("You can not buy more than 4 tickets");
    }
  } else {
    if (state.ticketBought - 1 < 4) {
      state.ticketBought--;
      state.restSeats++;
      decrease(target, state.ticketBought, state.restSeats, seatName);
    } else {
      alert("You can not buy more than 4 tickets");
    }
  }
}

function increase(target, ticketBought, restSeats, seatName) {
  setElementValue("restSeats", restSeats);
  setElementValue("ticketBought", ticketBought);
  target.classList.add("selected");
  state.selectedSeats.push(seatName);
  listChanger("increase", seatName);
  priceUpdate();
  couponEnabler();
  checkValidPurchase();
}

function decrease(target, ticketBought, restSeats, seatName) {
  setElementValue("restSeats", restSeats);
  setElementValue("ticketBought", ticketBought);
  target.classList.remove("selected");
  const removeItemIndex = state.selectedSeats.indexOf(seatName);
  state.selectedSeats.splice(removeItemIndex, 1);
  listChanger("decrease", seatName);
  priceUpdate();
  couponEnabler();
  checkValidPurchase();
}

function listChanger(option, seatName) {
  const ul = document.getElementById("seat-purchase");

  if (option == "increase") {
    const newLi = document.createElement("li");
    newLi.id = `_${seatName}`;
    newLi.innerHTML = `<div class="ticket-seat-info flex justify-between">
        <p>${seatName}</p>
        <p>Economy</p>
        <p>550</p>
      </div>`;
    ul.appendChild(newLi);
  }

  if (option == "decrease") {
    const existingLi = document.getElementById(`_${seatName}`);
    ul.removeChild(existingLi);
  }
}

function couponEnabler() {
  if (state.selectedSeats.length > 3) {
    const coupon = document.getElementById("coupon-btn");
    coupon.disabled = false;
  } else {
    const coupon = document.getElementById("coupon-btn");
    coupon.disabled = true;
  }
}

function checkValidPurchase() {
  const phoneNumberInput = document.querySelector('input[type="number"]');
  const phoneNumber = phoneNumberInput.value.trim() === "" ? false : true;
  const validSeat = state.selectedSeats.length > 0 ? true : false;

  if (phoneNumber && validSeat) {
    document.querySelector(".contact-btn").disabled = false;
  } else {
    document.querySelector(".contact-btn").disabled = true;
  }
}

function priceUpdate() {
  const initialprice = state.selectedSeats.length * 550;
  const couponValue = document.getElementById("coupon-input").value;

  if (couponValue) {
    if (couponValue === "NEW15" || couponValue === "Couple 20") {
      if (couponValue === "NEW15") {
        const offerPrice = initialprice * 0.15;
        state.price = initialprice - initialprice * 0.15;
        setElementValue("total-price", `${initialprice} BDT`);
        setElementValue("grand-total", `${state.price} BDT`);
        setElementValue("discount-total", `${offerPrice} BDT`);
        const coupon = document.getElementById("coupon-btn");
        coupon.disabled = true;
        const couponSpan = document.getElementById("label-text-alt-coupon");
        couponSpan.style.color = "green";
        couponSpan.innerText = "Coupon has been applied successsfully";
        couponSpan.classList.remove("hide");
      } else {
        const offerPrice = initialprice * 0.2;
        state.price = initialprice - initialprice * 0.2;
        setElementValue("total-price", `${initialprice} BDT`);
        setElementValue("grand-total", `${state.price} BDT`);
        setElementValue("discount-total", `${offerPrice} BDT`);
        const coupon = document.getElementById("coupon-btn");
        coupon.disabled = true;
        const couponSpan = document.getElementById("label-text-alt-coupon");
        couponSpan.style.color = "green";
        couponSpan.innerText = "Coupon has been applied successsfully";
        couponSpan.classList.remove("hide");
      }
    } else {
      const couponSpan = document.getElementById("label-text-alt-coupon");
      couponSpan.innerText = "Please enter a valid coupon";
      couponSpan.style.color = "red";
      couponSpan.classList.remove("hide");
    }
  } else {
    setElementValue("total-price", `${initialprice} BDT`);
    setElementValue("grand-total", `${initialprice} BDT`);
  }
}

function validateForm() {
  checkValidPurchase();

  const phoneNumberInput = document.querySelector('input[type="number"]');
  const nameInput = document.querySelector("#name");
  const warningSpanName = document.querySelector(".label-text-alt-name");
  const warningSpanNumber = document.querySelector(".label-text-alt-numb");

  const phoneNumber = phoneNumberInput.value;
  const name = nameInput.value;

  if (phoneNumber.trim() === "") {
    warningSpanNumber.textContent = "Please enter a valid phone number";
    warningSpanNumber.style.color = "red";
  } else {
    warningSpanNumber.textContent = "";
  }

  if (name.trim() === "") {
    warningSpanName.textContent = "Please enter your name";
    warningSpanName.style.color = "red";
  } else if (name.trim() !== "") {
    warningSpanName.textContent = "";
  }
}

function clearAll() {
  for (let z = 0; z < state.selectedSeats.length; z++) {
    const clearSelected = document.getElementById(state.selectedSeats[z]);
    clearSelected.classList.remove("selected");
  }

  const seatPurchaseList = document.getElementById("seat-purchase");
  const listItems = seatPurchaseList.querySelectorAll("li");

  for (let i = 1; i < listItems.length; i++) {
    listItems[i].remove();
  }

  const phoneNumberInput = document.querySelector('input[type="number"]');
  const nameInput = document.querySelector("#name");
  const couponText = document.getElementById("coupon-input");
  phoneNumberInput.value = "";
  nameInput.value = "";
  couponText.value = "";

  const warningSpanName = document.querySelector(".label-text-alt-name");
  const warningSpanNumber = document.querySelector(".label-text-alt-numb");
  warningSpanNumber.textContent = "";
  warningSpanName.textContent = "";

  state.ticketBought = 0;
  state.restSeats = 40;
  state.selectedSeats = [];
  state.price = 0;
  state.grandTotal = 0;

  setElementValue("restSeats", state.restSeats);
  setElementValue("ticketBought", state.ticketBought);

  const couponSpan = document.getElementById("label-text-alt-coupon");
  couponSpan.classList.add("hide");
  document.querySelector(".contact-btn").disabled = true;
  couponEnabler();
  priceUpdate();
  
  setElementValue("discount-total", "0 BDT");
}

applyOnClickHandler();
