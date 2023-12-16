const { ObjectId } = require("mongodb");
const report_const = require("../constants/report.type");
const db = require("../database/database");

//type = 0: yêu cầu thay đổi thông tin cấp phép quảng cáo
//type = 1: yêu cầu thay đổi cách thức xử lí báo cáo
module.exports = class SoVHTT_request {
    constructor(type, obj_id, details) {
        this.type = type;
        this.obj_id = obj_id; //id của bảng quảng cáo hoặc của báo cáo
        this.details = details;
        this.state = report_const.REQUEST_STATE_TYPE.INCOMPLETE; //cán bộ phường quận có chấp nhận làm theo yêu cầu chỉnh sửa hay ko
    }
};
