function passToDetailsModal(btn) {
    document.querySelector("#report__id").value = btn.dataset.reportId;
    document.querySelector("#report__state").value = btn.dataset.reportState;
    document.querySelector("#sender__name").innerHTML =
        "<strong>Tên người gửi:</strong> " + btn.dataset.senderName;
    document.querySelector("#sender__email").innerHTML =
        "<strong>Email:</strong> " + btn.dataset.senderEmail;
    document.querySelector("#sender__number").innerHTML =
        "<strong>Số điện thoại:</strong> " + btn.dataset.senderNumber;
    document.querySelector("#report__date").innerHTML =
        "<strong>Ngày báo cáo:</strong> " + btn.dataset.reportDate;
    document.querySelector("#report__place").innerHTML =
        "<strong>Địa điểm:</strong> " + btn.dataset.reportPlace;
    document.querySelector("#report__details").innerHTML =
        "<strong>Mô tả:</strong> " + btn.dataset.reportDetails;
    if (document.querySelector("#report__state").value === "1") {
        document.querySelector(".b__container").innerHTML = `
                    <button
                    type="button"
                    class="btn btn-success"
                    id="approve__btn"
                    data-bs-toggle="modal"
                    >Cấp phép
                    </button>

                    <button
                    type="button"
                    class="btn btn-primary"
                    id="change__btn"
                    data-bs-toggle="modal"
                    data-bs-target="#modalInput"
                    >Y/c đổi cách thức
                    </button>

                    <button
                    type="button"
                    class="btn btn-danger"
                    id="reject__btn"
                    data-bs-toggle="modal"
                    data-bs-target="#modalConfirm"
                    >
                    Bác bỏ
                    </button>`;
    }

    document.querySelector("#approve__btn").addEventListener("click", () => {
        respondResolve(document.querySelector("#report__id").value, 0);
    });
}

async function respondResolve(report_id, state) {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/reports", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: report_id,
            state: state,
        })
    );
    console.log(xhr.responseText);
    if (state === 0) {
        showToast("accept__success__toast");
    } else if (state === 2) {
        showToast("deny__success__toast");
    }
}

async function sendReportChangeRequest(report_id, details) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/management/reports", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: report_id,
            details: details,
        })
    );
    console.log(xhr.responseText);
    showToast("send__success__toast");
}

// //report class
// class Report {
// 	constructor(geometry, type, properties) {
// 		this.globalid = properties.globalid
// 		this.type = type
// 		this.sender_name = properties.sender_name
// 		this.sender_email = properties.sender_email
// 		this.sender_number = properties.sender_number
// 		this.send_date = properties.send_day
// 		this.details = properties.details
// 		this.address = properties.place
// 		this.image = properties.image
// 		this.status = properties.status
// 	}
// }

// //assign report status
// function assignReportStatus(item_id) {
// 	const status_num = item_id % 4
// 	let status = new String("	")
// 	switch (+status_num) {
// 		case 1: {
// 			status = `<li class="list__col4 fw-semibold" style="color: #e7b400">
// 										Chờ xử lí
// 									</li>`
// 			break
// 		}
// 		case 2: {
// 			status = `<li class="list__col4 fw-semibold" style="color: #e7b400">
// 										Chờ xử lí
// 									</li>`
// 			break
// 		}
// 		case 3: {
// 			status = `<li class="list__col4 fw-semibold" style="color: #329a44">
// 										Đã xử lí
// 									</li>`
// 			break
// 		}
// 		case 0: {
// 			status = `<li class="list__col4 fw-semibold" style="color: #db3232">
// 										Đã bác bỏ
// 									</li>`
// 			break
// 		}
// 		default: {
// 			status = `<li class="list__col4 fw-semibold" style="color: #db3232">
// 										Đã bác bỏ
// 									</li>`
// 			break
// 		}
// 	}
// 	return status
// }

// //change report type color
// function reportTypeColor(report_type) {
// 	let color = ""
// 	switch (report_type) {
// 		case "Tố giác sai phạm": {
// 			color = "#db3232"
// 			break
// 		}
// 		case "Đăng ký nội dung": {
// 			color = "#3a65d6"
// 			break
// 		}
// 		case "Đóng góp ý kiến": {
// 			color = "#329a44"
// 			break
// 		}
// 		case "Giải đáp thắc mắc": {
// 			color = "#e7b400"
// 			break
// 		}
// 		default: {
// 			color = "#e7b400"
// 			break
// 		}
// 	}
// 	return color
// }

// //create report list item
// function createReportListItem(report) {
// 	let new_item = document.createElement("div")
// 	const id = report.globalid
// 	new_item.className = "card shadow-sm"
// 	new_item.id = "list__item" + id
// 	new_item.innerHTML = `<div class="card-header" id="brief__info${id}">
// 								<ul class="list__flex">
// 									<li class="list__col1"
//                                     style ="color: ${reportTypeColor(
// 																			report.type
// 																		)}">
//                                     ${report.type}</li>
// 									<li class="list__col2">${report.address}</li>
// 									<li class="list__col3">${report.send_date}</li>
// 									${assignReportStatus(id)}
// 									<li class="list__col5">
//                                         <button
//                                             class="btn flex-grow-0"
//                                             id="modal-btn"
//                                             type="button"
//                                             data-bs-toggle="modal"
//                                             data-bs-target="#modal"
//                                             style="width: 1rem">
//                                             <i class="bi bi-three-dots"></i>
//                                         </button>
//                                     </li>
// 								</ul>
// 							</div>`
// 	return new_item
// }

// //load report list from report.json
// function loadReports() {
// 	document.addEventListener("DOMContentLoaded", () => {
// 		const list = document.getElementById("main__list")
// 		let reports = []
// 		$.getJSON("../data/report.json", (data) => {
// 			reports = data
// 		}).done(() => {
// 			reports.forEach((rp) => {
// 				let report = new Report(rp.geometry, rp.type, rp.properties)
// 				list.appendChild(createReportListItem(report))
// 			})
// 		})
// 	})
// }

// //show toast
// function showToast(toast_id) {
// 	const toast_element = document.getElementById(toast_id)
// 	let toast_item = new bootstrap.Toast(toast_element)
// 	toast_item.show()
// }
