let map = null;
let defaultCoord = [10.7743, 106.6669]; // coord mặc định, 9 giữa HCMC
let zoomLevel = 13;
const api_key = "3dbf2ce56c45401b855931d7f3828a85";
let popup = L.popup();
let currentBoard;
let infoboards = document.getElementById("info");
let current_feature = null;
let current_index = 0;
let current_marker = null;
let requestOptions = {
  method: "GET",
};
let showBillBoard = true;
let showBillReport = true;

var geojsonMarkerOptions = {
  radius: 8,
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};
var geojsonReportMarkerOptions = {
  radius: 7,
  weight: 1,
  opacity: 0.5,
  fillOpacity: 0.8,
};

function setInfoBoard() {
  if (current_feature) {
    currentBoard = current_feature.properties.boards;
    current_index = 0;
    const setInfo = (index) => {
      if (currentBoard.length === 0) {
        infoboards.innerHTML = `<div class="info_container">
        <div class="info-close"><img src = "/images/close.png"></div>
        <div class="info-container-info">
            <p>${current_feature.properties.place}</p>
            <p>Chưa có bảng quảng cáo</p>
        </div>
        `;
      } else {
        const board = currentBoard[current_index];
        const license = currentBoard[current_index]?.license?.[0];
        infoboards.innerHTML = `<div class="info_container">
        <div class="info-close"><img src = "/images/close.png"></div>
        <h5 class="billboard-type">${board?.board_type}</h5>
        <button class="navigate-btn navigate-left">&#8592;</button>

        <button class="navigate-btn navigate-right">&#8594;</button>
        <div class="image-container">
          ${
            license?.images?.[0]
              ? `<img class="ad__image" src="${license.images[0]}" alt="hinh1">`
              : `<div class="image"></div>`
          }
          ${
            license?.images?.[1]
              ? `<img class="ad__image" src="${license.images[1]}" alt="hinh2">`
              : `<div class="image"></div>`
          }
        </div>
        <div class="info-container-info">
            <p>${current_feature.properties.place}</p>

            
            <p class="size"><span class="bold">Kích thước: </span> ${
              board?.size
            }</p>
            ${
              license
                ? `<p class="bold">Thông tin công ty (đã cấp phép)</p>
            <p class="size"><span class="bold">Tên công ty: </span> ${license.company_name}</p>
            <p class="size"><span class="bold">Email liên hệ: </span> ${license.company_contact}</p>
            <p class="size"><span class="bold">Ngày bắt đầu: </span> ${license.start_date}</p>
            <p class="size"><span class="bold">Ngày kết thúc: </span> ${license.end_date}</p>`
                : ""
            }  
        </div>
        `;
        $(".info-close").on("click", () => {
          infoboards.classList.remove("active");
        });
        $(".navigate-left").on("click", () => {
          current_index--;

          if (current_index < 0) {
            current_index = currentBoard.length - 1;
          }
          setInfo(current_index);
        });
        $(".navigate-right").on("click", () => {
          current_index++;

          if (current_index >= currentBoard.length) {
            current_index = 0;
          }
          setInfo(current_index);
        });
        let request_btn = $("#info .request");
        if (request_btn) {
          request_btn.on("click", () => {
            get_resquest(current_feature.properties.place);
          });
        }
      }
    };

    setInfo(current_index);
  }
}

function setReportBoard() {
  if (current_feature) {
    currentBoard = current_feature.properties;
    current_index = 0;
    infoboards.innerHTML = "";
    let body = "";
    for (let i = 0; i < currentBoard.details.length; ++i) {
      const images = currentBoard.details[i].images;
      let image_body = "";
      if (images) {
        for (let i = 0; i < images.length; i++) {
          image_body += `<img class="ad__image" src="${images[i]}" alt="hinh${i}">`;
        }
      }
      body += `<div class="report-card">
      ${
        currentBoard.details[i].images
          ? `<div class="image-container">${image_body}</div>`
          : ""
      }
      Email: ${
        currentBoard.details[i].sender_email
          ? `<p>${currentBoard.details[i].sender_email}</p>`
          : ""
      }
      Tên người gửi: ${
        currentBoard.details[i].sender_name
          ? `<p>${currentBoard.details[i].sender_name}</p>`
          : ""
      }
      SĐT: ${
        currentBoard.details[i].sender_number
          ? `<p>${currentBoard.details[i].sender_number}</p>`
          : ""
      }
      Ngày gửi: ${
        currentBoard.details[i].send_day
          ? `<p>${currentBoard.details[i].send_day}</p>`
          : ""
      }
      Nội dung báo cáo: ${currentBoard.details[i].details}
      </div>`;
    }

    infoboards.innerHTML = `<div class="info_container">
        <div class="info-close"><img src = "/images/close.png"></div>
        ${body}
        </div>
        `;

    $(".info-close").on("click", () => {
      infoboards.classList.remove("active");
    });
    $(".navigate-left").on("click", () => {
      current_index--;

      if (current_index < 0) {
        current_index = currentBoard.length - 1;
      }
      $(".billboard-type").text(currentBoard[current_index]?.board_type);
      $(".size").html(
        `<p class="size"><span class="bold">Kích thước: </span>` +
          currentBoard[current_index]?.size
      );
    });
    $(".navigate-right").on("click", () => {
      current_index++;

      if (current_index >= currentBoard.length) {
        current_index = 0;
      }
      $(".billboard-type").text(currentBoard[current_index]?.board_type);
      $(".size").html(
        `<p class="size"><span class="bold">Kích thước: </span>` +
          currentBoard[current_index]?.size
          ? currentBoard[current_index].size
          : ""
      );
    });
    let request_btn = $("#info .request");
    if (request_btn) {
      request_btn.on("click", () => {
        get_resquest(current_feature.properties.place);
      });
    }
  }
}

