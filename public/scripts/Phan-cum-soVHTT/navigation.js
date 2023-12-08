function navigate(item_id) {
	let link = "/"
    if (item_id == "manage__billboards" || item_id == "to__list__btn")
        link = "/management/billboards"
    if (item_id == "check__requests") link = "/management/licenses"
    if (item_id == "list__reports") link = "/management/reports"
    if (item_id == "manage__accounts") link = "/management/accounts"
    if (item_id == "map__btn") link = "/management/billboards/map"

	window.location.href = link
}
