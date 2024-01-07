let report_node;

function get_report(current_feature) {
  if (report_node) {
    body.removeChild(report_node);
  }
  let option = "";

  for (let i = 0; i < current_feature?.properties?.boards.length; ++i) {
    option += `<option value="${current_feature?.properties?.boards[i].board_type}">${current_feature?.properties?.boards[i].board_type}</option> `;
  }
  console.log(option);
  let report = `
          <div id="report-section-form-container" class ="popup">
          <div id="report-close-button" class="authentication-close-button">
            <img
              id="inscreen-report-close"
              src="/images/close.png"
              alt="close button"
            />
          </div>
          <h2 class="form-title">Báo Cáo</h2>
          <form
            id="inscreen-form-report"
            class="form-container active"
            method="post"
            action="/report"
          >
           

            <input id="place" readonly name="place" type="hidden" value="${
              current_feature.properties.place
                ? current_feature.properties.place
                : current_feature.properties.address_line2
            }"/>
            <p class="place">${
              current_feature.properties.place
                ? current_feature.properties.place
                : current_feature.properties.address_line2
            }</p>

            <div class="form-section">
              <label for="sender_name">Họ Tên:</label>
              <input
                type="text"
                name="sender_name"
                id="sender_name"
                value=""
                placeholder="Họ và tên người báo cáo"
              />
            </div>
            <div class="form-section">
              <label for="sender_email">Email:</label>
              <input
                type="email"
                name="sender_email"
                id="sender_email"
                value=""
                placeholder="Email"
              />
            </div>
            <div class="form-section">
              <label for="sender_number">Điện thoại:</label>
              <input
                type="tel"
                name="sender_number"
                id="sender_number"
                value=""
                placeholder="Điện thoại liên lạc"
              />
            </div>
            <div class="form-section">
            <label for="billboard__type__edit" class="fw-bold">Loại báo cáo</label>
  <select
    class="form-select"
    id="report__type"
    name="type"
    aria-label="report type selector"
    required
  />
    <option value="">Chọn...</option>
    <option value="0">Tố cáo sai phạm</option>
    <option value="1">Đăng ký nội dung</option>
    <option value="2">Đóng góp ý kiến</option>
    <option value="3">Giải đáp thắc mắc</option>
    </select></div>

    ${
      current_feature?.properties?.boards.length > 0
        ? `<div class="form-section">
            <label for="billboard__type__edit" class="fw-bold">Loại bảng quảng cáo</label>
            <select
              class="form-select"
              id="report__type"
              name="type"
              aria-label="report type selector"
              required
            />
              <option value="">Chọn...</option>
              ${option}
              </select></div>`
        : ""
    }
            <div class="form-section file-section">
              <p class="mb-0">Thông tin đính kèm:</p>
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
              <label for="quill">Thông tin báo cáo:</label>
              <div id="editor" id="quill" name="quill"></div>
            </div>
            <div class="form-section">
              <button class="submit-button submit">Gửi</button>
            </div>
          </form>
        </div>`;
  report_node = document.createElement("section");
  report_node.setAttribute("id", "report-popup");
  report_node.classList.add("active");

  report_node.innerHTML += report;
  body.append(report_node);

  var close = $("#inscreen-report-close");
  close.on("click", () => {
    body.removeChild(report_node);
    report_node = null;
  });

  var quill = new Quill("#editor", {
    theme: "snow",
  });

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
}
