//load more data
function getQuery() {
    let curr_query = window.location.search;
    curr_query += curr_query.split("?")[1] ? "" : "?";

    return curr_query;
}

//add & symbol to query
function addAnd(curr_query) {
    curr_query +=
        curr_query != "?" && curr_query.substring(curr_query.length - 1) != "&"
            ? "&"
            : "";
    return curr_query;
}

function isCharNumber(c) {
    return typeof c === "string" && c.length == 1 && c >= "0" && c <= "9";
}

//decode HTML special chars
function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

//pass query values to elements
document.addEventListener("DOMContentLoaded", () => {
    let search_input = document.getElementById("search__input");
    let query = getQuery();
    let splittedQuery = "";
    let search_query_val = "";
    let sort_query_val = "";

    if (query.includes("search=")) {
        splittedQuery = query.split("search=");
        for (let i = 0; i < splittedQuery[1].length; i++) {
            if (splittedQuery[1][i] == "&") {
                break;
            }
            search_query_val += splittedQuery[1][i];
        }
        search_input.value = decodeURIComponent(search_query_val);
    }

    if (!query.includes("sort=")) {
        let active_li = document.querySelector("li#newest");
        active_li.style = "pointer-events: none";
        active_li.querySelector("button").classList.remove("btn-light");
        active_li.querySelector("button").classList.add("btn-primary");
    } else {
        splittedQuery = query.split("sort=");
        for (let i = 0; i < splittedQuery[1].length; i++) {
            if (splittedQuery[1][i] == "&") {
                break;
            }
            sort_query_val += splittedQuery[1][i];
        }
        let active_li = document.querySelector("li#" + sort_query_val);
        active_li.style = "pointer-events: none";
        active_li.querySelector("button").classList.remove("btn-light");
        active_li.querySelector("button").classList.add("btn-primary");
    }
});

//sort the queries: filters -> search -> sort -> page
function sortQuery(query) {
    let query_arr = query.split("&");
    let field_list = [
        "search=",
        "district=",
        "ward=",
        "item-type=",
        "ad-type=",
        "place-type=",
        "status=",
        "sort=",
        "page=",
    ];
    let sorted_arr = [];

    for (const query of query_arr) {
        query.replace("&", "");
        for (let i = 0; i < field_list.length; i++) {
            if (sorted_arr[i] != null || sorted_arr[i] != "") {
                if (query.includes(field_list[i])) {
                    sorted_arr[i] = query;
                    break;
                }
            }
        }
    }

    sorted_arr = sorted_arr.filter((el) => {
        return el != null || el != "";
    });

    return sorted_arr.join("&");
}

//remove page query if other queries are added
function removePageQuery(query) {
    if (query.includes("page=") == true) {
        let splittedQuery = query.split("page=");
        let page_val = splittedQuery[1][0];
        for (let i = 1; i < splittedQuery.length; i++) {
            if (!isCharNumber(splittedQuery[1][i])) {
                break;
            }
            page_val += splittedQuery[1][i];
        }
        query = query.replace("page=" + page_val, "");
        console.log(page_val);
        return query;
    }

    return query;
}

//

//search
function searchItems(e) {
    e.preventDefault();

    let search_value = e.target.search_input.value;
    let query = getQuery();

    query = removePageQuery(query);
    query = addAnd(query);
    //add in the search query
    if (!query.includes("search=")) {
        query += "search=" + search_value;
    } else {
        let splittedQuery = query.split("search=");
        let old_val = splittedQuery[1][0];
        for (let i = 1; i < splittedQuery[1].length; i++) {
            if (splittedQuery[1][i] == "&") {
                break;
            }
            old_val += splittedQuery[1][i];
        }
        query = query.replace("search=" + old_val, "search=" + search_value);
        if (query.substring(query.length - 1) == "&") {
            query.slice(0, -1);
        }
    }
    query = sortQuery(query);

    window.location.search = query;
}

//sort
function sortItems(sort_value) {
    let query = getQuery();

    query = removePageQuery(query);
    query = addAnd(query);

    if (!query.includes("sort=")) {
        query += "sort=" + sort_value;
    } else {
        let splittedQuery = query.split("sort=");
        let old_val = splittedQuery[1][0];
        for (let i = 1; i < splittedQuery[1].length; i++) {
            if (splittedQuery[1][i] == "&") {
                break;
            }
            old_val += splittedQuery[1][i];
        }
        query = query.replace("sort=" + old_val, "sort=" + sort_value);
        if (query.substring(query.length - 1) == "&") {
            query.slice(0, -1);
        }
    }
    query = sortQuery(query);

    window.location.search = query;
}