function onMapClick(e) {
  let data;
  fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&lang=vi&apiKey=3dbf2ce56c45401b855931d7f3828a85`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      data = result;
      console.log(result);
      popup
        .setLatLng(e.latlng)
        .setContent(
          `<h3>${data.features[0].properties.address_line1}</h3>
          <p>${
            data.features[0].properties.address_line2.split(", Thành")[0]
          }</p>
          <div class="infomation">
          <h4>Thông tin</h4>
          <p>Chưa có thông tin</p>
          </div>
          ${
            is_offical == 0
              ? '<button class="report"><img src="/images/report-fill.png" alt="report">Báo cáo</button>'
              : is_offical == 1
              ? '<button class="edit"><img src="/images/edit-yellow.png" alt="report">Chỉnh sửa</button>'
              : '<button class="edit"><img src="/images/edit-yellow.png" alt="report">Thêm Bảng</button>'
          }`
        )
        .openOn(map);

      let btn = is_offical == 0 ? $(".report") : $(".edit");
      btn.on("click", () => {
        if (is_offical === 2) {
          lat_lnt = e.latlng;
          console.log(lat_lnt);
        }
        current_feature = data.features[0];
        get_report(data.features[0]);
      });
    })
    .catch((error) => console.log("error", error));
}

window.onload = function () {
  // init map
  map = L.map("map", {
    attributionControl: false,
  }).setView(defaultCoord, 15);

  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
      '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const address_search_controller = L.control.addressSearch(api_key, {
    position: "topleft",
    resultCallback: (address) => {
      if (current_marker) {
        map.removeLayer(current_marker);
      }
      current_marker = L.marker([address.lat, address.lon]).addTo(map);
      map.setView([address.lat, address.lon]);
    },
  });

  map.zoomControl.setPosition("topright");
  var lc = L.control
    .locate({
      position: "topright",
      strings: {
        title: "Show me where I am, yo!",
      },
      enableHighAccuracy: true,
      keepCurrentZoomLevel: true,
    })
    .addTo(map);

  map.addControl(address_search_controller);
  map.on("click", onMapClick);

  let geojsonLayer = L.geoJSON(billboards, {
    pointToLayer: function (feature, latlng) {
      const attributionDiv = document.createElement("div");
      const button_container = document.createElement("div");
      const report_button = document.createElement("button");
      const info_button = document.createElement("button");

      attributionDiv.setAttribute("id", "content" + feature._id);
      button_container.classList.add("button_container");
      info_button.classList.add("info");
      info_button.setAttribute("id", "info-" + feature._id);
      report_button.classList.add(is_offical != 0 ? "edit" : "report");
      report_button.setAttribute("id", "report-" + feature._id);

      attributionDiv.innerHTML = `
          <p>${feature.properties.place}</p>
          <p>Số lượng bảng QC: <span class="bold">${
            feature.properties.boards.length
          }</span></p>
          <p>Hình thức: <span class="bold">${
            feature.properties.type_advertise
          }</span></p>
          <p>Phân Loại: <span class="bold">${
            feature.properties.place_type
          }</span></p>
          <p>Quy Hoạch: <span class="bold">${
            feature.properties.status === 1 ? "Đã Quy Hoạch" : "Chưa Quy Hoạch"
          }</span></p>
          `;
      info_button.innerHTML = `<img src="/images/information.png" alt="information">Thông tin`;
      report_button.innerHTML =
        is_offical != 0
          ? `<img src="/images/edit-yellow.png" alt="edit">Chỉnh sửa`
          : `<img src="/images/report-fill.png" alt="report">Báo cáo`;

      button_container.appendChild(info_button);
      button_container.appendChild(report_button);

      report_button.addEventListener("click", (e) => {
        current_feature = feature;
        if (is_offical != 2) {
          get_report(feature);
        } else {
          get_edit(feature.properties.place, feature);
        }
      });

      info_button.addEventListener("click", (e) => {
        console.log("check-info :" + feature._id, feature);
        current_feature = feature;
        setInfoBoard();
        if (!infoboards.classList.contains("active"))
          infoboards.classList.add("active");
      });
      attributionDiv.appendChild(button_container);

      return L.circleMarker(latlng, geojsonMarkerOptions).bindPopup(
        attributionDiv
      );
    },
    style: function (feature) {
      if (feature.properties.status === 0) {
        return {
          color: "#ff0000",
          fillColor: "#ff0000",
        };
      } else {
        return {
          color: "#0000ff",
          fillColor: "#0000ff",
        };
      }
    },
  });

  navigator.geolocation.getCurrentPosition((position) => {
    const {
      coords: { latitude, longitude },
    } = position;
    var marker = new L.marker([latitude, longitude], {
      draggable: true,
      autoPan: true,
    }).addTo(map);
    map.setView([latitude, longitude], 15);
    console.log(marker);
  });
  var markers = L.markerClusterGroup();
  markers.addLayer(geojsonLayer);
  map.addLayer(markers);

  let reportLayer = L.geoJSON(reports, {
    pointToLayer: function (feature, latlng) {
      const attributionDiv = document.createElement("div");
      attributionDiv.setAttribute("id", "content" + feature._id);
      attributionDiv.innerHTML = `<p>${feature.properties.place}</p>
      ${
        feature.properties.details.constructor !== Array
          ? `<p><span class="bold">Trạng thái:</span>
        ${feature.properties?.state === 0 ? "Đã xử lí" : "Chưa xử lí"} </p>
        <p><span class="bold">Nội dung báo cáo:</span></p> 
        ${feature.properties.details}`
          : `<p><span class="bold">Số báo cáo:</span>
      ${feature.properties?.details.length} </p><button class=">Chi tiết</button>`
      }`;
      if (feature.properties.details.constructor === Array) {
        const info_button = document.createElement("button");
        info_button.classList.add("info");
        info_button.classList.add("full");
        info_button.innerHTML = `<img src="/images/information.png" alt="information">Thông tin`;
        attributionDiv.appendChild(info_button);
        info_button.addEventListener("click", (e) => {
          current_feature = feature;
          setReportBoard();
          if (!infoboards.classList.contains("active"))
            infoboards.classList.add("active");
        });
      }

      return L.circleMarker(latlng, geojsonReportMarkerOptions).bindPopup(
        attributionDiv
      );
    },
    style: function (feature) {
      if (feature.properties.state === 0) {
        return {
          color: "#0FFF50",
          fillColor: "#0FFF50",
        };
      } else {
        return {
          color: "#FFC300",
          fillColor: "#FFC300",
        };
      }
    },
  }).addTo(map);

  L.Control.Button = L.Control.extend({
    options: {
      position: "topright",
    },
    onAdd: function (map) {
      var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
      var button = L.DomUtil.create("a", "leaflet-control-button", container);
      L.DomEvent.disableClickPropagation(button);
      L.DomEvent.on(button, "click", function () {
        showBillBoard = !showBillBoard;
        if (showBillBoard) {
          map.addLayer(geojsonLayer);
          map.addLayer(markers);
        } else {
          map.removeLayer(geojsonLayer);
          map.removeLayer(markers);
        }
      });

      container.title = "Show Billboard";

      return container;
    },
    onRemove: function (map) {},
  });
  var control = new L.Control.Button();
  control.addTo(map);

  L.Control.Button = L.Control.extend({
    options: {
      position: "topright",
    },
    onAdd: function (map) {
      var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
      var button = L.DomUtil.create("a", "leaflet-control-button", container);
      L.DomEvent.disableClickPropagation(button);
      L.DomEvent.on(button, "click", function () {
        showBillReport = !showBillReport;
        if (showBillReport) {
          map.addLayer(reportLayer);
        } else {
          map.removeLayer(reportLayer);
        }
      });

      container.title = "Show report";

      return container;
    },
    onRemove: function (map) {},
  });
  var billboard = new L.Control.Button();
  billboard.addTo(map);
};
