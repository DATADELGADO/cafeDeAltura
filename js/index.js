// FUNCIONALIDAD A PREGUNTAS FRECUENTES EN index.html

const querysIndex = document.querySelectorAll(".querys");
for (let query of querysIndex) {
    query.addEventListener("click", () => {
        if (query.children[1].style.display == "block") {
            query.children[1].style.display = "none";
            query.children[0].children[0].src = "img/desplieguebajo.svg";
        } else {
            query.children[1].style.display = "block";
            query.children[0].children[0].src = "img/despligue.svg";
        }
    })
}


// FUNCIONALIDAD A FORMULARIO EN index.html

if (document.URL.includes("index.html")) {
    const form = document.querySelector("#formulario");
    const containt = document.querySelector("#contactUs");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.style.display = "none";
        let div = document.createElement("div");
        let h2e = document.createElement("h2");
        let button = document.createElement("button");
        h2e.innerText = "Formulario enviado con éxito";
        button.innerText = "Nuevo formulario";
        button.addEventListener("click", () => {
            document.location.reload();

        })
        div.classList = "formulario-enviado";
        div.append(h2e, button);
        containt.append(div);
    })
}



// CREANDO FUNCION PARA INSERTAR EN LOCALSTORAGE
const insertElementLocalStorage = (key) => {
    if (localStorage.getItem(key.children[1].innerText) == null) {
        localStorage.setItem(key.children[1].innerText, JSON.stringify({
            imageUrl: ".." + key.children[0].src.substring(21, key.children[0].src.lenght),
            nameCoffe: key.children[1].innerText,
            price: key.children[2].innerText,
            count: 1
        }))
    } else {
        let item = key.children[1].innerText;
        let newObject = JSON.parse(localStorage.getItem(item));
        newObject.count = newObject.count + 1;
        let priceNumber = modifyPrice(newObject.price);
        newObject.price = newObject.count * (priceNumber / (newObject.count - 1)) + ",00€";
        localStorage.setItem(item, JSON.stringify(newObject));
    }
}

// CREANDO FUNCION PARA MODIFICAR EN LOCALSTORAGE
const modifyElementLocalStorage = (key, op) => {
    let object = JSON.parse(localStorage.getItem(key));
    let priceNumber = modifyPrice(object.price);
    if (op == "+") {
        object.count = object.count + 1;
        object.price = object.count * (priceNumber / (object.count - 1)) + ",00€";
    } else if (op == "-") {
        if (object.count == 1) {
            localStorage.removeItem(key);
            document.location.reload();
            return
        } else {
            object.count = object.count - 1;
            object.price = priceNumber - (priceNumber / (object.count + 1)) + ",00€";
        }
    }
    localStorage.setItem(key, JSON.stringify(object));
    reload();
    totalCarrito();
}

// CREANDO FUNCION PARA MODIFICAR UN PRECIO

const modifyPrice = (stringPrice) => {
    return parseFloat(stringPrice.replace(",", ".").replace("€", ""));
}




// AGREGANDO EVENTO A CADA CAFÉ
const coffe = document.querySelectorAll(".sacos");

for (let cof of coffe) {
    if (cof.children[3].innerText.toLowerCase() != "agotado") {
        cof.children[3].addEventListener("click", (e) => {
            e.preventDefault();
            insertElementLocalStorage(cof);
            if (e.isTrusted) {
                reload(); //MODIFICAR EN TIEMPO REAL LA CESTA
            }
        });
    }
}

// MODIFICANDO EL CONTADOR DE LA CESTA
const cestaHdos = document.querySelector("#title-cesta");
const countCesta = document.querySelector(".count-cesta"); //SE USARA PARA LA LINEA 50

const reload = () => {
    let acuCesta = 0;
    for (let i = 0; i < localStorage.length; i++) {
        acuCesta = acuCesta + JSON.parse(localStorage.getItem(localStorage.key(i))).count;
    }
    if (acuCesta != 0) {
        countCesta.innerText = acuCesta;
        countCesta.classList = "acuCesta";
    }
    if (document.URL.includes("cesta.html")) {
        cestaHdos.innerText = `Cesta (${acuCesta})`;
    }

}
reload();


// FUNCION PARA RECUPERAR
// const inputRadioNormal = document.querySelector(`input[name="envio"]:checked`);
const costeEnvio = (elemento) => {
    const inputRadioNormal = document.querySelectorAll("input[name='envio']");
    for (let radio of inputRadioNormal) {
        radio.addEventListener("input", (event) => {
            event.preventDefault();
            elemento.innerText = event.target.value;
            totalCarrito();
        })
    }

}


