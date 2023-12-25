const db = require("../database/database");
const License = require("../models/license.model");
const Billboard = require("../models/bill-board.model");
const User = require("../models/users.model");
const { ObjectId } = require("mongodb");
const { v4 } = require("uuid");
const SoVHTT_Request = require("../models/soVHTT-req.model");

//Quản lí bảng quảng cáo
const _get_billboards = async (req, res) => {
  res.locals.billboards = await db
    .getDb()
    .collection("billboard")
    .find({})
    .toArray();

  res.locals.billboards.forEach((billboard) => {
    billboard.properties.place =
      billboard.properties.place.split(", Thành phố")[0];
    billboard.license = new License(
      "Công ty ABC",
      "ctytABC@ABC.com",
      "22/12/2022",
      "22/12/2023"
    );
  });
  res.render("phan-cum-soVHTT/QuanLiQC");
};
const _post_edit_billboard = async (req, res) => {
  let {
    _id,
    id,
    billboard__type,
    ad__type,
    position,
    land__type,
    width,
    height,
    stand,
    panel,
    billboard__status,
    name,
    contact,
    start,
    end,
    attached_files,
  } = req.body;

  let land_type;
  let ad_type;
  let billboard_type;

  switch (billboard__type) {
    case "1":
      billboard_type = "Trụ/Cụm pano";
      break;
    case "2":
      billboard_type = "Trụ bảng hiflex";
      break;
    case "3":
      billboard_type = "Trụ màn hình điện tử LED";
      break;
    case "4":
      billboard_type = "Trụ hộp đèn";
      break;
    case "5":
      billboard_type = "Bảng hiflex ốp tường";
      break;
    case "6":
      billboard_type = "Màn hình điện tử ốp tường";
      break;
    case "7":
      billboard_type = "Trụ treo băng rôn dọc";
      break;
    case "8":
      billboard_type = "Trụ treo băng rôn ngang";
      break;
    case "9":
      billboard_type = "Cổng chào";
      break;
    case "10":
      billboard_type = "Trung tâm thương mại";
      break;
  }

  switch (ad__type) {
    case "1":
      ad_type = "Cổ động chính trị";
      break;
    case "2":
      ad_type = "Quảng cáo thương mại";
      break;
    case "3":
      ad_type = "An toàn giao thông";
      break;
    case "4":
      ad_type = "Xã hội hoá";
      break;
    case "5":
      ad_type = "Mỹ phẩm";
      break;
    case "6":
      ad_type = "Đồ ăn";
      break;
    case "7":
      ad_type = "Điện ảnh";
      break;
  }

  switch (land__type) {
    case "1":
      land_type = "Đất công/Công viên/Hành lang an toàn giao thông";
      break;
    case "2":
      land_type = "Đất tư nhân/Nhà ở riêng lẻ";
      break;
    case "3":
      land_type = "Trung tâm thương mại";
      break;
    case "4":
      land_type = "Chợ";
      break;
    case "5":
      land_type = "Cây xăng";
      break;
    case "6":
      land_type = "Nhà chờ xe buýt";
      break;
    case "7":
      land_type = "Trường Học";
      break;
  }

  let properties = {
    globalid: id,
    amount: Number(stand) / Number(panel) + " trụ/bảng",
    place: position,
    size: width + "mx" + height + "m",
    place_type: land_type,
    type_advertise: ad_type,
    type: billboard_type,
    zoning: billboard__status === "1" ? true : false,
    image: [],
  };
  const updateInfo = new Billboard(null, null, properties);

  try {
    updateInfo._update_billboard(_id);
    console.log("billboard " + id + " updated!");
    return res.redirect("/management/billboards/map");
  } catch (err) {
    res.send(err);
    console.error(err);
  }
};

