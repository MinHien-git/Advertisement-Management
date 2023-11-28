class Report {
  constructor(geometry, type, properties) {
    this.globalid = properties.globalid;
    this.type = type;
    this.sender_name = properties.sender_name;
    this.sender_email = properties.sender_email;
    this.sender_number = properties.sender_number;
    this.send_day = properties.send_day;
    this.details = properties.details;
    this.address = properties.place;
    this.image = properties.image;
    this.status = properties.status;
  }
}

function assignStatus(item_id) {
  const status_num = item_id % 4;
  let status = new String("	");
  switch (+status_num) {
    case 1: {
      status = `<li class="list__col3 fw-semibold" style="color: #329a44">Đã duyệt</li>`;
      break;
    }
    default: {
      status = `<li class="list__col3 fw-semibold" style="color: #e7b400">Chưa duyệt</li>`;
      break;
    }
  }
  return status;
}

function createCard(report) {
  let new_item = document.createElement("div");
  const id = report.globalid;
  new_item.className = "card shadow-sm report";
  new_item.id = "list__item" + id;
  new_item.innerHTML = `
    <div class="card-header" id="brief__info${id}">
        <ul class="list__flex">
            <li class="list__col1">${report.type}</li>
            <li class="list__col2">${report.address}</li>
            <li class="list__col3">${report.send_day}</li>
            <li class="list__col4">${report.status ? "Đã xử lý" : "Đang xử lý"}</li>  
        </ul>
    </div>
                            
      `;
  return new_item;
}

const table = document.querySelector("#main__list");
let reports = [];
$.getJSON("../data/report.json", function (data) {
  reports = data;
})
  .done(function () {
    reports.forEach((rp) => {
      let report = new Report(rp.geometry, rp.type, rp.properties);
      table.appendChild(createCard(report));
    });

    const type_billboards = document.querySelectorAll(".list__col1");
    type_billboards.forEach((e) => {
      e.style.fontSize = "0.825rem";
      e.style.fontWeight = "bold";
      if (e.innerHTML == "Tố giác sai phạm") {
        e.style.color = "#ff7b7b";
      }
      if (e.innerHTML == "Đăng ký nội dung") {
        e.style.color = "#699bf7";
      }
      if (e.innerHTML == "Đóng góp ý kiến") {
        e.style.color = "#00a41a";
      }
      if (e.innerHTML == "Giải đáp thắc mắc") {
        e.style.color = "#ffc701";
      }
    });

    const status_billboards = document.querySelectorAll(".list__col4");
    status_billboards.forEach((e) => {
      e.style.fontWeight = "bold";
      e.style.fontSize = "0.825rem";
      if (e.innerHTML == "Đã xử lý") {
        e.style.color = "#00a41a";
      }
      if (e.innerHTML == "Đang xử lý") {
        e.style.color = "#ffc701";
      }
    });

    const report_redirect = document.querySelectorAll("#main__list div.card div.card-header");
    report_redirect.forEach((e) => {
      e.addEventListener("click", () => {
        window.location.href = "/Phan-cum-phuong-quan/chitietbaocao.html";
      });
      e.style.cursor = "pointer";
    });
  })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    console.log("complete");
  });
