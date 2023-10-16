const menu = document.querySelector(".menu");
const navMenu = document.querySelectorAll(".nav-links");

var isOpen = false;


menu.addEventListener("click", () => {
    if (!isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "unset";
    }
    isOpen = !isOpen;
    menu.classList.toggle("active");
    navMenu.forEach((item) => {
        item.classList.toggle("active");
    });
});


document.querySelectorAll(".nav-link").forEach((n) =>
    n.addEventListener("click", () => {
        document.body.style.overflow = "unset";
        isOpen = false;
        menu.classList.remove("active");
        navMenu.forEach((item) => {
            item.classList.remove("active");
        });
    })
);
