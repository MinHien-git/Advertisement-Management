let report_node;
let lat_lnt;

function get_report(feature) {
  if (report_node) {
    body.removeChild(report_node);
  }
  console.log(feature);
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
      action="/management/billboards/map/create"
    >
    <input type ="hidden" name = "lat" value= ${lat_lnt.lat} >
    <input type ="hidden" name = "lnt" value= ${lat_lnt.lng} >
      <h2>Thêm Bảng Quảng Cáo</h2>
      <div class="form-section">
        <label for="type">Loại quảng cáo:</label>
        <select class="form-select mb-3"
  id="billboard__type__edit"
  name="billboard__type"
  aria-label="billboard type selector"
  required>
  <option value="">Chọn...</option>
  <option value="1">Trụ/Cụm pano</option>
  <option value="2">Trụ bảng hiflex</option>
  <option value="3">Trụ màn hình điện tử LED</option>
  <option value="4">Trụ hộp đèn</option>
  <option value="5">Bảng hiflex ốp tường</option>
  <option value="6">Màn hình điện tử ốp tường</option>
  <option value="7">Trụ treo băng rôn dọc</option>
  <option value="8">Trụ treo băng rôn ngang</option>
  <option value="9">Cổng chào</option>
  <option value="10" >Trung tâm thương mại</option>
</select>
      </div>
      <div class="form-section">
        <label for="street">Địa điểm:</label>
        <textarea id="street" name = "position" >${position}</textarea>
      </div>
      <div class="form-section">
      <label for="form">Hình thức:</label>
      <select
        class="form-select mb-3"
        id="ad__type"
        name ="ad__type"
        aria-label="advertisement type selector">
        <option selected>Chọn...</option>
        <option value="1">Cổ động chính trị</option>
        <option value="2">Quảng cáo thương mại</option>
        <option value="3">An toàn giao thông</option>
        <option value="4">Xã hội hoá</option>
        <option value="5">Mỹ phẩm</option>
        <option value="6">Đồ ăn</option>
        <option value="7">Điện ảnh</option>
      </select>
    </div>
    <div class="form-section">
      <label for="form">Phân loại:</label>
      <select
    class="form-select mb-3"
    id="land__type"
    name="land__type"
    aria-label="Land type selector"
    required
  />
    <option value="">Chọn...</option>
    <option value="1">
      Đất công/Công viên/Hành lang an toàn giao thông
    </option>
    <option value="2">Đất tư nhân/Nhà ở riêng lẻ</option>
    <option value="3">Trung tâm thương mại</option>
    <option value="4">Chợ</option>
    <option value="5">Cây xăng</option>
    <option value="6">Nhà chờ xe buýt</option>
  </select>
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
        <label for="=amount">Số lượng:</label>
        <input
          type="number"
          name="amount"
          id="amount"
          value=""
          placeholder="XY"
          style="width: auto"
        />
      </div>
      <p style="font-size: 0.7rem">trụ/bảng</p>
    </div>
    <div class="form-section">
        <label for="state">Trạng thái:</label>
        <select
          class="form-select mb-3"
          id="billboard__status" name ="billboard__status"
          aria-label="Billboard status selector">
          <option selected>Chọn...</option>
          <option value="1" class="link-primary">
            Đã quy hoạch
          </option>
          <option value="2" class="link-danger">
            Chưa quy hoạch
          </option>
        </select>
      </div>

      <div class ="px-4 d-flex justify-content-evenly w-100 btn-container">
      <div class="form-section">
        <button class="delete">Xoá</button>
      </div>
      <div class="form-section">
        <button class="submit-button submit">Thêm Bảng</button>
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
}

