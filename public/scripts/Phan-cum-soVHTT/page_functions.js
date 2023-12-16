//UI changes
//toggle collapse button
function toggleCollapseButton(btn_id) {
    const btn = document.getElementById(btn_id);
    const icon = btn.querySelector("i");
    if (btn.classList.contains("collapsed")) {
        icon.classList.remove("bi-chevron-up");
        icon.classList.add("bi-chevron-down");
    } else {
        icon.classList.add("bi-chevron-up");
        icon.classList.remove("bi-chevron-down");
    }
}

//show toast
function showToast(toast_id) {
    const toast_element = document.getElementById(toast_id);
    let toast_item = new bootstrap.Toast(toast_element);
    toast_item.show();
}

//reload after toast disappears
document.addEventListener("DOMContentLoaded", () => {
    let toasts = document.querySelectorAll(".toast");
    toasts.forEach((toast) => {
        toast.addEventListener("hidden.bs.toast", () => {
            location.reload();
        });
    });
});
