function assignButton(item_id, advertisement) {
  const status_num = item_id % 4;
  let button_container = new String("	");
  switch (+status_num) {
    case 1: {
      button_container = `<ul class="buttons__container">
	  <li>
	  <button
		  class="btn btn-primary me-3"
		  data-bs-toggle="modal"
		  data-bs-target="#Modify__modal" onclick="">
		  <i class="bi bi-info-circle"></i> Thông tin
	  </button>
	</li>
	<li>
		<button
			class="btn btn-warning me-3"
			onclick="create_edit_request('${advertisement.address}')">
			<i class="bi bi-pencil"></i> Chỉnh sửa
		</button>
	</li>
	</ul>`;
      break;
    }
    case 2: {
      button_container = `<ul class="buttons__container">
		<li>
			<button
				class="btn btn-primary me-3"
				data-bs-toggle="modal"
				data-bs-target="#Modify__modal" onclick="">
				<i class="bi bi-info-circle"></i> Thông tin
			</button>
		</li>
		<li>
			<button
				class="btn btn-danger"
				onclick="">
				<i class="bi bi-trash"></i> Hủy yêu cầu
			</button>
		</li>
		</ul>`;
      break;
    }
    default: {
      button_container = `<ul class="buttons__container">
		<li>
			<button
				class="btn btn-primary me-3"
				data-bs-toggle="modal"
				data-bs-target="#Modify__modal" onclick="">
				<i class="bi bi-info-circle"></i> Thông tin
			</button>
		</li>
		<li>
			<button
				class="btn btn-warning me-3"
				onclick="create_edit_request('${advertisement.address}')">
				<i class="bi bi-pencil"></i> Chỉnh sửa
			</button>
		</li>
		<li>
			<button
				class="btn btn-success me-3"
				onclick="create_authorize_request('${advertisement.address}')">
				<i class="bi bi-clipboard2-check"></i> Tạo yêu cầu
			</button>
		</li>
		</ul>`;
      break;
    }
  }
  return button_container;
}

const table = document.querySelector("#main__list");
let advertisements = [];
// $.getJSON("../data/billboard.json", function (data) {
//   advertisements = data;
// })
//   .done(function () {
//     console.log(advertisements);
//     console.log("second success");

//     start_day = new Date(2023, 10, 23);
//     end_day = new Date(2025, 10, 23);

//     advertisements.forEach((ad) => {
//       let billboard = new Billboard(ad.geometry, ad.properties, false, {
//         name: "ABC Company",
//         contact: "ABCCompany@email.com",
//         start_day:
//           start_day.getUTCDate() +
//           "/" +
//           start_day.getUTCMonth() +
//           "/" +
//           start_day.getUTCFullYear(),
//         end_day:
//           end_day.getUTCDate() +
//           "/" +
//           end_day.getUTCMonth() +
//           "/" +
//           end_day.getUTCFullYear(),
//       });
//       table.appendChild(createCard(billboard));
//     });
//   })
//   .fail(function () {
//     console.log("error");
//   })
//   .always(function () {
//     console.log("complete");
//   });

function create_authorize_request(position = "", id = null) {
  if (request_node) {
    body.removeChild(request_node);
  }
  let report = `
	<section class="active" id="request-popup">
	<div id="report-section-form-container">
	<div id="inscreen-request-close" class="inscreen-request-close">
	  <img
		id="inscreen-authen-close"
		src="/images/close.png"
		alt="close button"
	  />
	</div>
	<form
	  id="inscreen-form-login"
	  class="form-container active"
	  method="post"
	  action="/dashboard/license/request"
	>
	  <input type="hidden" name="id" value="${id}">
	  <h2>Cấp phép Quảng cáo</h2>
	  <div class="form-section">
		<label for="street">Địa chỉ yêu cầu:</label>
		<textarea id="street">${position}</textarea>
	  </div>
	  <div class="form-section">
		<label for="type-billboard">Bảng quảng cáo:</label>
		<input
		  type="text"
		  name="type-billboard"
		  id="type-billboard"
		  value=""
		  placeholder="Chọn..."
		/>
	  </div>
	  
	  <div class="form-section">
		<label for="name">Thông tin công ty:</label>
		<input
		  type="text"
		  name="name"
		  id="name"
		  value=""
		  placeholder="Tên công ty"
		/>
	  </div>
	  <div class="form-section">
	  <label for="company-infomation">Thông tin liên lạc:</label>
	  <input
		type="text"
		name="contact"
		id="company-infomation"
		value=""
		placeholder="Email công ty"
	  />
	</div>
	<div class="flex size-information">
	<div class="form-section">
	  <label for="start-date">Ngày bắt đầu:</label>
	  <input
		type="date"
		name="start-date"
		id="start"
		value=""
		placeholder="Email công ty"
	  />
	</div>
	<div class="form-section">
	  <label for="end-date">Ngày kết thúc:</label>
	  <input
		type="date"
		name="end"
		id="end-date"
		value=""
		placeholder="Email công ty"
	  />
	</div>
	</div>
	<div class="form-section file-section">
		<p>Thông tin đính kèm:</p>
		<div class="file-button">
		  <label for="attached_files">Chọn</label>
		  <input
			type="file"
			name="attached_files"
			id="attached_files"
		  />
		</div>
	  </div>
	  <div class="form-section">
		<label for="tel">Thông tin chỉnh sửa:</label>
		<div id="editor"></div>
	  </div>
	  <div class="form-section">
		<button class="submit-button submit">Gửi</button>
	  </div>
	</form>
  </div>
  </section> `;
  request_node = document.createElement("section");
  request_node.setAttribute("id", "request-popup");
  request_node.classList.add("active");

  request_node.innerHTML += report;
  body.append(request_node);

  var close = $("#inscreen-request-close");
  close.on("click", () => {
    body.removeChild(request_node);
    request_node = null;
  });

  var quill = new Quill("#editor", {
    theme: "snow",
  });
}

