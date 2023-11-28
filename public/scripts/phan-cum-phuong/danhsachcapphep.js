class Billboard {
  constructor(geometry, properties, license, company_info) {
    this.globalid = properties.globalid;
    this.type_billboard = properties.type;
    this.address = properties.place;
    this.geometry = geometry;
    this.properties = properties;
    this.company_info = company_info;
    this.license = license;
  }
}

function assignStatus(item_id) {
  const status_num = item_id % 4;
  let status = new String("	");
  switch (+status_num) {
    case 1: {
      status = `<li class="list__col3 fw-semibold" style="color: #329a44">Đã cấp phép</li>`;
      break;
    }
    case 2: {
      status = `<li class="list__col3 fw-semibold" style="color: #e7b400">Chờ cấp phép</li>`;
      break;
    }
    default: {
      status = `<li class="list__col3 fw-semibold" style="color: #db3232">Chưa cấp phép</li>`;
      break;
    }
  }
  return status;
}

function assignButton(item_id, advertisement) {
  const status_num = item_id % 4;
  let button_container = new String("	");
  switch (+status_num) {
    case 1: {
      button_container = ``;
      break;
    }
    case 2: {
      button_container = `
      <ul class="buttons__container">
        <li>
          <button
            class="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#delete__confirm__modal">
            <i class="bi bi-trash"></i> Huỷ yêu cầu
          </button>
        </li>
      </ul>`;
      break;
    }
    default: {
      button_container = `
      <ul class="buttons__container">
        <li>
          <button
            class="btn btn-success"
            onclick="create_authorize_request('${advertisement.address}')">
            <i class="bi bi-check-circle"></i> Tạo yêu cầu
          </button>
        </li>
      </ul>`;
      break;
    }
  }
  return button_container;
}

function createCard(advertisement) {
  let new_item = document.createElement("div");
  const id = advertisement.globalid;
  new_item.className = "card shadow-sm";
  new_item.id = "list__item" + id;
  new_item.innerHTML = `
							<div class="card-header" id="brief__info${id}">
								<ul class="list__flex">
									<li class="list__col1">${advertisement.type_billboard}</li>
									<li class="list__col2">${advertisement.address}</li>
									${assignStatus(id)}
									<li class="list__col4">
										<button
											class="btn collapsed"
											id="collapse__btn${id}"
											type="button"
											onclick="toggleCollapseButton('collapse__btn${id}')"
											data-bs-toggle="collapse"
											data-bs-target="#full__info${id}"
											aria-expanded="false"
											aria-controls="full__info${id}">
											<i class="bi bi-chevron-down"></i>
										</button>
									</li>
								</ul>
							</div>
							<div
								id="full__info${id}"
								class="collapse"
								aria-labelledby="brief__info${id}">
								<div class="card-body">
									<ul id="full__info__list">
										<li class="mock__image__container">
											<div class="mock__image">&nbsp;</div>
											<div class="mock__image">&nbsp;</div>
										</li>
										<li>
											<p class="fw-bold">Thông tin bảng quảng cáo</p>
											<ul>
												<li>
													Kích thước: <span class="fw-bold">${advertisement.properties.size}</span>
												</li>
												<li>
													Số lượng:
													<span class="fw-bold">${advertisement.properties.amount}</span>
												</li>
												<li>
													Hình thức:
													<span class="fw-bold">${advertisement.properties.type_advertise}</span>
												</li>
												<li>
													Phân loại: <span class="fw-bold">${advertisement.properties.place_type}</span>
												</li>
											</ul>
										</li>
										<li>
											<p class="fw-bold">Thông tin công ty</p>
											<ul>
												<li>
													Tên công ty:
													<span class="fw-bold">${advertisement.company_info.name}</span>
												</li>
												<li>
													Email liên hệ:
													<span class="fw-bold">${advertisement.company_info.contact}</span>
												</li>
												<li>
													Ngày bắt đầu:
													<span class="fw-bold">${advertisement.company_info.start_date}</span>
												</li>
												<li>
													Ngày kết thúc:
													<span class="fw-bold">${advertisement.company_info.end_date}</span>
												</li>
											</ul>
										</li>
										<li>
											${assignButton(id, advertisement)}
										</li>
									</ul>
								</div>
							</div>
	`;
  return new_item;
}

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

function create_authorize_request(position = "") {
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
      action="/login"
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

let request_node;
