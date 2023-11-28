function navigate(item_id) {
	let link = ""
	if (item_id == "manage__billboards" || item_id == "to__list__btn")
		link = "/Phan-cum-soVHTT/QuanLiQC.html"
	if (item_id == "check__requests") 
		link = "/Phan-cum-soVHTT/DuyetYCCapPhep.html"
	if (item_id == "list__reports") 
		link = "/Phan-cum-soVHTT/ThongKeBaoCao.html"
	if (item_id == "manage__accounts") 
		link = "/Phan-cum-soVHTT/QuanLiTK.html"
	if (item_id == "map__btn") 
		link = "/Phan-cum-soVHTT/map.html"

	window.location.href = link
}
