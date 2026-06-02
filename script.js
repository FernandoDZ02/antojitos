// Configuración global del negocio
const NUMERO_WHATSAPP = "5541051524"; 
const COSTO_BASE = 30;
const COSTO_ENVIO = 10;

let carrito = [];
let urlUbicacionGps = "";

// --- INICIALIZACIÓN AL CARGAR LA PÁGINA ---
document.addEventListener("DOMContentLoaded", () => {
    sincronizarCheckboxes();
});

// --- APERTURA Y CIERRE DE MODALES DE PRODUCTOS ---
function abrirModalProducto(tipo) {
    document.getElementById(`modal-${tipo}`).classList.add('active');
}

function cerrarModalProducto(tipo) {
    document.getElementById(`modal-${tipo}`).classList.remove('active');
}

// --- EVITAR CONFLICTOS DE INGREDIENTES APARTE ---
function sincronizarCheckboxes() {
    const parejasQuesadilla = [
        ['q-lechuga', 'ap-q-lechuga'],
        ['q-queso', 'ap-q-queso'],
        ['q-crema', 'ap-q-crema'],
        ['q-salsa', 'ap-q-salsa']
    ];

    const parejasGordita = [
        ['g-cebolla', 'ap-g-cebolla'],
        ['g-cilantro', 'ap-g-cilantro'],
        ['g-salsa', 'ap-g-salsa']
    ];

    const todasLasParejas = [...parejasQuesadilla, ...parejasGordita];

    todasLasParejas.forEach(([idIncluido, idAparte]) => {
        const checkIncluido = document.getElementById(idIncluido);
        const checkAparte = document.getElementById(idAparte);

        if (checkIncluido && checkAparte) {
            checkIncluido.addEventListener('change', () => {
                if (!checkIncluido.checked) {
                    checkAparte.checked = false;
                }
            });

            checkAparte.addEventListener('change', () => {
                if (checkAparte.checked) {
                    checkIncluido.checked = false;
                }
            });
        }
    });
}

// --- SELECCIONAR TODO APARTE ---
function seleccionarTodoAparte(tipo) {
    if (tipo === 'quesadilla') {
        const estadoTodo = document.getElementById('ap-q-todo').checked;
        const idsAparte = ['ap-q-lechuga', 'ap-q-queso', 'ap-q-crema', 'ap-q-salsa'];
        const idsIncluidos = ['q-lechuga', 'q-queso', 'q-crema', 'q-salsa'];

        idsAparte.forEach(id => {
            document.getElementById(id).checked = estadoTodo;
        });

        if (estadoTodo) {
            idsIncluidos.forEach(id => {
                document.getElementById(id).checked = false;
            });
        }
    } else if (tipo === 'gordita') {
        const estadoTodo = document.getElementById('ap-g-todo').checked;
        const idsAparte = ['ap-g-cebolla', 'ap-g-cilantro', 'ap-g-salsa'];
        const idsIncluidos = ['g-cebolla', 'g-cilantro', 'g-salsa'];

        idsAparte.forEach(id => {
            document.getElementById(id).checked = estadoTodo;
        });

        if (estadoTodo) {
            idsIncluidos.forEach(id => {
                document.getElementById(id).checked = false;
            });
        }
    }
}

// --- CONTROL DE MODALES GENERALES ---
function abrirModalAparte(tipo) {
    document.getElementById('modal-aparte').classList.add('active');
    if (tipo === 'quesadilla') {
        document.getElementById('opciones-aparte-quesadilla').style.display = 'block';
        document.getElementById('opciones-aparte-gordita').style.display = 'none';
    } else {
        document.getElementById('opciones-aparte-quesadilla').style.display = 'none';
        document.getElementById('opciones-aparte-gordita').style.display = 'block';
    }
}

function cerrarModalAparte() {
    document.getElementById('modal-aparte').classList.remove('active');
}

function abrirModalCarrito() {
    document.getElementById('modal-carrito').classList.add('active');
}

function cerrarModalCarrito() {
    document.getElementById('modal-carrito').classList.remove('active');
}

