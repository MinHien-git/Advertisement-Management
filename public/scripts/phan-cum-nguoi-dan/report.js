let report_node;
var hvalue = "";
function get_report(current_feature) {
  if (report_node) {
    body.removeChild(report_node);
  }
  let option = "";

  for (let i = 0; i < current_feature?.properties?.boards.length; ++i) {
    option += `<option value="${i}">${current_feature?.properties?.boards[i].board_type}</option> `;
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
          > <input type ="hidden" name = "lat" value= ${lat_lnt.lat} >
          <input type ="hidden" name = "lnt" value= ${lat_lnt.lng} >

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
    name="report__type"
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
              id="report__board"
              name="board"
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
                  accept="image/png,image/jpeg"
                  multiple
                >
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

  function runCapcha() {
    grecaptcha.ready(function () {
      grecaptcha
        .execute("6LdBr0kpAAAAAEfm-auy663qwRYlcSVaA8NlxLUO", {
          action: "report",
        })
        .then(function (token) {
          let type = Number($("#report__type").val());
          let board = $("#report__board").val();
          let name = $("#sender_name").val();
          let email = $("#sender_email").val();
          let geometry = $("#geometry").val();
          let place = $("#place").val();

          let number = $("#sender_number").val();
          console.log(geometry);
          sendData(
            files,
            place,
            number,
            email,
            name,
            geometry,
            board,
            type,
            token
          );
        });
    });
  }

  function sendData(
    files,
    place,
    number,
    email,
    name,
    geometry,
    board,
    type,
    token
  ) {
    let data = JSON.stringify({
      attached_files: files,
      place: place,
      details: hvalue,
      sender_number: number,
      sender_email: email,
      sender_name: name,
      geometry: geometry,
      type: type,
      board: board,
      captcha: token,
    });
    fetch("http://localhost:5000/report", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Gửi báo cáo thành công ");
        } else {
          alert("Gửi báo cáo thất bại! " + data.message);
        }
      });
  }
  $(document).ready(function () {
    $("#inscreen-form-report").on("submit", function (e) {
      e.preventDefault();
      hvalue = $(".ql-editor").html();
      $(this).append(
        "<textarea name='details' style='display:none'>" +
          hvalue +
          "</textarea>"
      );
      runCapcha();
    });
  });

  $("#attached_files").on("change", (e) => {
    uploadImage(e);
  });
}