// MODIFICANDO TOTAL DEL CARRITO
const sectionTotalCarrito = document.querySelector("#total-carrito");
const sectionSubTotalCarrito = document.querySelector("#subtotal");
const totalCarrito = () => {
    let subtotal = 0;
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let item = JSON.parse(localStorage.getItem(key));
        subtotal = subtotal + modifyPrice(item.price);
    }

    sectionTotalCarrito.children[1].children[2].innerText = subtotal + ",00 €";
    costeEnvio(sectionTotalCarrito.children[1].children[3]);
    if (sectionTotalCarrito.children[1].children[3].innerText === "GRATIS") {
        sectionTotalCarrito.children[2].children[0].innerText = subtotal + ",00 €"
        sectionTotalCarrito.children[2].children[1].innerText = `Incluye ${Math.round((subtotal * 0.21) * 100) / 100} € de IVA`.replace(".", ",");
    } else {
        sectionTotalCarrito.children[2].children[0].innerText = (subtotal + 9) + ",00 €"
        sectionTotalCarrito.children[2].children[1].innerText = `Incluye ${Math.round(((subtotal + 9) * 0.21) * 100) / 100} € de IVA`.replace(".", ",");

    }
}


//ENLACE A pagina cesta.html
const cesta = document.querySelector("#cesta");
cesta.addEventListener("click", () => {
    let label = cesta.children[1];
    if (label.innerText.length > 0) {
        location.href = "../pages/cesta.html";
    }
});



// AÑADIENDO ELEMENTOS A PAGINA cesta.html
// *****************************************************************************************
const products = document.querySelector("#productos");

if (document.URL.includes("cesta.html")) {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let item = JSON.parse(localStorage.getItem(key));
        let { count, imageUrl, nameCoffe, price } = item;
        // CREANDO ELEMENTOS
        let sectionCoffeCesta = document.createElement("section");
        let divCoffeContent = document.createElement("div");
        let divDescriptionCoffe = document.createElement("div");
        let pCount = document.createElement("p")
        let labelResta = document.createElement("label");
        let labelSum = document.createElement("label");
        let image = document.createElement("img");
        let h3Price = document.createElement("h3");
        let labelNameCoffe = document.createElement("label");
        let pDescription = document.createElement("p");
        // AÑADIENDO CLASES Y TEXTO A LOS NUEVOS ELEMENTOS
        sectionCoffeCesta.classList = "coffe-cesta";
        divCoffeContent.classList = "coffe-content";
        labelResta.classList = "resta";
        labelSum.classList = "sum";
        divDescriptionCoffe.classList = "description-coffe";
        h3Price.classList = "price";
        pCount.innerText = count;
        labelResta.innerText = "-";
        labelSum.innerText = "+";
        image.src = imageUrl;
        labelNameCoffe.innerText = nameCoffe;
        pDescription.innerText = "Paquete de café, 250gr";
        h3Price.innerText = price;
        //AÑADIENDO LOS ELEMENTOS A SUS RESPECTIVOS CONTENEDORES
        divDescriptionCoffe.append(labelNameCoffe, pDescription);
        divCoffeContent.append(labelResta, pCount, labelSum, image, divDescriptionCoffe);
        sectionCoffeCesta.append(divCoffeContent, h3Price);
        products.append(sectionCoffeCesta);
    }

    //EDITANDO EL LOCALSTORAGE CON LOS BOTONES DE SUMA Y RESTA
    const sectionCoffe = document.querySelectorAll(".coffe-cesta");
    for (let coffe of sectionCoffe) {
        let priceString = coffe.children[1]; //esta es la label de precio de los cafés
        let keyNameCoffe = coffe.children[0].children[4].children[0].innerText; // este es el nombre de la key
        coffe.children[0].children[0].addEventListener("click", () => { //este es el boton de restar
            let count = coffe.children[0].children[1];
            if (parseInt(count.innerText) > 0) {
                count.innerText = parseInt(count.innerText) - 1;
                modifyElementLocalStorage(keyNameCoffe, "-");
                priceString.innerText = JSON.parse(localStorage.getItem(keyNameCoffe)).price;
            }
        })

        coffe.children[0].children[2].addEventListener("click", () => { //este es el boton de sumar
            let count = coffe.children[0].children[1];
            count.innerText = parseInt(count.innerText) + 1;
            modifyElementLocalStorage(keyNameCoffe, "+");
            priceString.innerText = JSON.parse(localStorage.getItem(keyNameCoffe)).price;
            // document.location.reload();
        })

    }

    //ACTUALIZAR TOTAL CARRITO
    totalCarrito();

    //AÑADIENDO EVENTO A BUTTON CHECKOUT
    const buttonCheck = document.querySelector("#buttons").children[0];
    if (localStorage.length < 1) {
        buttonCheck.style.opacity = "0.5";
    } else {
        buttonCheck.addEventListener("click", () => {
            location.href = "../pages/checkout.html";
        })
    }


}