// --- FUNCIONES PARA EL MODAL DE ADVERTENCIA NUEVO ---
function abrirModalAdvertencia(camposFaltantes) {
    const modal = document.getElementById('modal-advertencia');
    const lista = document.getElementById('lista-campos-vacios');
    
    // Limpiar alertas anteriores
    lista.innerHTML = "";
    
    // Inyectar de manera dinámica cada campo vacío encontrado
    camposFaltantes.forEach(campo => {
        const li = document.createElement('li');
        li.textContent = campo;
        lista.appendChild(li);
    });
    
    modal.classList.add('active');
}

function cerrarModalAdvertencia() {
    document.getElementById('modal-advertencia').classList.remove('active');
}

// --- AGREGAR AL CARRITO Y CERRAR MODAL AUTOMÁTICAMENTE ---
function agregarAlCarritoYSalir(tipo) {
    agregarAlCarrito(tipo);
    cerrarModalProducto(tipo);
}

// --- AGREGAR PRODUCTOS AL CARRITO ---
function agregarAlCarrito(tipo) {
    let nombreProducto = "";
    let extras = [];
    let precioFinal = COSTO_BASE;

    if (tipo === 'quesadilla') {
        const guisado = document.getElementById('guisado-quesadilla').value;
        const esFrita = document.getElementById('check-frita').checked;
        const conQuesillo = document.getElementById('queso-extra-q').checked;

        const preparacion = esFrita ? "Frita" : "en Comal";
        nombreProducto = `Quesadilla de ${guisado} (${preparacion})`;

        if (conQuesillo) {
            extras.push("Con Quesillo (+$5)");
            precioFinal += 5;
        }

        const chkLechuga = document.getElementById('q-lechuga').checked;
        const chkQueso = document.getElementById('q-queso').checked;
        const chkCrema = document.getElementById('q-crema').checked;
        const chkSalsa = document.getElementById('q-salsa').checked;

        if (chkLechuga && chkQueso && chkCrema && chkSalsa) {
            extras.push("Lleva: Con todo");
        } else {
            let ing = [];
            if (chkLechuga) ing.push("lechuga");
            if (chkQueso) ing.push("queso");
            if (chkCrema) ing.push("crema");
            if (chkSalsa) ing.push("salsa");
            if (ing.length > 0) extras.push("Lleva: " + ing.join(", "));
        }

        let aparte = [];
        if (document.getElementById('ap-q-lechuga').checked) aparte.push("lechuga");
        if (document.getElementById('ap-q-queso').checked) aparte.push("queso");
        if (document.getElementById('ap-q-crema').checked) aparte.push("crema");
        if (document.getElementById('ap-q-salsa').checked) aparte.push("salsa");
        if (aparte.length > 0) extras.push("⚠️ Aparte: " + aparte.join(", "));

    } else if (tipo === 'gordita') {
        nombreProducto = "Gordita de Chicharrón";
        const conQuesillo = document.getElementById('queso-extra-g').checked;

        if (conQuesillo) {
            extras.push("Con Quesillo (+$5)");
            precioFinal += 5;
        }

        const chkCebolla = document.getElementById('g-cebolla').checked;
        const chkCilantro = document.getElementById('g-cilantro').checked;
        const chkSalsa = document.getElementById('g-salsa').checked;

        if (chkCebolla && chkCilantro && chkSalsa) {
            extras.push("Lleva: Con todo");
        } else {
            let ing = [];
            if (chkCebolla) ing.push("cebolla");
            if (chkCilantro) ing.push("cilantro");
            if (chkSalsa) ing.push("salsa");
            if (ing.length > 0) extras.push("Lleva: " + ing.join(", "));
        }

        let aparte = [];
        if (document.getElementById('ap-g-cebolla').checked) aparte.push("cebolla");
        if (document.getElementById('ap-g-cilantro').checked) aparte.push("cilantro");
        if (document.getElementById('ap-g-salsa').checked) aparte.push("salsa");
        if (aparte.length > 0) extras.push("⚠️ Aparte: " + aparte.join(", "));
    }

    const identificadorUnico = nombreProducto + extras.join("");
    const itemExistente = carrito.find(item => item.idUnico === identificadorUnico);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            idUnico: identificadorUnico,
            nombre: nombreProducto,
            extras: extras,
            precioUnitario: precioFinal,
            cantidad: 1
        });
    }

    // Restablecer campos del menú al estado inicial
    if (tipo === 'quesadilla') {
        document.getElementById('ap-q-todo').checked = false;
        document.getElementById('ap-q-lechuga').checked = false;
        document.getElementById('ap-q-queso').checked = false;
        document.getElementById('ap-q-crema').checked = false;
        document.getElementById('ap-q-salsa').checked = false;
        
        document.getElementById('q-lechuga').checked = true;
        document.getElementById('q-queso').checked = true;
        document.getElementById('q-crema').checked = true;
        document.getElementById('q-salsa').checked = true;
    } else {
        document.getElementById('ap-g-todo').checked = false;
        document.getElementById('ap-g-cebolla').checked = false;
        document.getElementById('ap-g-cilantro').checked = false;
        document.getElementById('ap-g-salsa').checked = false;
        
        document.getElementById('g-cebolla').checked = true;
        document.getElementById('g-cilantro').checked = true;
        document.getElementById('g-salsa').checked = true;
    }

    actualizarInterfazCarrito();
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    actualizarInterfazCarrito();
}

