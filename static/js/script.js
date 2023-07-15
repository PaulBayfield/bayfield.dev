const menu = document.querySelector(".menu");
const navMenu = document.querySelectorAll(".nav-links");


menu.addEventListener("click", () => {
    menu.classList.toggle("active");
    navMenu.forEach((item) => {
        item.classList.toggle("active");
    });
});


document.querySelectorAll(".nav-link").forEach((n) =>
    n.addEventListener("click", () => {
        menu.classList.remove("active");
        navMenu.forEach((item) => {
            item.classList.remove("active");
        });
    })
);
