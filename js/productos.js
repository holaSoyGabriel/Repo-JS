/** @format */

document.addEventListener("DOMContentLoaded", async () => {
	if (!document.getElementById("productos")) {
		console.warn("Este script solo se ejecuta en productos.html");
		return;
	}

	const contenedorProductos = document.getElementById("productos");

	try {
		const response = await fetch("productos.json");

		if (!response.ok) {
			throw new Error(
				`No se pudo cargar productos.json (Error ${response.status})`
			);
		}

		const datos = await response.json();
		const productos = datos.productos;

		productos.forEach((producto) => {
			const divProducto = document.createElement("div");
			divProducto.classList.add("producto");
			divProducto.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <span>Precio: $${producto.precio}</span>
                <button class="btn-neon">Comprar</button>
            `;
			contenedorProductos.appendChild(divProducto);
		});
	} catch (error) {
		console.error("Error al cargar los productos:", error);
		contenedorProductos.innerHTML =
			"<p>Error al cargar los productos. Verifica la ruta de productos.json.</p>";
	}
});