document.addEventListener("DOMContentLoaded", () => {
    let li_items = document.getElementById("sort__opts").children;

    for (let i = 0; i < li_items.length; i++) {
        li_items[i].onclick = () => {
            sortItems(li_items[i].id);
        };
    }
});

//filter
function filterItems() {
    let query = getQuery();
    query = removePageQuery(query);
    query = addAnd(query);

    let district_filter = document.getElementById(
        "district__filter__container"
    );
    let type_filter = document.getElementById("type__filter__container");
    let ad_type_filter = document.getElementById("ad__type__filter__container");
    let place_type_filter = document.getElementById(
        "place__type__filter__container"
    );
    let status_filter = document.getElementById("status__filter__container");

    let district_arr = [];
    if (district_filter.querySelector("#district__toggle").checked) {
        let district_opts = district_filter.querySelector("#district-info");

        let selected_opts = district_opts.querySelectorAll(
            "input[type=checkbox]:checked"
        );
        district_arr = district_arr.filter((n) => n);
        for (let i in selected_opts) {
            district_arr.push(selected_opts[i].id);
        }
    }
    district_arr = district_arr.filter((n) => n);

    for (let i in district_arr) {
        if (district_arr[i] != null && district_arr[i].includes(",") == true) {
            district_arr[i] = district_arr[i].replace(",", "/");
        }
    }

    let type_arr = [];
    if (
        window.location.pathname.includes("billboards") == false &&
        type_filter.querySelector("#type__toggle").checked
    ) {
        let type_opts = type_filter.querySelector("#type-info");

        let selected_opts = type_opts.querySelectorAll(
            "input[type=checkbox]:checked"
        );
        for (let i in selected_opts) {
            type_arr.push(selected_opts[i].id);
        }
        type_arr = type_arr.filter((n) => n);

        for (let i in type_arr) {
            if (type_arr[i].includes(",") == true) {
                type_arr[i] = type_arr[i].replace(",", "/");
            }
        }
    }

    let ad_type_arr = [];
    if (
        (window.location.pathname.includes("billboards") ||
            window.location.pathname.includes("licenses")) &&
        ad_type_filter.querySelector("#ad__type__toggle").checked
    ) {
        let ad_type_opts = ad_type_filter.querySelector("#ad-type-info");

        let selected_opts = ad_type_opts.querySelectorAll(
            "input[type=checkbox]:checked"
        );
        for (let i in selected_opts) {
            ad_type_arr.push(selected_opts[i].id);
        }
    }
    ad_type_arr = ad_type_arr.filter((n) => n);

    for (let i in ad_type_arr) {
        if (ad_type_arr[i] != null && ad_type_arr[i].includes(",") == true) {
            ad_type_arr[i] = ad_type_arr[i].replace(",", "/");
        }
    }

    let place_type_arr = [];
    if (
        (window.location.pathname.includes("billboards") ||
            window.location.pathname.includes("licenses")) &&
        place_type_filter.querySelector("#place__type__toggle").checked
    ) {
        let place_type_opts =
            place_type_filter.querySelector("#place-type-info");

        let selected_opts = place_type_opts.querySelectorAll(
            "input[type=checkbox]:checked"
        );
        for (let i in selected_opts) {
            place_type_arr.push(selected_opts[i].id);
        }
    }
    place_type_arr = place_type_arr.filter((n) => n);

    for (let i in place_type_arr) {
        if (
            place_type_arr[i] != null &&
            place_type_arr[i].includes(",") == true
        ) {
            place_type_arr[i] = place_type_arr[i].replace(",", "/");
        }
    }

    let status_arr = [];
    if (status_filter.querySelector("#status__toggle").checked) {
        let status_opts = status_filter.querySelector("#status-info");

        let selected_opts = status_opts.querySelectorAll(
            "input[type=checkbox]:checked"
        );
        for (let i in selected_opts) {
            status_arr.push(selected_opts[i].id);
        }
    }

    status_arr = status_arr.filter((n) => n);

    for (let i in status_arr) {
        if (status_arr[i] != null && status_arr[i].includes(",") == true) {
            status_arr[i] = status_arr[i].replace(",", "/");
        }
    }

    let district_vals = district_arr.join();
    let type_vals = type_arr.join();
    let ad_type_vals = ad_type_arr.join();
    let place_type_vals = place_type_arr.join();
    let status_vals = status_arr.join();

    if (district_vals != "" && district_vals != null) {
        if (!query.includes("district=")) {
            query += "district=" + district_vals;
        } else {
            let splittedQuery = query.split("district=");
            let old_val = splittedQuery[1][0];
            let i = 1;
            while (splittedQuery[1][i] != "&") {
                old_val += splittedQuery[1][i];
                i++;
            }
            query = query.replace(
                "district=" + old_val,
                "district=" + district_vals
            );
        }
        query = addAnd(query);
    } else if (query.includes("district=")) {
        let splittedQuery = query.split("district=");
        let old_val = splittedQuery[1][0];
        let i = 1;
        while (splittedQuery[1][i] != "&") {
            old_val += splittedQuery[1][i];
            i++;
        }
        query = query.replace("district=" + old_val, "");
    }

    if (type_vals != "" && type_vals != null) {
        if (!query.includes("item-type=")) {
            query += "item-type=" + type_vals;
        } else {
            let splittedQuery = query.split("item-type=");
            let old_val = splittedQuery[1][0];
            let i = 1;
            while (splittedQuery[1][i] != "&") {
                old_val += splittedQuery[1][i];
                i++;
            }
            query = query.replace(
                "item-type=" + old_val,
                "item-type=" + type_vals
            );
        }

        query = addAnd(query);
    } else if (query.includes("item-type=")) {
        let splittedQuery = query.split("item-type=");
        let old_val = splittedQuery[1][0];
        let i = 1;
        while (splittedQuery[1][i] != "&") {
            old_val += splittedQuery[1][i];
            i++;
        }
        query = query.replace("item-type=" + old_val, "");
    }

    if (ad_type_vals != "" && ad_type_vals != null) {
        if (!query.includes("ad-type=")) {
            query += "ad-type=" + ad_type_vals;
        } else {
            let splittedQuery = query.split("ad-type=");
            let old_val = splittedQuery[1][0];
            let i = 1;
            while (splittedQuery[1][i] != "&") {
                old_val += splittedQuery[1][i];
                i++;
            }
            query = query.replace(
                "ad-type=" + old_val,
                "ad-type=" + ad_type_vals
            );
        }

        query = addAnd(query);
    } else if (query.includes("ad-type=")) {
        let splittedQuery = query.split("ad-type=");
        let old_val = splittedQuery[1][0];
        let i = 1;
        while (splittedQuery[1][i] != "&") {
            old_val += splittedQuery[1][i];
            i++;
        }
        query = query.replace("ad-type=" + old_val, "");
    }

    if (place_type_vals != "" && place_type_vals != null) {
        if (!query.includes("place-type=")) {
            query += "place-type=" + place_type_vals;
        } else {
            let splittedQuery = query.split("place-type=");
            let old_val = splittedQuery[1][0];
            let i = 1;
            while (splittedQuery[1][i] != "&") {
                old_val += splittedQuery[1][i];
                i++;
            }
            query = query.replace(
                "place-type=" + old_val,
                "place-type=" + place_type_vals
            );
        }

        query = addAnd(query);
    } else if (query.includes("place-type=")) {
        let splittedQuery = query.split("place-type=");
        let old_val = splittedQuery[1][0];
        let i = 1;
        while (splittedQuery[1][i] != "&") {
            old_val += splittedQuery[1][i];
            i++;
        }
        query = query.replace("place-type=" + old_val, "");
    }

    if (status_vals != "" && status_vals != null) {
        if (!query.includes("status=")) {
            query += "status=" + status_vals;
        } else {
            let splittedQuery = query.split("status=");
            let old_val = splittedQuery[1][0];
            let i = 1;
            while (splittedQuery[1][i] != "&") {
                old_val += splittedQuery[1][i];
                i++;
            }
            query = query.replace("status=" + old_val, "status=" + status_vals);
        }

        query = addAnd(query);
    } else if (query.includes("status=")) {
        let splittedQuery = query.split("status=");
        let old_val = splittedQuery[1][0];
        let i = 1;
        while (splittedQuery[1][i] != "&") {
            old_val += splittedQuery[1][i];
            i++;
        }
        query = query.replace("status=" + old_val, "");
    }

    query = sortQuery(query);
    window.location.search = query;
}