const _delete_billboard = async (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    db.getDb()
      .collection("billboard")
      .deleteOne({ _id: new ObjectId(id) });
    console.log("billboard " + id + " deleted!");
    return res.redirect("/management/billboards");
  } catch (err) {
    res.send(err);
    console.error(err);
  }
};
const _create_billboard = async (req, res) => {
  let {
    lat,
    lnt,
    billboard__type,
    ad__type,
    position,
    land__type,
    width,
    height,
    stand,
    panel,
    billboard__status,
    name,
    contact,
    start,
    end,
    attached_files,
  } = req.body;
  console.log(req.body);
  let land_type;
  let ad_type;
  let billboard_type;
  switch (billboard__type) {
    case "1":
      billboard_type = "Trụ/Cụm pano";
      break;
    case "2":
      billboard_type = "Trụ bảng hiflex";
      break;
    case "3":
      billboard_type = "Trụ màn hình điện tử LED";
      break;
    case "4":
      billboard_type = "Trụ hộp đèn";
      break;
    case "5":
      billboard_type = "Bảng hiflex ốp tường";
      break;
    case "6":
      billboard_type = "Màn hình điện tử ốp tường";
      break;
    case "7":
      billboard_type = "Trụ treo băng rôn dọc";
      break;
    case "8":
      billboard_type = "Trụ treo băng rôn ngang";
      break;
    case "9":
      billboard_type = "Cổng chào";
      break;
    case "10":
      billboard_type = "Trung tâm thương mại";
      break;
  }

  switch (ad__type) {
    case "1":
      ad_type = "Cổ động chính trị";
      break;
    case "2":
      ad_type = "Quảng cáo thương mại";
      break;
    case "3":
      ad_type = "An toàn giao thông";
      break;
    case "4":
      ad_type = "Xã hội hoá";
      break;
    case "5":
      ad_type = "Mỹ phẩm";
      break;
    case "6":
      ad_type = "Đồ ăn";
      break;
    case "7":
      ad_type = "Điện ảnh";
      break;
  }

  switch (land__type) {
    case "1":
      land_type = "Đất công/Công viên/Hành lang an toàn giao thông";
      break;
    case "2":
      land_type = "Đất tư nhân/Nhà ở riêng lẻ";
      break;
    case "3":
      land_type = "Trung tâm thương mại";
      break;
    case "4":
      land_type = "Chợ";
      break;
    case "5":
      land_type = "Cây xăng";
      break;
    case "6":
      land_type = "Nhà chờ xe buýt";
      break;
    case "7":
      land_type = "Trường Học";
      break;
  }

  let geometry = {
    coordinates: [lnt, lat],
    type: "Point",
  };

  let properties = {
    globalid: v4(),
    amount: Number(stand) / Number(panel) + " trụ/bảng",
    place: position,
    size: width + "mx" + height + "m",
    place_type: land_type,
    type_advertise: ad_type,
    type: billboard_type,
    zoning: billboard__status === "1" ? true : false,
    image: [],
  };

  try {
    await db
      .getDb()
      .collection("billboard")
      .insertOne({ geometry, type: "Feature", properties });
    return res.redirect("/management/billboards/map");
  } catch (err) {
    res.send(err);
    console.error(err);
  }
  console.log(req.body);
};

//Cấp phép quảng cáo dựa trên yêu cầu cấp phép của phường
const _get_licenses = async (req, res) => {
  res.locals.billboards = await db
    .getDb()
    .collection("billboard")
    .find({ license: { $exists: true } })
    .toArray();

  res.locals.billboards.forEach((billboard) => {
    billboard.properties.place =
      billboard.properties.place.split(", Thành phố")[0];
  });
  res.render("phan-cum-soVHTT/DuyetYCCapPhep");
};
const _approve_license = async (req, res) => {
  const { id, state } = req.body;

  try {
    const billboard = await db
      .getDb()
      .collection("billboard")
      .findOne({ _id: new ObjectId(id) });
    const updateInfo = new Billboard(null, null, null, {
      company_name: billboard.license.company_name,
      company_contact: billboard.license.company_contact,
      start_date: billboard.license.start_date,
      end_date: billboard.license.end_date,
      state: state,
    });
    updateInfo._update_license_state(billboard._id);
    console.log("license for billboard " + id + " approved!");
    return res.redirect("/management/licenses");
  } catch (err) {
    res.send(err);
    console.error(err);
  }
};
const _decline_license = async (req, res) => {
  const { id, state } = req.body;

  try {
    const billboard = await db
      .getDb()
      .collection("billboard")
      .findOne({ _id: new ObjectId(id) });
    const updateInfo = new Billboard(null, null, null, {
      company_name: billboard.license.company_name,
      company_contact: billboard.license.company_contact,
      start_date: billboard.license.start_date,
      end_date: billboard.license.end_date,
      state: state,
    });
    updateInfo._update_license_state(billboard._id);
    console.log("license for billboard " + id + " declined.");
    return res.redirect("/management/licenses");
  } catch (err) {
    res.send(err);
    console.error(err);
  }
};
const _post_license_edit_request = async (req, res) => {
  const { id, details } = req.body;
  const soVHTT_req = new SoVHTT_Request(1, id, details);
  try {
    await db.getDb().collection("soVHTT_requests").insertOne(soVHTT_req);
    console.log("Request for license " + id + " sent!");
    return res.redirect("/management/licenses");
  } catch (err) {
    res.send(err);
    console.log(err);
  }
};

