let report_node;

function get_report(position) {
  if (report_node) {
    body.removeChild(report_node);
  }
  let report = `
          <div id="report-section-form-container" class ="popup">
          <div id="authentication-close-button" class="authentication-close-button">
            <img
              id="inscreen-report-close"
              src="/images/close.png"
              alt="close button"
            />
          </div>
          <form
            id="inscreen-form-report"
            class="form-container active"
            method="post"
            action="/report"
          >
            <h2>Báo Cáo</h2>
            <div class="form-section">
              <label for="place">Địa chỉ báo cáo:</label>
              <textarea id="place" readonly name="place">${position}</textarea>
            </div>
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
