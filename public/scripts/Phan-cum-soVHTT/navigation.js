function navigate(item_id) {
  let link = "/";
  if (item_id == "manage__billboards" || item_id == "to__list__btn")
    link = "/management/billboards";
  if (item_id == "check__requests") link = "/management/licenses";
  if (item_id == "list__reports") link = "/management/reports";
  if (item_id == "profile") link = "/management/profile";
  if (item_id == "manage__accounts") link = "/management/accounts";
  if (item_id == "map__btn") link = "/management/billboards/map";

  window.location.href = link;
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  let active_id = "";

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
  }

  let active_el = document.getElementById(active_id);
  console.log(active_el);
  active_el.classList.add("current");
});
