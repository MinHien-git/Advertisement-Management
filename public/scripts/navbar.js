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
        e.style.color = "hsl(219, 100%, 41%)"
    })
    e.addEventListener("mouseout", () => {
        e.style.color = "black"
    })
})

let navbar_current = document.querySelectorAll(".current")
navbar_current.forEach((e) => {
    let icon = e.querySelector("#nav__item__icon")
    e.addEventListener("mouseover", () => {
        e.style.color = "hsl(219, 100%, 41%)"
        icon.style.color = "hsl(219, 100%, 41%)"
    })
    e.addEventListener("mouseout", () => {
        e.style.color = "white"
        icon.style.color = "white"
    })
})
