let report_node;
let report_index;

function get_report(feature) {
  if (report_node) {
    body.removeChild(report_node);
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
      <input type="hidden" name = "billboard" value=${feature._id}>
      <h2>Yêu cầu Chỉnh sửa</h2>
      <div class="form-section">
        <p id="street">${feature.properties.place}</p>
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
  report_node = document.createElement("section");
  report_node.setAttribute("id", "report-popup");
  report_node.classList.add("active");
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
  report_node.innerHTML += report;
  body.append(report_node);

  var close = $("#inscreen-report-close");
  close.on("click", () => {
    body.removeChild(report_node);
    report_node = null;
  });
  let type = "";
  let adtype = "";
  let board = "";
  for (let i = 0; i < placeTypes.length; ++i) {
    let selected = feature.properties.place_type === placeTypes[i].type;
    type += `<option value="${placeTypes[i].type}" ${
      selected ? "selected" : ""
    }>${placeTypes[i].type}</option>`;
  }
  for (let i = 0; i < type_advertise.length; ++i) {
    let selected = feature.properties.type_advertise === type_advertise[i].type;
    adtype += `<option value="${type_advertise[i].type}" ${
      selected ? "selected" : ""
    }>${placeTypes[i].type}</option>`;
  }
  for (let i = 0; i < feature.properties.boards.length; ++i) {
    board += `<option value="${i}|${feature.properties.boards[i].board_type}"
    >(${i}) ${feature.properties.boards[i].board_type}</option>`;
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
          feature.properties.status === 1 ? "selected" : ""
        }>Đã Quy hoạch</option>
        <option value="0" ${
          feature.properties.status === 0 ? "selected" : ""
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
          feature.properties.boards[Number(e.target.value.split("|")[0])].size
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
