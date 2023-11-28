let primary_header = $("#primary-header");
let burger = $("#burger");
let logout = $("#logout button")
let primary_navigation_bar = $("#primary-navigation-bar");

burger.on("click", (e) => {
  primary_header.toggleClass("active");
});

logout.on("click", (e) => {
    e.preventDefault();
    window.location.href = "/Phan-cum-nguoi-dan/trangchu.html"
})

let navbar = document.querySelectorAll("#primary-items-list li");
navbar.forEach((e) => {
    e.addEventListener("mouseover", () => {
        e.style.transition = "color 50ms ease-in-out";
        e.style.color = "hsl(219, 90%, 69%)";
    });
    e.addEventListener("mouseout", () => {
        e.style.color = "black";
    })
})