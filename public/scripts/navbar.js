let primary_header = $("#primary-header");
let burger = $("#burger");
// let logout = $("#logout button");
let primary_navigation_bar = $("#primary-navigation-bar");

burger.on("click", (e) => {
    primary_header.toggleClass("active");
});

// logout.on("click", (e) => {
//   e.preventDefault();
//   window.location.href = "/";
// });

let navbar = document.querySelectorAll("#primary-items-list li");
navbar.forEach((e) => {
    e.addEventListener("mouseover", () => {
        e.style.color = "hsl(219, 100%, 41%)";
    });
    e.addEventListener("mouseout", () => {
        e.style.color = "black";
    });
});



document.addEventListener("DOMContentLoaded", () => {
    let nav_btns = document.querySelectorAll(".nav__item");

    nav_btns.forEach((e) => {
        let label = e.querySelector("#nav__item__label");
        e.addEventListener("mouseover", () => {
            label.style.color = "hsl(219, 100%, 41%)";
        });
        e.addEventListener("mouseout", () => {
            label.style.color = "black";
        });
    });

    let navbar_current = document.querySelectorAll(".nav__item.current");
    navbar_current.forEach((e) => {
        let icon = e.querySelector("#nav__item__icon");
        let label = e.querySelector("#nav__item__label");
        e.addEventListener("mouseover", () => {
            e.style.color = "hsl(219, 100%, 41%)";
            icon.style.color = "rgb(59, 123, 250)";
            label.style.color = "rgb(59, 123, 250)";
        });
        e.addEventListener("mouseout", () => {
            e.style.color = "white";
            icon.style.color = "white";
            label.style.color = "white";
        });
    });

    let li_current = document.querySelectorAll(".nav__dropdown__li.current");
    console.log(li_current);
    li_current.forEach((e) => {
        let list_icon = e.querySelector("#dropend__list__icon");
        let list_label = e.querySelector("#dropend__list__label");
        e.addEventListener("mouseover", () => {
            e.style.color = "hsl(219, 100%, 41%)";
            list_icon.style.color = "rgb(59, 123, 250)";
            list_label.style.color = "rgb(59, 123, 250)";
        });
        e.addEventListener("mouseout", () => {
            e.style.color = "white";
            list_icon.style.color = "white";
            list_label.style.color = "white";
        });
    });
});

