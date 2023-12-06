const table = document.querySelector("#main__list");
let advertisements = [];
$.getJSON("../data/billboard.json", function (data) {
  advertisements = data;
})
  .done(function () {
    console.log(advertisements);
    console.log("second success");

    start_day = new Date(2023, 10, 23);
    end_day = new Date(2025, 10, 23);

    advertisements.forEach((ad) => {
      let billboard = new Billboard(ad.geometry, ad.properties, false, {
        name: "ABC Company",
        contact: "ABCCompany@email.com",
        start_day:
          start_day.getUTCDate() +
          "/" +
          start_day.getUTCMonth() +
          "/" +
          start_day.getUTCFullYear(),
        end_day:
          end_day.getUTCDate() +
          "/" +
          end_day.getUTCMonth() +
          "/" +
          end_day.getUTCFullYear(),
      });
      table.appendChild(createCard(billboard));
    });
  })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    console.log("complete");
  });

function cancel_license(id) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/dashboard/license/cancel", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ id: id }));
}

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

let request_node;
