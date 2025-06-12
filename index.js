/** @format */

document.addEventListener("DOMContentLoaded", () => {
	// 🔹 Crear el contenedor del spinner y agregarlo al HTML
	const spinnerContainer = document.createElement("div");
	spinnerContainer.classList.add("spinner-container");
	spinnerContainer.innerHTML = '<div class="loader"></div>';
	document.body.appendChild(spinnerContainer);

	// 🔹 Obtener todos los botones que redirigen a otra página
	const botonesRedireccion = document.querySelectorAll(".btn-neon, a");

	botonesRedireccion.forEach((boton) => {
		boton.addEventListener("click", (event) => {
			event.preventDefault();

			const urlDestino = boton.getAttribute("href");

			if (urlDestino && urlDestino !== "#") {
				spinnerContainer.classList.add("active");

				setTimeout(() => {
					window.location.href = urlDestino;
				}, 2000);
			}
		});
	});

	// 🔹 Ocultar el spinner cuando la página carga completamente
	window.addEventListener("load", () => {
		spinnerContainer.classList.remove("active");
	});

	// ==========================================
	// 🔥 SPINNER EN BOTÓN "COMENZAR"
	// ==========================================
	const btnComenzar = document.getElementById("btnComenzar");

	if (btnComenzar) {
		btnComenzar.addEventListener("click", (event) => {
			event.preventDefault();

			// 🔹 Animación antes de redirigir
			btnComenzar.style.transform = "scale(0.9)";
			btnComenzar.style.opacity = "0.7";

			// 🔹 Mostrar spinner antes de redirigir
			spinnerContainer.classList.add("active");

			setTimeout(() => {
				window.location.href = "../registro-pregunta.html";
			}, 2000);
		});
	}
});
