function passToEditModal(btn) {
    document.querySelector("#id__edit").value = btn.dataset.billboardId;
    document.querySelector("#billboard__address__edit").value =
        btn.dataset.billboardAddress;
    let size_data = btn.dataset.billboardSize.split("x");
    document.querySelector("#billboard__height__edit").value =
        size_data[0].split("m")[0];
    document.querySelector("#billboard__width__edit").value =
        size_data[1].split("m")[0];
    document.querySelector("#billboard__amount__edit__input").value =
        btn.dataset.billboardAmount.split(" ")[0];
}

function passToDeleteModal(btn) {
    document.querySelector("#id__delete").value = btn.dataset.billboardId;
}

async function editBillboard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/billboards", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: e.target.id_edit.value,

            type: e.target.billboard_type_selector_edit.options[
                e.target.billboard_type_selector_edit.selectedIndex
            ].text,

            place: e.target.billboard_address_input_edit.value,

            type_advertise:
                e.target.ad_type_selector_edit.options[
                    e.target.ad_type_selector_edit.selectedIndex
                ].text,

            place_type:
                e.target.land_type_selector_edit.options[
                    e.target.land_type_selector_edit.selectedIndex
                ].text,

            size:
                e.target.billboard_height_input_edit.value +
                "mx" +
                e.target.billboard_width_input_edit.value +
                "m",

            amount: e.target.billboard_amount_input_edit.value,
            status: e.target.billboard_status_selector_edit.options[
                e.target.billboard_status_selector_edit.selectedIndex
            ].text,
        })
    );
    console.log(xhr.responseText);
    $("#Modify__modal").modal("hide");
    showToast("save__success__toast");
}

async function deleteBillboard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/management/billboards", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ id: e.target.id_delete.value }));
    console.log(xhr.responseText);
    $("#delete__confirm__modal").modal("hide");
    showToast("delete__success__toast");
}

//toggle textarea
function toggleTextarea(checkbox_id, textarea_id) {
    const textarea_el = document.getElementById(textarea_id);
    const checkbox_el = document.getElementById(checkbox_id);
    console.log(textarea_el);
    console.log(checkbox_el);
    if (checkbox_el.checked) {
        textarea_el.style.display = "flex";
    } else textarea_el.style.display = "none";
}

//billboard class
// class Billboard {
// 	constructor(geometry, properties, license, company_info) {
// 		this.globalid = properties.globalid
// 		this.type_billboard = properties.type
// 		this.address = properties.place
// 		this.geometry = geometry
// 		this.properties = properties
// 		this.company_info = company_info
// 		this.license = license
// 	}
// }

//assign status
// function assignStatus(item_id) {
// 	const status_num = item_id % 4
// 	let status = new String("	")
// 	switch (+status_num) {
// 		case 1: {
// 			status = `<li class="list__col3 fw-semibold" style="color: #329a44">
// 										Đã cấp phép
// 									</li>`
// 			break
// 		}
// 		case 2: {
// 			status = `<li class="list__col3 fw-semibold" style="color: #e7b400">
// 										Chờ cấp phép
// 									</li>`
// 			break
// 		}
// 		case 3: {
// 			status = `<li class="list__col3 fw-semibold" style="color: #3a65d6">
// 										Đã quy hoạch
// 									</li>`
// 			break
// 		}
// 		case 0: {
// 			status = `<li class="list__col3 fw-semibold" style="color: #db3232">
// 										Chưa quy hoạch
// 									</li>`
// 			break
// 		}
// 		default: {
// 			status = `<li class="list__col3 fw-semibold" style="color: #db3232">
// 										Chưa quy hoạch
// 									</li>`
// 			break
// 		}
// 	}
// 	return status
// }

