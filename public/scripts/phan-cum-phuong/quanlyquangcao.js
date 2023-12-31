const table = document.querySelector("#main__list");
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

function create_authorize_request(advertisement) {
  if (request_node) {
    body.removeChild(request_node);
  }
  console.log(advertisement._id);
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
	  accept="image/png,image/jpeg"
	  enctype="multipart/form-data"
	  action="/dashboard/license/request"
	>
	  <input type="hidden" name="id" value="${advertisement._id}">
	  <h2>Cấp phép Quảng cáo</h2>
	  <div class="form-section">
		<label for="street">Địa chỉ yêu cầu:</label>
		<textarea id="street">${advertisement.properties.place}</textarea>
	  </div>
	  <div class="form-section">
		<label for="type-billboard">Bảng quảng cáo:</label>
		<input
		  type="text"
		  name="type-billboard"
		  id="type-billboard"
		  value="${advertisement.properties.type}"
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
		name="start"
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
  const a = billboard?.licenses.filter((i) => i.state === 2);

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
	accept="image/png,image/jpeg"
	enctype="multipart/form-data"
	action="/dashboard/request"
  >
	<h2>Chỉnh sửa Bảng QC</h2>

	<input type="hidden" name="id" value="${billboard?._id}">


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
    name="type_advertise"
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
      <label for="form">Phân loại:</label>
      <select
    class="form-select mb-3"
    id="land__type__edit"
    name="place_type"
    aria-label="Land type selector"
    required
  />
  <option value="">Chọn...</option>
  <option value="1" ${
    billboard.properties.place_type ===
    "Đất công/Công viên/Hành lang an toàn giao thông"
      ? "selected"
      : ""
  }>
    Đất công/Công viên/Hành lang an toàn giao thông
  </option>
  <option value="2" ${
    billboard.properties.place_type === "Đất tư nhân/Nhà ở riêng lẻ"
      ? "selected"
      : ""
  }>Đất tư nhân/Nhà ở riêng lẻ</option>
  <option value="3" ${
    billboard.properties.place_type === "Trung tâm thương mại" ? "selected" : ""
  }>Trung tâm thương mại</option>
  <option value="4" ${
    billboard.properties.place_type === "Chợ" ? "selected" : ""
  }>Chợ</option>
  <option value="5" ${
    billboard.properties.place_type === "Cây xăng" ? "selected" : ""
  }>Cây xăng</option>
  <option value="6" ${
    billboard.properties.place_type === "Nhà chờ xe buýt" ? "selected" : ""
  }>Nhà chờ xe buýt</option>
  <option value="7" ${
    billboard?.properties.type_advertise === "Trường Học" ? "selected" : ""
  }>Trường học</option>
  </select>
    </div>
  <div class="form-section">
  <label for="form">Loại quảng cáo:</label>
  <select class="form-select mb-3"
  id="billboard__type"
  name="type"
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
    billboard?.properties.type === "Trụ treo băng rôn ngang" ? "selected" : ""
  }>Trụ treo băng rôn ngang</option>
  <option value="9" ${
    billboard?.properties.type === "Cổng chào" ? "selected" : ""
  }>Cổng chào</option>
  <option value="10" ${
    billboard?.properties.type === "Trung tâm thương mại" ? "selected" : ""
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
	id="billboard__status" name ="status"
	aria-label="Billboard status selector">
	<option selected>Chọn...</option>
	<option value="1" class="link-primary" ${
    billboard?.properties.zonning ? "selected" : ""
  }>
	  Đã quy hoạch
	</option>
	<option value="2" class="link-danger" ${
    !billboard?.properties.zonning ? "selected" : ""
  }>
	  Chưa quy hoạch
	</option>
  </select>
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

  $(document).ready(function () {
    $("#inscreen-form-login").on("submit", function () {
      var hvalue = $(".ql-editor").html();
      $(this).append(
        "<textarea name='details' style='display:none'>" +
          hvalue +
          "</textarea>"
      );
    });
  });
}
let request_node;
let edit_node;
