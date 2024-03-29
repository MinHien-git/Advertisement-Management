function navigate(item_id) {
    let link = "/";
    if (item_id == "manage__billboards" || item_id == "to__list__btn")
        link = "/management/billboards";
    if (item_id == "manage__licenses") link = "/management/licenses";
    if (item_id == "manage__edit__requests") link = "/management/edit_requests";
    if (item_id == "manage__reports") link = "/management/reports";
    if (item_id == "manage__accounts") link = "/management/accounts";
    if (item_id == "map__btn") link = "/management/billboards/map";
    if (item_id == "manage__districts__wards")
        link = "/management/general/districts_wards";
    if (item_id == "manage__general__types")
        link = "/management/general/general_types";
    if (item_id == "manage__profile") link = "/management/profile";
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
        li_active_id = "billboards";
    } else if (path.includes("/management/licenses")) {
        active_id = "manage__billboards";
        li_active_id = "manage__licenses";
    } else if (path.includes("/management/edit_requests")) {
        active_id = "manage__billboards";
        li_active_id = "manage__edit__requests";
    } else if (path.includes("/management/reports")) {
        active_id = "manage__reports";
    } else if (path.includes("/management/accounts")) {
        active_id = "manage__accounts";
    } else if (path.includes("/management/profile")) {
        active_id = "user__profile";
    } else if (path.includes("/management/general")) {
        active_id = "general__info";
        if (path.includes("districts_wards")) {
            li_active_id = "manage__districts__wards";
        } else if (path.includes("general_types")) {
            li_active_id = "manage__general__types";
        }
    } else if (path.includes("/management/profile")) {
        active_id = "profile";
        li_active_id = "manage_profile";
    }

    let active_el = document.getElementById(active_id);
    active_el.classList.add("current");

    if (li_active_id != "" || li_active_id != null) {
        console.log(li_active_id);
        let li_active_el = document.getElementById(li_active_id);
        li_active_el.classList.add("current");
    }
});
