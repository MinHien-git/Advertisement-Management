function cancel_request(id) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      location.reload();
    }
  };
  xhr.open("POST", "/dashboard/request/cancel", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ id: id }));
}

const table = document.querySelector("#main__list");
let advertisements = [];


function create_edit_request(billboard) {
  if (edit_node) {
    body.removeChild(edit_node);
  }
  if (billboard) {
    billboard = JSON.parse(billboard);
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
  enctype="multipart/form-data"
  accept="image/png,image/jpeg"
	method="post"
	action="/dashboard/request"
  >
	<h2>Chỉnh sửa Bảng QC</h2>
	<div class="form-section">
	<input type="hidden" name="id" value="${billboard?._id}">
	<label for="billboard__type__edit" class="fw-bold">Loại bảng quảng cáo</label>
  <select
    class="form-select mb-3"
    id="billboard__type__edit"
    name="billboard_type_selector_edit"
    aria-label="Billboard type selector"
    required
  />
    <option value="">Chọn...</option>
    <option value="1">Trụ/Cụm pano</option>
    <option value="2">Trụ bảng hiflex</option>
    <option value="3">Trụ màn hình điện tử LED</option>
    <option value="4">Trụ hộp đèn</option>
    <option value="5">Bảng hiflex ốp tường</option>
    <option value="6">Màn hình điện tử ốp tường</option>
    <option value="7">Trụ treo băng rôn dọc</option>
    <option value="8">Trụ treo băng rôn ngang</option>
    <option value="9">Cổng chào</option>
    <option value="10">Trung tâm thương mại</option>
  </select>
	
	</div>
	<div class="form-section">
	<label for="street">Địa điểm:</label>
	<input type="text" id="street" name="place" value="${
    billboard?.properties.place ? billboard?.properties.place : ""
  }">
	</div>
	<div class="form-section">
  <label for="land__type__edit" class="fw-bold">Hình thức</label>
	<select
    class="form-select mb-3"
    id="add__type__edit"
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
  <option value="2"
<option value="1" ${
    billboard?.properties.type_advertise === "An toàn giao thông"
      ? "selected"
      : ""
  }>An toàn giao thông</option>
  <option value="3"
${
  billboard?.properties.type_advertise === "Mỹ phẩm" ? "selected" : ""
}>Mỹ phẩm</option>
  <option value="4" ${
    billboard?.properties.type_advertise === "Đồ ăn" ? "selected" : ""
  }>Đồ ăn</option>
  <option value="5" ${
    billboard?.properties.type_advertise === "Điện ảnh" ? "selected" : ""
  }>Điện ảnh</option>
  <option value="6" ${
    billboard?.properties.type_advertise === "Dịch vụ" ? "selected" : ""
  }>Dịch vụ</option>
  </select>
  </div>
  <div class="form-section">
	<label for="land__type__edit" class="fw-bold">Phân loại</label>
  <select
    class="form-select mb-3"
    id="land__type__edit"
    name="land_type_selector_edit"
    aria-label="Land type selector"
    required
  />
    <option value="">Chọn...</option>
    <option value="1">
      Đất công/Công viên/Hành lang an toàn giao thông
    </option>
    <option value="2">Đất tư nhân/Nhà ở riêng lẻ</option>
    <option value="3">Trung tâm thương mại</option>
    <option value="4">Chợ</option>
    <option value="5">Cây xăng</option>
    <option value="6">Nhà chờ xe buýt</option>
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

let edit_node;