function actualizarInterfazCarrito() {
    const listaHtml = document.getElementById('lista-carrito');
    const vacioHtml = document.getElementById('carrito-vacio');
    const totalHtml = document.getElementById('total-precio');
    const barraFlotante = document.getElementById('btn-flotante-carrito');
    const badgeCantidad = document.getElementById('badge-cantidad');
    const totalFlotante = document.getElementById('total-flotante');

    listaHtml.innerHTML = "";

    if (carrito.length === 0) {
        vacioHtml.style.display = "block";
        totalHtml.innerText = "$0.00";
        barraFlotante.classList.remove('active'); 
        cerrarModalCarrito();
        return;
    }

    vacioHtml.style.display = "none";
    let subtotal = 0;
    let productosTotales = 0;

    carrito.forEach((item, index) => {
        const costoItemTotal = item.precioUnitario * item.cantidad;
        subtotal += costoItemTotal;
        productosTotales += item.cantidad;

        const li = document.createElement('li');
        li.className = "cart-item";
        li.innerHTML = `
            <div class="cart-item-details">
                <strong>${item.cantidad}x ${item.nombre}</strong><br>
                <small style="color:#718096;">${item.extras.join(" | ")}</small>
            </div>
            <div class="cart-item-controls">
                <span>$${costoItemTotal}</span>
                <button onclick="cambiarCantidad(${index}, -1)">-</button>
                <button onclick="cambiarCantidad(${index}, 1)">+</button>
            </div>
        `;
        listaHtml.appendChild(li);
    });

    const totalFinal = subtotal + COSTO_ENVIO;
    totalHtml.innerText = `$${totalFinal}.00`;
    totalFlotante.innerText = `$${totalFinal}.00`;
    badgeCantidad.innerText = productosTotales;
    barraFlotante.classList.add('active');
}

function evaluarMetodoPago() {
    const metodo = document.getElementById('metodo-pago').value;
    const divCambio = document.getElementById('cambio-contenedor');
    divCambio.style.display = (metodo === 'Efectivo') ? "block" : "none";
}

function obtenerUbicacion() {
    const status = document.getElementById('status-ubicacion');
    if (!navigator.geolocation) {
        status.innerText = "La geolocalización no es compatible.";
        return;
    }
    status.innerText = "Localizando dispositivo...";
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            urlUbicacionGps = `https://maps.google.com/?q=${lat},${lon}`;
            status.innerHTML = `✅ Ubicación GPS cargada exitosamente.`;
        },
        () => {
            status.innerText = "No se pudo acceder al GPS.";
        }
    );
}

function marcarUbicacionPorChat() {
    urlUbicacionGps = "Mandar directamente por chat de WhatsApp 📍";
    const status = document.getElementById('status-ubicacion');
    status.innerHTML = `✅ Seleccionado: Enviarás tu ubicación por el chat de WhatsApp.`;
}

