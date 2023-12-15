let report_node;

function get_report(position) {
  if (report_node) {
    body.removeChild(report_node);
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
      action="/dashboard/request/edit"
    >
      <h2>Yêu cầu Chỉnh sửa</h2>
      <div class="form-section">
        <label for="street">Địa chỉ yêu cầu:</label>
        <textarea id="street">${position}</textarea>
      </div>
      <h5>Thông tin mới:</h5>
      <div class="form-section">
        <label for="name">Điểm đặt quảng cáo:</label>
        <input
          type="text"
          name="name"
          id="name"
          value=""
          placeholder="dd/mm/yyyy"
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
        <label for="name">Thời điểm chỉnh sửa:</label>
        <input
          type="text"
          name="name"
          id="name"
          value=""
          placeholder="Họ và tên người báo cáo"
        />
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
}
