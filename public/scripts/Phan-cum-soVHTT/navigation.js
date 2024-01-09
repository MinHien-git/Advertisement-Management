function navigate(item_id) {
    let link = "/";
    if (item_id == "manage__billboards" || item_id == "to__list__btn")
        link = "/management/billboards";
    if (item_id == "manage__licenses") link = "/management/licenses";
    if (item_id == "manage__reports") link = "/management/reports";
    if (item_id == "manage__accounts") link = "/management/accounts";
    if (item_id == "map__btn") link = "/management/billboards/map";
    if (item_id == "manage__districts__wards")
        link = "/management/general/districts_wards";
    window.location.href = link;
}

function navigateToProfile(item_id, id) {
    if (item_id == "profile") link = "/management/profile/" + id;
    console.log(link);
    window.location.href = link;
}

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    let active_id = "";
    let li_active_id = "";

    if (
        path.includes("/management/billboards") ||
        path.includes("/management/billboards/map")
    ) {
        active_id = "manage__billboards";
    } else if (path.includes("/management/licenses")) {
        active_id = "check__requests";
    } else if (path.includes("/management/reports")) {
        active_id = "list__reports";
    } else if (path.includes("/management/accounts")) {
        active_id = "manage__accounts";
    } else if (path.includes("/management/profile")) {
        active_id = "user__profile";
    } else if (path.includes("/management/general")) {
        active_id = "general__info";
        if (path.includes("districts_wards"));
        li_active_id = "manage__districts__wards";
    }

    let active_el = document.getElementById(active_id);
    active_el.classList.add("current");

    if (li_active_id != "" || li_active_id != null) {
        let li_active_el = document.getElementById(li_active_id);
        li_active_el.classList.add("current");
    }
});