function create_edit_request(billboard = null) {
  if (edit_node) {
    body.removeChild(edit_node);
  }
  let report = `
  <section class="active popup" id="report-popup">
  <div id="report-section-form-container">
  <div id="inscreen-report-close" class="inscreen-report-close">
	<img
	id="inscreen-authen-close"
	src="/images/close.png"
	alt="close button"
	/>
  </div>
  <form
	id="inscreen-form-login"
	class="form-container active"
	method="post"
	action="/dashboard/request"
  >
	<h2>Chỉnh sửa Bảng QC</h2>
	<div class="form-section">
	<input type="hidden" name="_id" value="${billboard?._id}">
	<label for="type">Loại quảng cáo:</label>
	<input type="text" name="type" id="type"
	  value="${billboard?.properties.type}"
	  placeholder="Chọn..."
	/>
	</div>
	<div class="form-section">
	<label for="street">Địa điểm:</label>
	<input type="text" id="street" name="place" value="${
    billboard?.properties.place
  }">
	</div>
	<div class="form-section">
	<label for="form">Hình thức:</label>
	<select
    class="form-select mb-3"
    id="ad__type__edit"
    name="ad_type_selector_edit"
    aria-label="ad type selector"
    required
  />
    <option value="">Chọn...</option>
    <option value="1" ${
      billboard?.properties.type_advertise === "Cổ động chính trị"
        ? "selected"
        : ""
    }>
     Cổ động chính trị
    </option>
    <option value="2" ${
      billboard?.properties.type_advertise === "Quảng cáo thương mại"
        ? "selected"
        : ""
    }>Quảng cáo thương mại</option>
	<option value="3" ${
    billboard?.properties.type_advertise === "An toàn giao thông"
      ? "selected"
      : ""
  }>An toàn giao thông</option>
    <option value="4"
	${
    billboard?.properties.type_advertise === "Mỹ phẩm" ? "selected" : ""
  }>Mỹ phẩm</option>
    <option value="5" ${
      billboard?.properties.type_advertise === "Đồ ăn" ? "selected" : ""
    }>Đồ ăn</option>
    <option value="6" ${
      billboard?.properties.type_advertise === "Điện ảnh" ? "selected" : ""
    }>Điện ảnh</option>
    <option value="7" ${
      billboard?.properties.type_advertise === "Dịch vụ" ? "selected" : ""
    }>Dịch vụ</option>
  </select>
  </div>
 
  <div class="form-section">
  <label for="form">Loại quảng cáo:</label>
  <select class="form-select mb-3"
  id="billboard__type"
  name="billboard_type_selector_edit"
  aria-label="billboard type selector"
  required>
  <option value="">Chọn...</option>
  <option value="1" ${
    billboard?.properties.type === "Trụ/Cụm pano" ? "selected" : ""
  }>Trụ/Cụm pano</option>
  <option value="2" ${
    billboard?.properties.type === "Trụ bảng hiflex" ? "selected" : ""
  }>Trụ bảng hiflex</option>
  <option value="3" ${
    billboard?.properties.type === "Trụ màn hình điện tử LED" ? "selected" : ""
  }>Trụ màn hình điện tử LED</option>
  <option value="4" ${
    billboard?.properties.type === "Trụ hộp đèn" ? "selected" : ""
  }>Trụ hộp đèn</option>
  <option value="5" ${
    billboard?.properties.type === "Bảng hiflex ốp tường" ? "selected" : ""
  }>Bảng hiflex ốp tường</option>
  <option value="6" ${
    billboard?.properties.type === "Màn hình điện tử ốp tường" ? "selected" : ""
  }>Màn hình điện tử ốp tường</option>
  <option value="7" ${
    billboard?.properties.type === "Trụ treo băng rôn dọc" ? "selected" : ""
  }>Trụ treo băng rôn dọc</option>
  <option value="8" ${
    billboard?.properties.type === "Trụ/Cụm pano" ? "selected" : ""
  }>Trụ treo băng rôn ngang</option>
  <option value="9" ${
    billboard?.properties.type === "Trụ/Cụm pano" ? "selected" : ""
  }>Cổng chào</option>
  <option value="10" ${
    billboard?.properties.type === "Trụ/Cụm pano" ? "selected" : ""
  }>Trung tâm thương mại</option>
</select>
  </div>
  <div class="flex size-information inline">
  <div class="form-section">
	<label for="width">Dài:</label>
	<input type="number" name="width" id="width"
	value="${billboard?.properties.size.split(",")[0]}"
	placeholder="XY"
	/>
  </div>
  <div class="form-section">
  <label for="height">Rộng</label>
  <input type="number" name="height" id="height"
	value="${billboard?.properties.size.split(",")[1]}"
	placeholder="XY"/>
  </div>
  </div>
  <div class="flex size-information inline">
  <div class="form-section">
	<label for="stand">trụ:</label>
	<input type="number" name="stand" id="stand" value="" placeholder="XY"/>
  </div>
  <div class="form-section">
  <label for="panel">bảng:</label>
  <input type="number" name="panel" id="panel" value="" placeholder="XY"/>
  </div>
  </div>
  <div class="form-section">
	<label for="state">Trạng thái:</label>
	<select
	class="form-select mb-3"
	id="billboard__status" name ="billboard__status"
	aria-label="Billboard status selector">
	<option selected>Chọn...</option>
	<option value="1" class="link-primary">
	  Đã quy hoạch
	</option>
	<option value="2" class="link-danger">
	  Chưa quy hoạch
	</option>
  </select>
	</div>
	<div class="form-section">
	<label for="name">Thông tin công ty:</label>
	<input type="text" name="name" id="name"
	  value="${
      billboard?.license?.company_name ? billboard?.license?.company_name : ""
    }"
	  placeholder="tên công ty"
	/>
	</div>
	<div class="form-section">
	<label for="contact">Thông tin liên lạc:</label>
	<input type="text" name="contact" id="contact"
	  value="${
      billboard?.license?.company_contact
        ? billboard?.license?.company_contact
        : ""
    }"
	  placeholder="Email công ty"
	/>
	</div>
	<div class="flex size-information inline">
  <div class="form-section">
	<label for="start">Ngày bđ:</label>
	<input type="date" name="start" id="start"
	value="${billboard?.license?.start_date}"
	placeholder="XY"
	/>
  </div>
  <div class="form-section">
  <label for="end">Ngày kt:</label>
  <input
	type="date" name="end" id="end" value="${billboard?.license?.end_date}"
	placeholder="XY"
  />
  </div>
  </div>
  <div class="form-section file-section">
	<p>Thông tin đính kèm:</p>
	<div class="file-button">
	  <label for="attached_files">Chọn</label>
	  <input
	  type="file"
	  name="attached_files"
	  id="attached_files"
	  />
	</div>
	</div>
	<div class ="px-4 d-flex justify-content-evenly w-100 btn-container">
		<div class="form-section">
			<button class="delete">Xoá</button>
		</div>
		<div class="form-section">
			<button class="submit-button submit">Chỉnh sửa</button>
		</div>
	</div>
  </form>
  </div>
  </section> `;
  edit_node = document.createElement("section");
  edit_node.setAttribute("id", "report-popup");
  edit_node.classList.add("active");

  edit_node.innerHTML += report;
  body.append(edit_node);

  var close = $("#inscreen-report-close");
  close.on("click", () => {
    body.removeChild(edit_node);
    edit_node = null;
  });

  var quill = new Quill("#editor", {
    theme: "snow",
  });
}
let request_node;
let edit_node;
