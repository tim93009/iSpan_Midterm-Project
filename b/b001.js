let cart = {};

function addToCart(product) {
    if (cart[product]) {
        cart[product] += 1;
    } else {
        cart[product] = 1;
    }
    updateCart();
}

function removeFromCart(product) {
    if (cart[product] && cart[product] > 0) {
        cart[product] -= 1;
    }
    if (cart[product] === 0) {
        delete cart[product];
    }
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";  // 清空購物車列表

    for (let item in cart) {
        const li = document.createElement("li");
        li.innerHTML = `${item} *${cart[item]} 
            <button onclick="removeFromCart('${item}')">減少</button>`;
        cartList.appendChild(li);
    }
}

function resetCart() {
    cart = {};
    updateCart();
}

function checkout() {
    if (Object.keys(cart).length === 0) {
        alert("購物車是空的！");
    } else {
        let items = Object.keys(cart).map(item => `${item} *${cart[item]}`).join(", ");
        alert("感謝您的購買！您購買了：" + items);
    }
}
