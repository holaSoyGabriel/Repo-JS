/** @format */

document.addEventListener("DOMContentLoaded", () => {
    // Crear el contenedor del spinner y agregarlo al HTML
    const spinnerContainer = document.createElement("div");
    spinnerContainer.classList.add("spinner-container");
    spinnerContainer.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(spinnerContainer);

    // Obtener todos los botones que redirigen a otra página
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

    window.addEventListener("load", () => {
        spinnerContainer.classList.remove("active");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const btnComenzar = document.getElementById("btnComenzar");

    if (btnComenzar) {
        btnComenzar.addEventListener("click", () => {
            // Animación antes de redirigir
            btnComenzar.style.transform = "scale(0.9)";
            btnComenzar.style.opacity = "0.7";

            setTimeout(() => {
                window.location.href = "registro-pregunta.html";
            }, 300);
        });
    }
});

console.log("Index.js cargado correctamente");