// //assign button states (DuyetYCCapPhep)
// function assignButtonStates(item_id) {
// 	const status_num = item_id % 4
// 	let buttons = new String("	")
// 	switch (+status_num) {
// 		case 1: {
// 			buttons = `<ul class="buttons__container__column">
// 												<li>
// 													<button
// 														class="btn btn-success mb-2 nowrap"
// 														onclick="showToast('accept__success__toast')">
// 														<i class="bi bi-check-circle"></i> Cấp phép
// 													</button>
// 												</li>
// 												<li>
// 													<button
// 														class="btn btn-outline-warning mb-2 nowrap"
// 														data-bs-toggle="modal"
// 														data-bs-target="#require__changes__modal">
// 														<i class="bi bi-pencil"></i> YC chỉnh
// 													</button>
// 												</li>
// 												<li>
// 													<button
// 														class="btn btn-danger nowrap"
// 														data-bs-toggle="modal"
// 														data-bs-target="#deny__confirm__modal">
// 														<i class="bi bi-x-lg"></i> Từ chối
// 													</button>
// 												</li>
// 											</ul>`
// 			break
// 		}
// 		case 2: {
// 			buttons = `<ul class="buttons__container__column">
// 												<li>
// 													<button
// 														class="btn btn-success mb-2 nowrap"
// 														onclick="showToast('accept__success__toast')">
// 														<i class="bi bi-check-circle"></i> Cấp phép
// 													</button>
// 												</li>
// 												<li>
// 													<button
// 														class="btn btn-outline-warning mb-2 nowrap"
// 														data-bs-toggle="modal"
// 														data-bs-target="#require__changes__modal">
// 														<i class="bi bi-pencil"></i> YC chỉnh
// 													</button>
// 												</li>
// 												<li>
// 													<button
// 														class="btn btn-danger nowrap"
// 														data-bs-toggle="modal"
// 														data-bs-target="#deny__confirm__modal">
// 														<i class="bi bi-x-lg"></i> Từ chối
// 													</button>
// 												</li>
// 											</ul>`
// 			break
// 		}
// 		case 3: {
// 			buttons = `<ul class="buttons__container__column">
// 												<li>
// 													<button class="btn btn-success mb-2 nowrap disabled">
// 														<i class="bi bi-check-circle"></i> Cấp phép
// 													</button>
// 												</li>
// 												<li>
// 													<button
// 														class="btn btn-outline-warning mb-2 nowrap"
// 														data-bs-toggle="modal"
// 														data-bs-target="#require__changes__modal">
// 														<i class="bi bi-pencil"></i> YC chỉnh
// 													</button>
// 												</li>
// 												<li>
// 													<button
// 														class="btn btn-danger nowrap disabled"
// 														data-bs-toggle="modal"
// 														data-bs-target="#deny__confirm__modal">
// 														<i class="bi bi-x-lg"></i> Từ chối
// 													</button>
// 												</li>
// 											</ul>`
// 			break
// 		}
// 		case 0: {
// 			buttons = `<ul class="buttons__container__column">
// 												<li>
// 													<button class="btn btn-success mb-2 nowrap disabled">
// 														<i class="bi bi-check-circle"></i> Cấp phép
// 													</button>
// 												</li>
// 												<li>
// 													<button
// 														class="btn btn-outline-warning mb-2 nowrap disabled">
// 														<i class="bi bi-pencil"></i> YC chỉnh
// 													</button>
// 												</li>
// 												<li>
// 													<button class="btn btn-danger nowrap disabled">
// 														<i class="bi bi-x-lg"></i> Từ chối
// 													</button>
// 												</li>
// 											</ul>`
// 			break
// 		}
// 		default: {
// 			buttons = `<ul class="buttons__container__column">
// 												<li>
// 													<button class="btn btn-success mb-2 nowrap disabled">
// 														<i class="bi bi-check-circle"></i> Cấp phép
// 													</button>
// 												</li>
// 												<li>
// 													<button
// 														class="btn btn-outline-warning mb-2 nowrap disabled">
// 														<i class="bi bi-pencil"></i> YC chỉnh
// 													</button>
// 												</li>
// 												<li>
// 													<button class="btn btn-danger nowrap disabled">
// 														<i class="bi bi-x-lg"></i> Từ chối
// 													</button>
// 												</li>
// 											</ul>`
// 			break
// 		}
// 	}
// 	return buttons
// }

