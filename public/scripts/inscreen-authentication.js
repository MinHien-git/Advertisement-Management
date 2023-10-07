let authentication_section = $("#inscreen-authentication-section");
let close_button = $("#inscreen-authen-close");
let switch_login = $("#inscreen-switch-login");
let switch_register = $("#inscreen-switch-register");

let login_form = $("#inscreen-form-login");
let signin_form = $("#inscreen-form-register");

let current_selection = 0;

switch_login.on("click", (e) => {
  if (current_selection == 1) {
    login_form.toggleClass("active");
    switch_login.toggleClass("active");

    signin_form.toggleClass("active");
    switch_register.toggleClass("active");
    current_selection = 0;
  }
});

switch_register.on("click", (e) => {
  if (current_selection == 0) {
    signin_form.toggleClass("active");
    switch_register.toggleClass("active");

    login_form.toggleClass("active");
    switch_login.toggleClass("active");
    current_selection = 1;
  }
});

close_button.on("click", (e) => {
  authentication_section.removeClass("active");
});
