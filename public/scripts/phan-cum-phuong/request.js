let request_node;

function get_resquest(position) {
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
        name="company-infomation"
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
        id="start-date"
        value=""
        placeholder="Email công ty"
      />
    </div>
    <div class="form-section">
      <label for="end-date">Ngày kết thúc:</label>
      <input
        type="date"
        name="end-date"
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
