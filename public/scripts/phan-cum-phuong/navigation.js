document.getElementById("report-list").addEventListener("click", () => {
    window.location.href = "/Phan-cum-phuong-quan/danhsachbaocao.html";
})

document.getElementById("license-list").addEventListener("click", () => {
    window.location.href = "/Phan-cum-phuong-quan/danhsachcapphep.html";
})

document.getElementById("edit-list").addEventListener("click", () => {
    window.location.href = "/Phan-cum-phuong-quan/danhsachchinhsua.html";
})

document.getElementById("billboard-list").addEventListener("click", () => {
    window.location.href = "/Phan-cum-phuong-quan/quanlyquangcao.html";
})

function navigate(item_id) {
	if (item_id == "to__list__btn") {
        let link = "/Phan-cum-phuong-quan/quanlyquangcao.html";
	    window.location.href = link;
    }
    if (item_id == "map__btn") {
        let link = "/Phan-cum-phuong-quan/trangchu.html";
	    window.location.href = link;
    }
}


//toggle collapse button
function toggleCollapseButton(btn_id) {
    const btn = document.getElementById(btn_id)
    const icon = btn.querySelector("i")
    if (btn.classList.contains("collapsed")) {
        icon.classList.remove("bi-chevron-up")
        icon.classList.add("bi-chevron-down")
    } else {
        icon.classList.add("bi-chevron-up")
        icon.classList.remove("bi-chevron-down")
    }
}