//delete filters
function removeFilters() {
    let query = getQuery();

    if (
        query.includes("district=") ||
        query.includes("item-type=") ||
        query.includes("ad-type=") ||
        query.includes("place-type=") ||
        query.includes("status=")
    ) {
        let splittedQuery = query.split("district=");
        let district_vals = splittedQuery[1][0];
        for (let i = 1; i < splittedQuery[1].length; i++) {
            if (splittedQuery[1][i] == "&") {
                break;
            }
            district_vals += splittedQuery[1][i];
        }

        splittedQuery = query.split("item-type=");
        let type_vals = splittedQuery[1][0];
        for (let i = 1; i < splittedQuery[1].length; i++) {
            if (splittedQuery[1][i] == "&") {
                break;
            }
            type_vals += splittedQuery[1][i];
        }

        splittedQuery = query.split("ad-type=");
        let ad_type_vals = splittedQuery[1][0];
        for (let i = 1; i < splittedQuery[1].length; i++) {
            if (splittedQuery[1][i] == "&") {
                break;
            }
            ad_type_vals += splittedQuery[1][i];
        }

        splittedQuery = query.split("place-type=");
        let place_type_vals = splittedQuery[1][0];
        for (let i = 1; i < splittedQuery[1].length; i++) {
            if (splittedQuery[1][i] == "&") {
                break;
            }
            place_type_vals += splittedQuery[1][i];
        }

        splittedQuery = query.split("status=");
        let status_vals = splittedQuery[1][0];
        for (let i = 1; i < splittedQuery[1].length; i++) {
            if (splittedQuery[1][i] == "&") {
                break;
            }
            status_vals += splittedQuery[1][i];
            console.log("status val:" + status_vals);
        }

        query = query.replace("district=" + district_vals, "");
        query = query.replace("item-type=" + type_vals, "");
        query = query.replace("ad-type=" + ad_type_vals, "");
        query = query.replace("place-type=" + place_type_vals, "");
        query = query.replace("status=" + status_vals, "");

        query = sortQuery(query);
        window.location.search = query;
    } else {
        let filter_container = document.getElementById("filter__modal");
        let filter_checkboxes = filter_container.querySelectorAll(
            "input[type=checkbox]:checked"
        );
        for (let i = 0; i < filter_checkboxes.length; i++) {
            if (filter_checkboxes[i].checked) {
                filter_checkboxes[i].checked = false;
            }
        }

        let filter_lists = document.querySelectorAll(
            ".filter__info__container"
        );
        for (let i = 0; i < filter_lists.length; i++) {
            if (!filter_lists[i].classList.contains("hidden")) {
                filter_lists[i].classList.add("hidden");
            }
        }
    }
}

