document.getElementById("report-list").addEventListener("click", () => {
  window.location.href = "/dashboard/report";
});

document.getElementById("license-list").addEventListener("click", () => {
  window.location.href = "/dashboard/license";
});

document.getElementById("edit-list").addEventListener("click", () => {
  window.location.href = "/dashboard/request/edit";
});

document.getElementById("billboard-list").addEventListener("click", () => {
  window.location.href = "/dashboard/advertise";
});

function navigate(item_id) {
  if (item_id == "to__list__btn") {
    let link = "/dashboard/advertise";
    window.location.href = link;
  }
  if (item_id == "map__btn") {
    let link = "/dashboard";
    window.location.href = link;
  }
}

function navigate(item_id, id) {
  if (item_id == "profile") link = "/management/profile/" + id;
  console.log(link);
  window.location.href = link;
}

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
