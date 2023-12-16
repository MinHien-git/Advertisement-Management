const db = require("../database/database");
const License = require("../models/license.model");
const Billboard = require("../models/bill-board.model");
const { ObjectId } = require("mongodb");
const { v4 } = require("uuid");

//Quản lí bảng quảng cáo
const _get_billboards = async (req, res) => {
  res.locals.type_user = 2;
  res.locals.isAuth = true;
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
  const { id, type, place, type_advertise, place_type, size, amount, status } =
    req.body;
  const billboard = await db
    .getDb()
    .collection("billboard")
    .findOne({ _id: new ObjectId(id) });
  console.log(id);
  const globalid = billboard.properties.globalid;
  const updateInfo = new Billboard(null, null, {
    globalid,
    type,
    place,
    type_advertise,
    place_type,
    size,
    amount,
    status,
  });
  try {
    updateInfo._update_billboard(billboard._id);
    console.log("billboard " + id + " updated!");
    return res.redirect("/management/billboards");
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
const _get_licenses = (req, res) => {
  res.render("phan-cum-soVHTT/DuyetYCCapPhep");
};
const _post_approve_license = (req, res) => {};
const _post_decline_license = (req, res) => {};
const _post_license_edit_request = (req, res) => {};

//Duyệt yêu cầu chỉnh sửa của phường
const _get_report = (req, res) => {
  res.render("phan-cum-soVHTT/ThongKeBaoCao");
};
const _post_report_edit = (req, res) => {};

//Quản lí tài khoản
const _get_accounts = (req, res) => {
  res.render("phan-cum-soVHTT/QuanLiTK");
};
const _post_edit_accounts = (req, res) => {};
const _post_delete_accounts = (req, res) => {};
const _post_create_accounts = (req, res) => {};

module.exports = {
  _post_create_accounts,
  _get_accounts,
  _post_delete_accounts,
  _post_edit_accounts,
  _post_approve_license,
  _post_edit_billboard,
  _delete_billboard,
  _create_billboard,
  _get_billboards,
  _post_approve_license,
  _post_license_edit_request,
  _post_decline_license,
  _get_report,
  _post_report_edit,
  _get_licenses,
};