//Duyệt yêu cầu chỉnh sửa của phường
const _get_report = async (req, res) => {
  res.locals.reports = await db
    .getDb()
    .collection("reports")
    .find({})
    .toArray();

  res.locals.reports.forEach((report) => {
    report.place = report.place.split(", Thành phố")[0];
  });
  res.render("phan-cum-soVHTT/ThongKeBaoCao");
};

const _change_report_status = async (req, res) => {
  const { id, state } = req.body;

  try {
    await db
      .getDb()
      .collection("reports")
      .findOneAndUpdate({ _id: id }, { $set: { state: state } });
    console.log("Report " + id + " approved!");
    return res.redirect("/management/reports");
  } catch (err) {
    res.send(err);
    console.error(err);
  }
};
const _post_report_change_request = async (req, res) => {
  const { id, details } = req.body;
  const soVHTT_req = new SoVHTT_Request(2, id, details);
  try {
    await db.getDb().collection("soVHTT_requests").insertOne(soVHTT_req);
    console.log("Request for report " + id + " sent!");
    return res.redirect("/management/reports");
  } catch (err) {
    res.send(err);
    console.log(err);
  }
};

//Quản lí tài khoản
const _get_accounts = async (req, res) => {
  res.locals.users = await db
    .getDb()
    .collection("users")
    .find({})
    .project({ password: 0 })
    .toArray();
  res.locals.areas = await db
    .getDb()
    .collection("district-ward")
    .find({})
    .sort({ type: 1, district: 1 })
    .toArray();
  res.render("phan-cum-soVHTT/QuanLiTK");
};
const _edit_account = (req, res) => {
  const { id, name, email, phone, birth, type_user, district, ward } = req.body;
  try {
    const editInfo = new User(
      email,
      null,
      type_user,
      phone,
      name,
      birth,
      ward,
      district
    );
    editInfo._update(id);
    console.log("Account " + id + " updated!");
    return res.redirect("/management/accounts");
  } catch (err) {
    res.send(err);
    console.log(err);
  }
};
const _delete_account = (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    db.getDb()
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });
    console.log("account " + id + " deleted!");
    return res.redirect("/management/accounts");
  } catch (err) {
    res.send(err);
    console.error(err);
  }
};
const _create_account = (req, res) => {
  const { name, email, phone, birth, type_user, district, ward } = req.body;
  try {
    const createInfo = new User(
      email,
      "acc123",
      type_user,
      phone,
      name,
      birth,
      ward,
      district
    );
    createInfo._register();
    console.log("Account for " + name + " created!");
    return res.redirect("/management/accounts");
  } catch (err) {
    res.send(err);
    console.log(err);
  }
};

module.exports = {
  _create_account,
  _get_accounts,
  _delete_account,
  _edit_account,
  _approve_license,
  _post_edit_billboard,
  _delete_billboard,
  _create_billboard,
  _get_billboards,
  _post_license_edit_request,
  _decline_license,
  _get_report,
  _post_report_change_request,
  _get_licenses,
  _change_report_status,
};
