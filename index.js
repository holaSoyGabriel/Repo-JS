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
				/* ok, esto lo tuve que hacer improvisado, porque cuando abria github pages,
			      este era el primer link que me aparecia: https://holasoygabriel.github.io/Repo-JS/,
				 aparece la pestana de bienvenida, pero al darle click en comenzar
				  me mandaba a este enlace: https://holasoygabriel.github.io/pages/registro-pregunta.html,
				  entonces tuve que forzar a la pestaña de que añadiera Repo-js en la url de registro-pregunta.html
				  en github pages, ah y tambien, creo que lo adapte a cualquier entorno o servidor en el que este.
				  No se si ,lo tomen como error*/
				const pathArray = window.location.pathname.split("/");
				const repoName = pathArray.includes("Repo-JS") ? "/Repo-JS" : "";
				window.location.href = `${window.location.origin}${repoName}/pages/registro-pregunta.html`;
			}, 2000);
		});
	}
});
