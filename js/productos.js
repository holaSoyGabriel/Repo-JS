/** @format */

document.addEventListener("DOMContentLoaded", async () => {
	// 🔹 Elementos del DOM
	const productosLista = document.getElementById("productos-lista");
	const btnAnterior = document.getElementById("btn-anterior");
	const btnSiguiente = document.getElementById("btn-siguiente");
	const paginaActualElemento = document.getElementById("pagina-actual");
	const carritoLista = document.getElementById("carrito-lista");
	const carritoTotal = document.getElementById("carrito-total");
	const btnVaciarCarrito = document.getElementById("vaciar-carrito");
	const btnRealizarCompra = document.getElementById("realizar-compra");
	const verCarritoBtn = document.getElementById("ver-carrito");
	const carritoFlotante = document.getElementById("carrito-flotante");
	const volverBtn = document.getElementById("volver");
	const botonesCategoria = document.querySelectorAll(".categoria-btn");
	const filtroPrecio = document.getElementById("filtro-precio");
	const saldoUsuarioElemento = document.getElementById("saldo-usuario");
	const buscador = document.getElementById("buscador");

	// 🔹 Variables globales
	let productos = [];
	const productosPorPagina = 6; // ✅ Definir aquí para que todas las funciones lo reconozcan
	let paginaActual = 1;
	let categoriaSeleccionada = "Todos";
	let precioSeleccionado = "todos";
	let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
	let saldoUsuario = parseFloat(sessionStorage.getItem("saldo"));

	// ==========================================
	// 🔥 ASIGNAR SALDO ALEATORIO AL USUARIO
	// ==========================================

	function actualizarSaldo() {
		saldoUsuarioElemento.innerText = `$${saldoUsuario.toFixed(2)}`;
	}

	if (isNaN(saldoUsuario)) {
		saldoUsuario = Math.floor(Math.random() * (5000 - 500 + 1)) + 500; // 🔹 Saldo entre $500 y $5000
		sessionStorage.setItem("saldo", saldoUsuario.toFixed(2));
	}

	actualizarSaldo(); // 🔹 Muestra el saldo inicial

	// 🔹 Mostrar alerta de simulador al ingresar a productos con SweetAlert
	Swal.fire({
		title: "Bienvenido al simulador de e-commerce",
		text: `Nada de lo que veas aquí es real. Se te asignará un saldo falso para que puedas "comprar" los productos.\n\nTu saldo es: $${saldoUsuario.toFixed(
			2
		)}`,
		icon: "info",
		confirmButtonText: "Entendido",
		background: "#161628",
		color: "#ffffff",
	});

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
			mostrarProductosPaginados(productos); // ✅ Aplicamos paginación al cargar el JSON
		} catch (error) {
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

		// 🔹 Asignar eventos "Comprar" después de renderizar los productos
		document.querySelectorAll(".comprar-btn").forEach((boton) => {
			boton.addEventListener("click", () => agregarAlCarrito(boton.dataset.id));
		});
	}

	// ==========================================
	// 🔥 FILTRAR PRODUCTOS POR CATEGORÍA, PRECIO Y BÚSQUEDA
	// ==========================================
	// 🔥 Agregar evento de búsqueda

	buscador.addEventListener("input", filtrarProductos);

	function filtrarProductos() {
		paginaActual = 1; // 🔹 Reiniciar a la primera página cuando se filtra
		categoriaSeleccionada =
			document.querySelector(".categoria-btn.active")?.dataset.categoria ||
			"Todos";
		precioSeleccionado = filtroPrecio.value;
		const terminoBusqueda = buscador.value.toLowerCase().trim();

		// 🔥 Filtrar categoría, precio y nombre del producto
		const productosFiltrados = productos.filter((producto) => {
			const coincideCategoria =
				categoriaSeleccionada === "Todos" ||
				producto.categoria === categoriaSeleccionada;
			const coincidePrecio =
				precioSeleccionado === "todos" ||
				(precioSeleccionado === "bajo" && producto.precio < 50) ||
				(precioSeleccionado === "medio" &&
					producto.precio >= 50 &&
					producto.precio <= 100) ||
				(precioSeleccionado === "alto" && producto.precio > 100);
			const coincideNombre = producto.nombre
				.toLowerCase()
				.includes(terminoBusqueda);

			return coincideCategoria && coincidePrecio && coincideNombre;
		});

		mostrarProductosPaginados(productosFiltrados);
	}

	// 🔹 Evento para los botones de categoría
	botonesCategoria.forEach((boton) => {
		boton.addEventListener("click", () => {
			botonesCategoria.forEach((btn) => btn.classList.remove("active"));
			boton.classList.add("active");

			filtrarProductos(); // 🔹 Se actualiza la lista de productos en la vista
		});
	});

	filtroPrecio.addEventListener("change", filtrarProductos);
	buscador.addEventListener("input", filtrarProductos);

	document.addEventListener("DOMContentLoaded", async () => {
		paginaActual = 1;
		await cargarProductos(); // ✅ Primero cargamos los productos del JSON
		mostrarProductos(productos);
		mostrarProductosPaginados(productos); // ✅ Luego aplicamos paginación correctamente
	});
	function mostrarProductosPaginados(productosFiltrados) {
		productosLista.innerHTML = "";

		const inicio = (paginaActual - 1) * productosPorPagina;
		const fin = inicio + productosPorPagina;
		const productosPagina = productosFiltrados.slice(inicio, fin);

		if (productosPagina.length === 0) {
			productosLista.innerHTML = "<p>No hay productos disponibles.</p>";
			return;
		}

		productosPagina.forEach((producto) => {
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

		btnAnterior.disabled = paginaActual === 1;
		btnSiguiente.disabled =
			paginaActual * productosPorPagina >= productosFiltrados.length;
		paginaActualElemento.innerText = `Página ${paginaActual} de ${Math.ceil(
			productosFiltrados.length / productosPorPagina
		)}`;

		// ✅ Reasignar eventos "Comprar" después de renderizar los productos
		document.querySelectorAll(".comprar-btn").forEach((boton) => {
			boton.addEventListener("click", () => agregarAlCarrito(boton.dataset.id));
		});
	}
	btnAnterior.addEventListener("click", () => {
		if (paginaActual > 1) {
			paginaActual--;
			mostrarProductosPaginados(productos); // ✅ Ahora funciona bien con la lista filtrada
		}
	});

	btnSiguiente.addEventListener("click", () => {
		const totalPaginas = Math.ceil(productos.length / productosPorPagina);

		if (paginaActual < totalPaginas) {
			paginaActual++;
			mostrarProductosPaginados(productos); // ✅ Siempre aplica paginación correctamente
		}
	});
	// ==========================================
	// 🔥 CARRITO DE COMPRAS
	// ==========================================
	verCarritoBtn.addEventListener("click", () => {
		carritoFlotante.classList.toggle("oculto");
		if (!carritoFlotante.classList.contains("oculto")) {
			actualizarCarrito();
		}
	});

	volverBtn.addEventListener("click", () =>
		carritoFlotante.classList.add("oculto")
	);

	function agregarAlCarrito(id) {
		const productoSeleccionado = productos.find(
			(producto) => producto.id == id
		);

		const productoEnCarrito = carrito.find((item) => item.id == id);

		if (productoEnCarrito) {
			productoEnCarrito.cantidad++;
		} else {
			carrito.push({ ...productoSeleccionado, cantidad: 1 });
		}

		guardarCarrito();
		actualizarCarrito();

		Swal.fire({
			title: "Producto agregado",
			text: `${productoSeleccionado.nombre} ha sido añadido al carrito.`,
			icon: "success",
			timer: 1500,
			showConfirmButton: false,
			background: "#161628",
			color: "#ffffff",
		});
	}
	function actualizarCarrito() {
		carritoLista.innerHTML = "";
		let total = 0;
		if (carrito.length === 0) {
			carritoLista.innerHTML = "<p>El carrito está vacío.</p>";
			carritoTotal.innerText = "$0.00";
			carritoFlotante.classList.remove("scroll-activo");
			// 🔹 Desactiva el scroll si no hay productos
			return;
		}
		carrito.forEach((producto) => {
			total += producto.precio * producto.cantidad;
			const divCarrito = document.createElement("div");
			divCarrito.classList.add("carrito-item");
			divCarrito.innerHTML = ` <img src="${producto.imagen}" alt="${producto.nombre}"> <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p> <button class="eliminar-btn" data-id="${producto.id}">Eliminar</button> `;
			carritoLista.appendChild(divCarrito);
		});
		carritoTotal.innerText = `$${total.toFixed(2)}`;
		// 🔹 Activar scroll si hay más de 6 productos
		if (carrito.length > 1) {
			carritoFlotante.classList.add("scroll-activo");
		} else {
			carritoFlotante.classList.remove("scroll-activo");
		} // 🔹 Asignar eventos a los botones de eliminar
		document.querySelectorAll(".eliminar-btn").forEach((boton) => {
			boton.addEventListener("click", () => {
				eliminarDelCarrito(boton.dataset.id);
			});
		});
	}
	function eliminarDelCarrito(id) {
		carrito = carrito.filter((producto) => producto.id != id);
		guardarCarrito();
		actualizarCarrito();
	}
	btnRealizarCompra.addEventListener("click", () => {
		let totalCompra = carrito.reduce(
			(acc, producto) => acc + producto.precio * producto.cantidad,
			0
		);

		if (totalCompra > saldoUsuario) {
			Swal.fire({
				title: "Saldo insuficiente",
				text: "❌ No tienes suficiente saldo para realizar esta compra.",
				icon: "error",
				confirmButtonText: "Aceptar",
				background: "#161628",
				color: "#ffffff",
			});
		} else {
			Swal.fire({
				title: "Confirmar compra",
				text: `✅ Total: $${totalCompra}\nSaldo restante: $${(
					saldoUsuario - totalCompra
				).toFixed(2)}`,
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Sí, comprar",
				cancelButtonText: "No, cancelar",
				background: "#161628",
				color: "#ffffff",
			}).then((result) => {
				if (result.isConfirmed) {
					saldoUsuario -= totalCompra;
					sessionStorage.setItem("saldo", saldoUsuario);
					actualizarSaldo(); // 🔹 Actualiza el saldo en pantalla
					carrito = [];
					guardarCarrito();
					actualizarCarrito();

					Swal.fire({
						title: "Compra realizada",
						text: `🎉 Su compra ha sido realizada exitosamente.\n\nSu saldo restante es $${saldoUsuario.toFixed(
							2
						)}`,
						icon: "success",
						confirmButtonText: "Aceptar",
						background: "#161628",
						color: "#ffffff",
					});
				}
			});
		}
	});

	// 🔹 Vaciar carrito
	btnVaciarCarrito.addEventListener("click", () => {
		carrito = [];
		guardarCarrito();
		actualizarCarrito();
	});
	function guardarCarrito() {
		sessionStorage.setItem("carrito", JSON.stringify(carrito));
	} // 🔹 Cargar productos y carrito al iniciar
	cargarProductos();
	actualizarSaldo;
	actualizarCarrito();
});
