/** @format */

document.addEventListener("DOMContentLoaded", async () => {
	// 🔹 Elementos del DOM
	const productosLista = document.getElementById("productos-lista");
	const buscador = document.getElementById("buscador");
	const botonesCategoria = document.querySelectorAll(".categoria-btn");
	const filtroPrecio = document.getElementById("filtro-precio");
	const carritoLista = document.getElementById("carrito-lista");
	const btnVaciarCarrito = document.getElementById("vaciar-carrito");
	const carritoTotal = document.getElementById("carrito-total");
	const verCarritoBtn = document.getElementById("ver-carrito");
	const carritoFlotante = document.getElementById("carrito-flotante");
	const volverBtn = document.getElementById("volver");

	// 🔹 Variables globales
	let productos = [];
	let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

	// ==========================================
	// 🔥 CARGA DE PRODUCTOS DESDE JSON
	// ==========================================
	async function cargarProductos() {
		try {
			const response = await fetch("../pages/productos.json");
			if (!response.ok)
				throw new Error(
					`Error al cargar productos (Código ${response.status})`
				);

			const datos = await response.json();
			if (!datos.productos || datos.productos.length === 0)
				throw new Error("El JSON no contiene productos.");

			productos = datos.productos;
			console.log("✅ Productos cargados correctamente:", productos);
			mostrarProductos(productos);
		} catch (error) {
			console.error("❌ Error al cargar los productos:", error);
			productosLista.innerHTML = `<p style="color: red;">Error al cargar productos. Verifica el JSON.</p>`;
		}
	}

	// ==========================================
	// 🔥 MOSTRAR PRODUCTOS EN LA PÁGINA
	// ==========================================
	function mostrarProductos(lista) {
		productosLista.innerHTML = "";
		if (!lista || lista.length === 0) {
			productosLista.innerHTML = "<p>No hay productos disponibles.</p>";
			return;
		}

		lista.forEach((producto) => {
			const divProducto = document.createElement("div");
			divProducto.classList.add("producto-card");
			divProducto.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <span>Precio: $${producto.precio}</span>
                <button class="btn-neon comprar-btn" data-id="${producto.id}">Comprar</button>
            `;
			productosLista.appendChild(divProducto);
		});

		// 🔹 Agregar eventos a los botones de compra
		document.querySelectorAll(".comprar-btn").forEach((boton) => {
			boton.addEventListener("click", () => {
				agregarAlCarrito(boton.dataset.id);
			});
		});

		console.log("✅ Productos mostrados correctamente.");
	}

	// ==========================================
	// 🔥 FILTRADO DE PRODUCTOS
	// ==========================================
	botonesCategoria.forEach((boton) => {
		boton.addEventListener("click", () => {
			const categoriaSeleccionada = boton.getAttribute("data-categoria");

			botonesCategoria.forEach((btn) => btn.classList.remove("active"));
			boton.classList.add("active");

			let productosFiltrados =
				categoriaSeleccionada === "Todos"
					? productos
					: productos.filter(
							(producto) => producto.categoria === categoriaSeleccionada
					  );

			productosFiltrados = filtrarPorPrecio(productosFiltrados);
			mostrarProductos(productosFiltrados);
		});
	});

	filtroPrecio.addEventListener("change", () => {
		let productosFiltrados = filtrarPorPrecio(productos);
		mostrarProductos(productosFiltrados);
	});

	function filtrarPorPrecio(lista) {
		const precioSeleccionado = filtroPrecio.value;

		if (precioSeleccionado === "todos") return lista;
		if (precioSeleccionado === "bajo")
			return lista.filter((producto) => producto.precio < 50);
		if (precioSeleccionado === "medio")
			return lista.filter(
				(producto) => producto.precio >= 50 && producto.precio <= 100
			);
		if (precioSeleccionado === "alto")
			return lista.filter((producto) => producto.precio > 100);

		return lista;
	}

	// ==========================================
	// 🔥 BÚSQUEDA EN TIEMPO REAL
	// ==========================================
	buscador.addEventListener("input", () => {
		const texto = buscador.value.toLowerCase();
		const productosFiltrados = productos.filter((producto) =>
			producto.nombre.toLowerCase().includes(texto)
		);
		mostrarProductos(productosFiltrados);
	});

	// ==========================================
	// 🔥 CARRITO DE COMPRAS
	// ==========================================
	verCarritoBtn.addEventListener("click", () => {
		carritoFlotante.classList.remove("oculto");
		actualizarCarrito();
	});

	volverBtn.addEventListener("click", () => {
		carritoFlotante.classList.add("oculto");
	});

	function agregarAlCarrito(id) {
		const productoSeleccionado = productos.find(
			(producto) => producto.id == id
		);
		const productoEnCarrito = carrito.find((item) => item.id == id);

		if (productoEnCarrito) {
			productoEnCarrito.cantidad++;
		} else {
			productoSeleccionado.cantidad = 1;
			carrito.push(productoSeleccionado);
		}

		actualizarCarrito();
		guardarCarrito();

		// 🔹 Notificación visual
		Toastify({
			text: `${productoSeleccionado.nombre} agregado al carrito`,
			duration: 2000,
			gravity: "top",
			position: "right",
			backgroundColor: "#5b00a3",
		}).showToast();
	}

	function actualizarCarrito() {
		carritoLista.innerHTML = "";
		let total = 0;

		if (carrito.length === 0) {
			carritoLista.innerHTML = "<p>El carrito está vacío.</p>";
			carritoTotal.innerText = "$0.00";
			return;
		}

		carrito.forEach((producto) => {
			total += producto.precio * producto.cantidad;

			const divCarrito = document.createElement("div");
			divCarrito.classList.add("carrito-item");
			divCarrito.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p>
            <button class="eliminar-btn" data-id="${producto.id}">Eliminar</button>
        `;
			carritoLista.appendChild(divCarrito);
		});

		carritoTotal.innerText = `$${total.toFixed(2)}`;

		// 🔹 Asignar eventos a los botones de eliminar
		document.querySelectorAll(".eliminar-btn").forEach((boton) => {
			boton.addEventListener("click", () => {
				eliminarDelCarrito(boton.dataset.id);
			});
		});
	}

	btnVaciarCarrito.addEventListener("click", () => {
		carrito = []; // Vaciar el array
		guardarCarrito(); // Guardar cambios en localStorage
		actualizarCarrito(); // Refrescar la interfaz
		Toastify({
			text: "Carrito vaciado correctamente",
			duration: 2000,
			gravity: "top",
			position: "right",
			backgroundColor: "#ff0000",
		}).showToast();
	});

	function eliminarDelCarrito(id) {
		carrito = carrito.filter((producto) => producto.id != id);
		guardarCarrito();
		actualizarCarrito();
	}

	function guardarCarrito() {
		localStorage.setItem("carrito", JSON.stringify(carrito));
	}

	// 🔹 Cargar productos y carrito al iniciar
	cargarProductos();
	actualizarCarrito();
});
