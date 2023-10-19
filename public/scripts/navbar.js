let primary_header = $("#primary-header");
let burger = $("#burger");
let primary_navigation_bar = $("#primary-navigation-bar");
let profile = $("#profile");

burger.on("click", (e) => {
  primary_header.toggleClass("active");
});

profile.on("click", (e) => {
  primary_header.toggleClass("active");
});

profile.on("click", (e) => {
  authentication_section.addClass("active");
});