function mostrarAlertaBonita(mensaje) {
    const divAlerta = document.getElementById('alerta-error');
    const txtMensaje = document.getElementById('alerta-mensaje');
    txtMensaje.innerText = mensaje;
    divAlerta.style.display = "flex";
    document.querySelector('.modal-body').scrollTop = 0;
}

// --- FUNCIÓN TOTALMENTE REESTRUCTURADA CON EL NUEVO MODAL ---
function enviarPedidoWhatsApp() {
    // Si no hay productos, mostramos alerta directa en el carrito
    if (carrito.length === 0) {
        mostrarAlertaBonita("Por favor, agrega al menos un antojito a tu carrito.");
        return;
    }

    const nombre = document.getElementById('cliente-nombre').value.trim();
    const telefono = document.getElementById('cliente-telefono').value.trim();
    const direccion = document.getElementById('cliente-direccion').value.trim();
    const metodoPago = document.getElementById('metodo-pago').value;
    const conCuanto = document.getElementById('con-cuanto').value.trim();

    // Array para almacenar qué campos exactos faltan por rellenar
    let camposVacios = [];

    // Validar cada campo de manera independiente
    if (nombre === "") camposVacios.push("Nombre Completo");
    if (telefono === "" || telefono.length < 10) camposVacios.push("Número de Celular (mínimo 10 dígitos)");
    if (direccion === "") camposVacios.push("Dirección Completa y Referencias");
    if (urlUbicacionGps === "") camposVacios.push("Método de Ubicación (GPS o Por Chat)");

    // Calcular costos actuales
    let subtotal = 0;
    carrito.forEach(item => subtotal += (item.precioUnitario * item.cantidad));
    const totalFinal = subtotal + COSTO_ENVIO;

    // Validación condicional: Solo exigir dinero en efectivo si el método seleccionado es Efectivo
    if (metodoPago === 'Efectivo') {
        if (conCuanto === "") {
            camposVacios.push("¿Con cuánto vas a pagar?");
        } else if (parseFloat(conCuanto) < totalFinal) {
            camposVacios.push(`El dinero con el que pagas ($${conCuanto}) debe ser mayor o igual al total ($${totalFinal})`);
        }
    }

    // SI HAY CAMPOS VACÍOS: Se detiene el proceso y se abre el nuevo modal interactivo
    if (camposVacios.length > 0) {
        abrirModalAdvertencia(camposVacios);
        return; 
    }

    // SI TODO ESTÁ PERFECTO: Genera la cadena de WhatsApp y envía
    let mensaje = `*NUEVO PEDIDO RECIBIDO* 📝\n`;
    mensaje += `--------------------------\n`;
    mensaje += `👤 *Cliente:* ${nombre}\n`;
    mensaje += `📞 *Teléfono:* ${telefono}\n`;
    mensaje += `🏠 *Dirección/Ref:* ${direccion}\n`;
    mensaje += `📍 *Ubicación del Pedido:* \n${urlUbicacionGps}\n`;
    mensaje += `--------------------------\n\n`;
    mensaje += `*Detalle de la orden:*\n`;

    carrito.forEach(item => {
        const costoTotalItem = item.precioUnitario * item.cantidad;
        mensaje += `*${item.cantidad}x ${item.nombre}* \n`;
        if (item.extras.length > 0) mensaje += `  _${item.extras.join(" | ")}_\n`;
        mensaje += `  Precio: $${costoTotalItem}\n\n`;
    });

    mensaje += `--------------------------\n`;
    mensaje += `*Envío:* $${COSTO_ENVIO}\n`;
    mensaje += `*Total a Pagar:* $${totalFinal}.00\n`;
    mensaje += `💳 *Método de Pago:* ${metodoPago}\n`;
    
    if (metodoPago === 'Efectivo') {
        mensaje += `*Paga con:* $${conCuanto} \n*Cambio:* $${conCuanto - totalFinal}\n`;
    }

    const linkWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(linkWhatsApp, '_blank');
}