// //create list item
// function createListItem(advertisement) {
// 	let new_item = document.createElement("div")
// 	const id = advertisement.globalid
// 	new_item.className = "card shadow-sm"
// 	new_item.id = "list__item" + id
// 	new_item.innerHTML = `
// 							<div class="card-header" id="brief__info${id}">
// 								<ul class="list__flex">
// 									<li class="list__col1">${advertisement.type_billboard}</li>
// 									<li class="list__col2">${advertisement.address}</li>
// 									${assignStatus(id)}
// 									<li class="list__col4">
// 										<button
// 											class="btn collapsed"
// 											id="collapse__btn${id}"
// 											type="button"
// 											onclick="toggleCollapseButton('collapse__btn${id}')"
// 											data-bs-toggle="collapse"
// 											data-bs-target="#full__info${id}"
// 											aria-expanded="false"
// 											aria-controls="full__info${id}">
// 											<i class="bi bi-chevron-down"></i>
// 										</button>
// 									</li>
// 								</ul>
// 							</div>
// 							<div
// 								id="full__info${id}"
// 								class="collapse"
// 								aria-labelledby="brief__info${id}">
// 								<div class="card-body">
// 									<ul id="full__info__list">
// 										<li class="mock__image__container">
// 											<div class="mock__image">&nbsp;</div>
// 											<div class="mock__image">&nbsp;</div>
// 										</li>
// 										<li>
// 											<p class="fw-bold">Thông tin bảng quảng cáo</p>
// 											<ul>
// 												<li>
// 													Kích thước: <span class="fw-bold">${advertisement.properties.size}</span>
// 												</li>
// 												<li>
// 													Số lượng:
// 													<span class="fw-bold">${advertisement.properties.amount}</span>
// 												</li>
// 												<li>
// 													Hình thức:
// 													<span class="fw-bold">${advertisement.properties.type_advertise}</span>
// 												</li>
// 												<li>
// 													Phân loại: <span class="fw-bold">${advertisement.properties.place_type}</span>
// 												</li>
// 											</ul>
// 										</li>
// 										<li>
// 											<p class="fw-bold">Thông tin công ty</p>
// 											<ul>
// 												<li>
// 													Tên công ty:
// 													<span class="fw-bold">${advertisement.company_info.name}</span>
// 												</li>
// 												<li>
// 													Email liên hệ:
// 													<span class="fw-bold">${advertisement.company_info.contact}</span>
// 												</li>
// 												<li>
// 													Ngày bắt đầu:
// 													<span class="fw-bold">${advertisement.company_info.start_date}</span>
// 												</li>
// 												<li>
// 													Ngày kết thúc:
// 													<span class="fw-bold">${advertisement.company_info.end_date}</span>
// 												</li>
// 											</ul>
// 										</li>
// 										<li>
// 											<ul class="buttons__container">
// 												<li>
// 													<button
// 														class="btn btn-outline-warning me-3"
// 														data-bs-toggle="modal"
// 														data-bs-target="#Modify__modal">
// 														<i class="bi bi-pencil"></i>Chỉnh sửa
// 													</button>
// 												</li>
// 												<li>
// 													<button
// 														class="btn btn-danger"
// 														data-bs-toggle="modal"
// 														data-bs-target="#delete__confirm__modal">
// 														<i class="bi bi-trash"></i>Xoá
// 													</button>
// 												</li>
// 											</ul>
// 										</li>
// 									</ul>
// 								</div>
// 							</div>
// 	`
// 	return new_item
// }

// //add from billboard.json into page
// function loadBillboards() {
//     document.addEventListener("DOMContentLoaded", () => {
//         const list = document.getElementById("main__list");
//         let ads = [];
//         $.getJSON("../data/billboard.json", (data) => {
//             ads = data;
//         })
//             .done(() => {
//                 start_date = new Date(2023, 10, 23);
//                 end_date = new Date(2023, 10, 23);

//                 ads.forEach((ad) => {
//                     let billboard = new Billboard(
//                         ad.geometry,
//                         ad.properties,
//                         false,
//                         {
//                             name: "Công ti ABC",
//                             contact: "ctyABC@email.com",
//                             start_date:
//                                 start_date.getUTCDate() +
//                                 "/" +
//                                 start_date.getUTCMonth() +
//                                 "/" +
//                                 start_date.getUTCFullYear(),
//                             end_date:
//                                 end_date.getUTCDate() +
//                                 "/" +
//                                 end_date.getUTCMonth() +
//                                 "/" +
//                                 end_date.getUTCFullYear(),
//                         }
//                     );
//                     list.appendChild(createListItem(billboard));
//                 });
//             })
//             .fail(() => {
//                 console.error("error");
//             });
//     });
//     //toggle collapse button
// }