//change page
function changePage(page_id) {
    let query = getQuery();
    query = addAnd(query);

    if (!query.includes("page=")) {
        query += "page=" + page_id;
    } else {
        let splittedQuery = query.split("page=");
        let old_val = splittedQuery[1][0];
        let i = 1;
        while (isCharNumber(splittedQuery[1][i])) {
            old_val += splittedQuery[1][i];
            i++;
        }
        query = query.replace("page=" + old_val, "page=" + page_id);
    }
    query = sortQuery(query);
    window.location.search = query;
}

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


//change date format
function changeDateFormat(date){
    return date.toLocaleDateString("vi-VN")
}

//toggle filter
function toggleFilter(radio_id, list_id) {
    let radio = document.getElementById(radio_id);
    let list = document.getElementById(list_id);

    if (radio.checked) {
        list.classList.remove("hidden");
    } else {
        list.classList.add("hidden");
    }
}

//show toast
function showToast(toast_id) {
    const toast_element = document.getElementById(toast_id);
    let toast_item = new bootstrap.Toast(toast_element);
    toast_item.show();
}

document.addEventListener("DOMContentLoaded", () => {
    //reload after toast disappears
    let toasts = document.querySelectorAll(".toast");
    toasts.forEach((toast) => {
        toast.addEventListener("hidden.bs.toast", () => {
            location.reload();
        });
    });

    let function_btn_container = document.getElementById(
        "function__btn__container"
    );
    //show map button if on billboards page
    if (window.location.pathname.includes("billboards")) {
        function_btn_container.innerHTML = `
            <button
                    type="button"
                    class="btn btn-primary nowrap"
                    id="map__btn"
                    onclick="navigate(this.id)"
                >
                    <i class="bi bi-map"></i> Xem trên bản đồ
                </button>
                `;
    }

    //show create district
    else if (window.location.pathname.includes("districts_wards")) {
        function_btn_container.innerHTML = `
        <button
                    type="button"
                    class="btn btn-success nowrap"
                    id="create__account__btn"
                    data-bs-toggle="modal"
                    data-bs-target="#create__district__modal"
                >
                    +&ensp;Thêm Quận/Huyện
                </button>
        `;
    }
    //show create account button and hide map button if on accounts page
    else if (window.location.pathname.includes("accounts")) {
        function_btn_container.innerHTML = `
                <button
                    type="button"
                    class="btn btn-success nowrap"
                    id="create__account__btn"
                    data-bs-toggle="modal"
                    data-bs-target="#Create__modal"
                >
                    +&ensp;Tạo tài khoản
                </button>
        `;
    }

    // let toggle_password__btns = document.querySelectorAll(".togglePassword");
    // if(toggle_password__btns != null &&)

    // let ratio = 0.35;
    // let custom_scroll_short = document.getElementById("cards__container");
    // custom_scroll_short.addEventListener("wheel", (event) => {
    //     event.preventDefault();

    //     let target = custom_scroll_short.scrollTop + event.deltaY * ratio;

    //     custom_scroll_short.scrollTo({
    //         top: target,
    //         behavior: "smooth",
    //     });
    // });
});