function get_edit(position, billboard) {
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
      action="/management/billboards/map/edit"
    >
    <input type="hidden" name ="id" value="${billboard?.properties.globalid}" />
    <input type="hidden" name ="_id" value="${billboard?._id}" />
      <h2>Sửa Bảng Quảng Cáo</h2>
      <div class="form-section">
        <label for="type">Loại quảng cáo:</label>
        <select class="form-select mb-3"
  id="billboard__type"
  name="billboard__type"
  aria-label="billboard type selector"
  required>
  <option value="">Chọn...</option>
  <option value="1" ${
    billboard?.properties.type === "Trụ/Cụm pano" ||
    billboard?.properties.type === "Trụ cụm,pano"
      ? "selected"
      : ""
  }>Trụ/Cụm pano</option>
  <option value="2" ${
    billboard?.properties.type === "Trụ bảng hiflex" ? "selected" : ""
  }>Trụ bảng hiflex</option>
  <option value="3" ${
    billboard?.properties.type === "Trụ màn hình điện tử LED" ? "selected" : ""
  }>Trụ màn hình điện tử LED</option>
  <option value="4" ${
    billboard?.properties.type === "Trụ hộp đèn" ? "selected" : ""
  }>Trụ hộp đèn</option>
  <option value="5" ${
    billboard?.properties.type === "Bảng hiflex ốp tường" ? "selected" : ""
  }>Bảng hiflex ốp tường</option>
  <option value="6" ${
    billboard?.properties.type === "Màn hình điện tử ốp tường" ? "selected" : ""
  }>Màn hình điện tử ốp tường</option>
  <option value="7" ${
    billboard?.properties.type === "Trụ treo băng rôn dọc" ? "selected" : ""
  }>Trụ treo băng rôn dọc</option>
  <option value="8" ${
    billboard?.properties.type === "Trụ treo băng rôn ngang" ? "selected" : ""
  }>Trụ treo băng rôn ngang</option>
  <option value="9" ${
    billboard?.properties.type === "Cổng chào" ? "selected" : ""
  }>Cổng chào</option>
  <option value="10" ${
    billboard?.properties.type === "Trung tâm thương mại" ? "selected" : ""
  }>Trung tâm thương mại</option>
</select>
      </div>
      <div class="form-section">
        <label for="street">Địa điểm:</label>
        <textarea id="street" name=position>${position}</textarea>
      </div>
      <div class="form-section">
      <label for="form">Hình thức:</label>
      <select
        class="form-select mb-3"
        id="ad__type"
        name="ad__type"
        aria-label="advertisement type selector">
        <option value="">Chọn...</option>
        <option value="1" ${
          billboard?.properties.type_advertise === "Cổ động chính trị"
            ? "selected"
            : ""
        }>
         Cổ động chính trị
        </option>
        <option value="2" ${
          billboard?.properties.type_advertise === "Quảng cáo thương mại"
            ? "selected"
            : ""
        }>Quảng cáo thương mại</option>
      <option value="3" ${
        billboard?.properties.type_advertise === "An toàn giao thông"
          ? "selected"
          : ""
      }>An toàn giao thông</option>
        <option value="4"
      ${
        billboard?.properties.type_advertise === "Mỹ phẩm" ? "selected" : ""
      }>Mỹ phẩm</option>
        <option value="5" ${
          billboard?.properties.type_advertise === "Đồ ăn" ? "selected" : ""
        }>Đồ ăn</option>
        <option value="6" ${
          billboard?.properties.type_advertise === "Điện ảnh" ? "selected" : ""
        }>Điện ảnh</option>
        <option value="7" ${
          billboard?.properties.type_advertise === "Dịch vụ" ? "selected" : ""
        }>Dịch vụ</option>
      </select>
    </div>
    <div class="form-section">
      <label for="form">Phân loại:</label>
      <select
    class="form-select mb-3"
    id="land__type__edit"
    name="land__type"
    aria-label="Land type selector"
    required
  />
  <option value="">Chọn...</option>
  <option value="1" ${
    billboard.properties.place_type ===
    "Đất công/Công viên/Hành lang an toàn giao thông"
      ? "selected"
      : ""
  }>
    Đất công/Công viên/Hành lang an toàn giao thông
  </option>
  <option value="2" ${
    billboard.properties.place_type === "Đất tư nhân/Nhà ở riêng lẻ"
      ? "selected"
      : ""
  }>Đất tư nhân/Nhà ở riêng lẻ</option>
  <option value="3" ${
    billboard.properties.place_type === "Trung tâm thương mại" ? "selected" : ""
  }>Trung tâm thương mại</option>
  <option value="4" ${
    billboard.properties.place_type === "Chợ" ? "selected" : ""
  }>Chợ</option>
  <option value="5" ${
    billboard.properties.place_type === "Cây xăng" ? "selected" : ""
  }>Cây xăng</option>
  <option value="6" ${
    billboard.properties.place_type === "Nhà chờ xe buýt" ? "selected" : ""
  }>Nhà chờ xe buýt</option>
  <option value="7" ${
    billboard?.properties.type_advertise === "Trường Học" ? "selected" : ""
  }>Trường học</option>
  </select>
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
        <label for="=amount">Số lượng:</label>
        <input
          type="number"
          name="amount"
          id="amount"
          value=""
          placeholder="XY"
          style="width: auto"
        />
      </div>
      <p style="font-size: 0.7rem">trụ/bảng</p>
    </div>
    <div class="form-section">
        <label for="state">Trạng thái:</label>
        <select
          class="form-select mb-3"
          id="billboard__status" name ="billboard__status"
          aria-label="Billboard status selector">
          <option selected>Chọn...</option>
          <option value="1" class="link-primary" ${
            billboard?.properties.zoning ? "selected" : ""
          }>
            Đã quy hoạch
          </option>
          <option value="2" class="link-danger" ${
            !billboard?.properties.zoning ? "selected" : ""
          }>
            Chưa quy hoạch
          </option>
        </select>
      </div>

      <div class ="px-4 d-flex justify-content-evenly w-100 btn-container">
      <div class="form-section">
        <button class="delete">Xoá</button>
      </div>
      <div class="form-section">
        <button class="submit-button submit">Cập nhật</button>
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
}
