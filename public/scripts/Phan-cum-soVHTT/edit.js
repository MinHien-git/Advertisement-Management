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
      action="/login"
    >
      <h2>Chỉnh sửa Bảng QC</h2>
      <div class="form-section">
        <label for="type">Loại quảng cáo:</label>
        <input
          type="text"
          name="type"
          id="type"
          value=""
          placeholder="Chọn..."
        />
      </div>
      <div class="form-section">
        <label for="street">Địa điểm:</label>
        <textarea id="street">${position}</textarea>
      </div>
      <div class="form-section">
      <label for="form">Hình thức:</label>
      <input
        type="text"
        name="form"
        id="form"
        value=""
        placeholder="Chọn..."
      />
    </div>
    <div class="form-section">
      <label for="form">Phân loại:</label>
      <input
        type="text"
        name="catetorize"
        id="catetorize"
        value=""
        placeholder="Chọn..."
      />
    </div>
    <div class="flex size-information inline">
    <div class="form-section">
      <label for="width">Dài:</label>
      <input
        type="number"
        name="width"
        id="width"
        value=""
        placeholder="XY"
      />
    </div>
    <div class="form-section">
    <label for="height">Rộng</label>
    <input
      type="number"
      name="height"
      id="height"
      value=""
      placeholder="XY"
    />
  </div>
    </div>
    <div class="flex size-information inline">
    <div class="form-section">
      <label for="stand">trụ:</label>
      <input
        type="number"
        name="stand"
        id="stand"
        value=""
        placeholder="XY"
      />
    </div>
    <div class="form-section">
    <label for="panel">bảng:</label>
    <input
      type="number"
      name="panel"
      id="panel"
      value=""
      placeholder="XY"
    />
  </div>
    </div>
    <div class="form-section">
        <label for="state">Trạng thái:</label>
        <input
          type="text"
          name="state"
          id="state"
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
          placeholder="tên công ty"
        />
      </div>
      <div class="form-section">
        <label for="contact">Thông tin liên lạc:</label>
        <input
          type="text"
          name="contact"
          id="contact"
          value=""
          placeholder="Email công ty"
        />
      </div>
      <div class="flex size-information inline">
    <div class="form-section">
      <label for="start">Ngày bđ:</label>
      <input
        type="date"
        name="start"
        id="start"
        value=""
        placeholder="XY"
      />
    </div>
    <div class="form-section">
    <label for="end">Ngày kt:</label>
    <input
      type="date"
      name="end"
      id="end"
      value=""
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
