/*************************Checkout Section******************************* */

const checkout = async()=>{
    const data = {
        items : [
            { id : 1, quantity : 3 },
            { id : 2, quantity : 1 }
        ]
    }
    await axios.post('/checkout/process-order', data)
    .then(response => {
        if(response.status === 201) return response.data
        return response.json().then(json => Promise.reject(json))
    })
    .then(({url}) =>{
        window.location.assign(url)
        // console.log(url)
    })
    .catch(error => {
        const status = error.response.status
        console.log(error)
        if(status == 404 ||status == 400 || status == 500){
            $.notify(error.response.data.error, "error");
        }
    });
}

/********************************************************************** */
/*********************** Quantity Change Section ************************************* */
const updateCart = async (itemid, changeby)=>{
    
    /***********************************************************************************/
    const updateHtmlComponent = (data)=>{
        const item = document.getElementById(data._id)
        if(data.quantity > 0){
            item.innerHTML = itemHTMLComponent(data)
        }
        else{
            item.remove()
        }
        loadCheckoutDOM()
    }
    /***********************************************************************************/

    const item = {
        itemid : itemid,
        quantity : changeby
    }
    await axios.post('/cart/update-cart', item)
    .then(response => {
        if(response.status == 201) // data received
        {
            // $.notify(response.data.message, "success");
            updateHtmlComponent(response.data.result)
            loadCheckoutDOM()
        }
    })
    .catch(error => {
        const status = error.response.status
        if(status == 404 ||status == 400 || status == 500){
            $.notify(error.response.data.message, "error");
        }
    });
}


/*********************** Remove Item Section ************************************* */
const removeItemFromCart = async (itemid)=>{

    const deleteFromDOM = (id)=>{
        const item = document.getElementById(id)
        item.remove()
    }
    const item = {
        itemid : itemid
    }
    await axios.post('/cart/remove-current-cart-item', item)
        .then(response => {
            if(response.status == 201) // data received
            {
                $.notify(response.data.message, "success");
                
                deleteFromDOM(response.data.result._id)
                loadCheckoutDOM()
            }
        })
        .catch(error => {
            const status = error.response.status
            if(status == 404 ||status == 400 || status == 500){
                $.notify(error.response.data.message, "error");
            }
        });
}


/*********************** Display Item Section ************************************* */

const itemHTMLComponent = (item)=>{
    const subtotal = item.item_price*item.quantity
    return `
    <div class="item item-desc">
        <img src= ${item.item_img} alt="">
        <div class="item-desc">
            <span class="item-title">${item.item_name}</span>
            <small class="item-info">
            </small>
        </div>
    </div>
    <div class="price-div">
        <span class="price">${item.item_price}</span>
    </div>
    <div class="quantity-control">
        <span class="quantity">${item.quantity}</span>
        <div>
            <span><i class="fa-solid fa-plus fa-xl" onclick="updateCart('${item.itemid}', 1)"></i></span>
            <span><i class="fa-solid fa-minus fa-xl" onclick="updateCart('${item.itemid}', -1)"></i></span></i>
        </div>
    </div>
    <div class="subtotal-div">
        <span class="price">${subtotal}</span>
        <button class="remove" onclick="removeItemFromCart('${item.itemid}')" >Remove</button>
    </div>
    `;
}

const individualItem = (item)=>{
    const basket = document.createElement('div')
    basket.classList.add('basket-item')
    basket.setAttribute("id", item._id)
    const subtotal = item.item_price*item.quantity
    basket.innerHTML = itemHTMLComponent(item)
    return basket;
}

const loadCartDOM = (data)=>{
    const cartItems = document.getElementById('cart-items')
    if(data.length === 0)
    {
        cartItems.innerHTML  += `<div style="margin:3rem 0" ><center><h1>Cart is Empty!</h1></center></div>`
    }

    // sort by CreatedAt in recent first order
    data = data.sort(function(a, b) {
        var c = new Date(a.createdAt);
        var d = new Date(b.createdAt);
        return d-c;
    });

    data.forEach(element => {
        const item = individualItem(element)
        cartItems.appendChild(item) 
    });
}

const checkoutHTMLComponent = (data)=>{
    return `
    <div class="total-subsection">
        <div class="subtotal">
            <span>Subtotal</span>
            <span id="cart-total-subtotal" class="price">${data.totalCartValue.toFixed(2)}</span>
        </div>
        <div class="subtotal small">
            <span>GST (18%)</span>
            <span id="cart-total-subtotal" class="price">${data.gst.toFixed(2)}</span>
        </div>
        <div class="subtotal small">
            <span>Delivery (5%)</span>
            <span id="cart-total-subtotal" class="price">${data.deliveryCharge.toFixed(2)}</span>
        </div>
        <div class="cart-total-promo"></div>
    </div>
    <div class="grand-total">
        <h4>TOTAL</h4>
        <span id="cart-total-final-price" class="price">${data.grandTotal.toFixed(2)}</span>
    </div>
    <button class="remove" onclick=checkout()>GO TO SECURE CHECKOUT</button>
    `
}

const loadCheckoutDOM = async()=>{
    let data = await getCheckoutData()
    const cartChk = document.getElementById('cart-total')
    if(data)
        cartChk.innerHTML = checkoutHTMLComponent(data)
    else
        cartChk.innerHTML = "<center>ADD ITEMS</center>"

}

const loadDatainDOM = (data)=>{
    loadCartDOM(data)
    loadCheckoutDOM()
}

const getCheckoutData = async()=>{
    let data
    await axios.post('/cart/get-checkout-data')
        .then(response => {
            if(response.status == 201) // data received
            {
                // console.log(response.data)
                data = response.data.checkoutData
            }
        })
        .catch(error => {
            const status = error.response.status
            if(status == 404 ||status == 400 || status == 500)
            {
                $.notify(error.response.data.message, "error");
            }
        });
    return data
}

const getCartData = async()=>{
    let data = []
    await axios.post('/cart/get-current-cart-items')
        .then(response => {
            if(response.status == 201) // data received
            {
                // console.logs(response.data)
                data = response.data.cartItems
            }
        })
        .catch(error => {
            const status = error.response.status
            if(status == 404 ||status == 400 || status == 500)
            {
                console.log(error)
                $.notify(error.response.data.message, "error");
            }
        });
    return data
}

/**************************************************************************************************** */

window.addEventListener("load", async(event) => {
    const data = await getCartData()
    loadDatainDOM(data);
});

