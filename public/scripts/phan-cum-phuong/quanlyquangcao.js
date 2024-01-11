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
  let board = "";
  for (let i = 0; i < advertisement.properties.boards.length; ++i) {
    board += `<option value="${advertisement.properties.boards[i].board_type}"
    >(${i}) ${advertisement.properties.boards[i].board_type}</option>`;
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
	  <input type="hidden" id ="bbid" name="id" value="${advertisement._id}">
    <input type="hidden" id ="board_id" name="board_id" value="${advertisement.board._id}">
	  <h2>Cấp phép Quảng cáo</h2>
	  <div class="form-section">
		<label for="street">Địa chỉ yêu cầu:</label>
      <input id="street" type="hidden" value = ${advertisement.properties.place}/>
      <p>${advertisement.properties.place}</p>
	  </div>
	  <div class="form-section">
		<label for="boardId">Bảng quảng cáo:</label>

    <select class="form-select"
      name="board_Id" id="boardId"
          aria-label="ad type selector"
          required
        />
          <option value="">Chọn...</option>
		${board}
    </select>
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
		placeholder="DD/MM/YYYY"
	  />
	</div>
	<div class="form-section">
	  <label for="end-date">Ngày kết thúc:</label>
	  <input
		type="date"
		name="end"
		id="end-date"
		value=""
		placeholder="DD/MM/YYYY"
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
      accept="image/png,image/jpeg"
      multiple
		  />
		</div>
	  </div>
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

  $("#inscreen-form-login").on("submit", (e) => {
    console.log(files);
    let data = JSON.stringify({
      id: $("#bbid").val(),
      attached_files: files,
      name: $("#name").val(),
      board_id: $("#board_id").val(),
      contact: $("#company-infomation").val(),
      start: $("#start").val(),
      end: $("#end-date").val(),
    });
    fetch("http://localhost:5000/dashboard/license/request", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: data,
    });
  });
  var close = $("#inscreen-request-close");
  close.on("click", () => {
    body.removeChild(request_node);
    request_node = null;
  });

  $("#attached_files").on("change", (e) => {
    uploadImage(e);
  });
}

function create_edit_request(billboard = null) {
  if (edit_node) {
    body.removeChild(edit_node);
  }
  let report = `
    <section class="active popup" id="report-popup">
    <div id="report-request-section-form-container">
    <div id="inscreen-report-close" class="inscreen-report-close">
      <img
        id="inscreen-authen-close"
        src="/images/close.png"
        alt="close button"
      />
    </div>
    <form
      id="inscreen-form-report"
      class="form-container active"
      method="post"
      action="/dashboard/request/edit"
    >
      <input type="hidden" name = "billboard" value=${billboard._id}>
      <h2>Yêu cầu Chỉnh sửa</h2>
      <div class="form-section">
        <p id="street">${billboard.properties.place}</p>
      </div>
      <h5>Thông tin mới:</h5>
      <div class="form-section">
        <label for="select_option">Thông tin cần sửa:</label>
        <select class="form-select"
          id="select_option"
          name="select_option"
          aria-label="ad type selector"
          required
        />
          <option value="">Chọn...</option>
          <option value="0">Trụ quảng cáo</option>
          <option value="1">Biển quảng cáo</option>
        </select>
      </div>
      <div class="container">
      </div>
      
      
    </form>
  </div>
  </section> `;
  edit_node = document.createElement("section");
  edit_node.setAttribute("id", "report-popup");
  edit_node.classList.add("active");
  $(document).ready(function () {
    $("#inscreen-form-report").on("submit", function () {
      var hvalue = $(".ql-editor").html();
      $(this).append(
        "<textarea name='details' style='display:none'>" +
          hvalue +
          "</textarea>"
      );
    });
  });
  edit_node.innerHTML += report;
  body.append(edit_node);

  var close = $("#inscreen-report-close");
  close.on("click", () => {
    body.removeChild(edit_node);
    edit_node = null;
  });
  let type = "";
  let adtype = "";
  let board = "";
  for (let i = 0; i < placeTypes.length; ++i) {
    let selected = billboard.properties.place_type === placeTypes[i].type;
    type += `<option value="${placeTypes[i].type}" ${
      selected ? "selected" : ""
    }>${placeTypes[i].type}</option>`;
  }
  for (let i = 0; i < type_advertise.length; ++i) {
    let selected =
      billboard.properties.type_advertise === type_advertise[i].type;
    adtype += `<option value="${type_advertise[i].type}" ${
      selected ? "selected" : ""
    }>${placeTypes[i].type}</option>`;
  }
  for (let i = 0; i < billboard.properties.boards.length; ++i) {
    board += `<option value="${i}|${billboard.properties.boards[i].board_type}"
    >(${i}) ${billboard.properties.boards[i].board_type}</option>`;
  }
  $("#select_option").on("change", function (e) {
    report_index = e.target.value;
    console.log(report_index);
    if (report_index == 0) {
      $("#report-request-section-form-container .container")
        .html(`<div class="form-section">
      <label for="place_type">Phân loại:</label>
      <select class="form-select"
        id="place_type"
        name="place_type"
        aria-label="ad type selector"
        required
      />
        <option value="">Chọn...</option>
        ${type}
      </select>
    </div>
    <div class="form-section">
      <label for="advertise_type">Loại quảng cáo:</label>
      <select class="form-select"
        id="advertise_type"
        name="advertise_type"
        aria-label="ad type selector"
        required
      />
        <option value="">Chọn...</option>
        ${adtype}
      </select>
    </div>
    <div class="form-section">
      <label for="status">Quy hoạch:</label>
      <select class="form-select"
        id="status"
        name="status"
        aria-label="ad type selector"
        required
      />
        <option value="1" ${
          billboard.properties.status === 1 ? "selected" : ""
        }>Đã Quy hoạch</option>
        <option value="0" ${
          billboard.properties.status === 0 ? "selected" : ""
        }>Chưa Quy hoạch</option>
      </select>
    </div>
    <div class="form-section">
      <label for="tel">Thông tin chỉnh sửa:</label>
      <div id="editor"></div>
    </div>
    <div class="form-section">
      <button class="submit-button submit">Gửi</button>
    </div>`);

      var quill = new Quill("#editor", {
        theme: "snow",
      });
    } else if (report_index == 1) {
      $("#report-request-section-form-container .container")
        .html(`<div class="form-section">
    <label for="board_type">Loại bảng:</label>
    <select class="form-select"
      id="board_type"
      name="board_type"
      aria-label="ad type selector"
      required
    />
      <option value="">Chọn...</option>
      ${board}
    </select>
  </div>
  <div class="form-section">
    <label for="size">kích thước:</label>
    <input type="text" id="size" name="size" value="" placeholder ="XxY">
  </div>
  <div class="form-section">
    <label for="tel">Thông tin chỉnh sửa:</label>
    <div id="editor"></div>
  </div>
  <div class="form-section">
    <button class="submit-button submit">Gửi</button>
  </div>`);

      $("#board_type").on("change", function (e) {
        $("#size").val(
          billboard.properties.boards[Number(e.target.value.split("|")[0])].size
        );
      });
      var quill = new Quill("#editor", {
        theme: "snow",
      });
    } else if (report_index == "") {
      $("#report-request-section-form-container .container").html("");
    }
  });
}

let request_node;
let edit_node;
