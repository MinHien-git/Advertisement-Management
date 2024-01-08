const db = require("../database/database");
const License = require("../models/license.model");
const Billboard = require("../models/bill-board.model");
const User = require("../models/users.model");
const { ObjectId } = require("mongodb");
const { v4 } = require("uuid");
const nodemailer = require("nodemailer");

function runAtSpecificTimeOfDay(hour, minutes, func) {
    const twentyFourHours = 86400000;
    const now = new Date();
    let eta_ms =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hour,
            minutes,
            0,
            0
        ).getTime() - now;
    if (eta_ms < 0) {
        eta_ms += twentyFourHours;
    }
    setTimeout(function () {
        //run once
        func();
        // run every 24 hours from now on
        setInterval(func, twentyFourHours);
    }, eta_ms);
}
//Kiểm tra ngày kết thúc của yêu cầu chưa được duyệt và yêu cầu đã được duyệt,
// nếu quá hạn thì chuyển state thành 3 (đã hết hạn)
function createEmailContent(company_name, billboard_address) {
    const html = `
    <h2>Kính gửi ${company_name},</h2>
    <p style="font-size: 1.1rem;">Thời hạn cấp phép bảng quảng cáo tại địa điểm ${billboard_address} của quý công ty đã hết hạn, xin vui lòng liên hệ cán bộ Phường hoặc Quận quản lý để được trợ giúp.</p>
    <p style="font-size: 1.1rem;">Xin cảm ơn quý công ty.</p>
    <br/>
    <p style="font-size: 1rem;"><strong>Sở Văn hoá Và Thông tin Thành phố Hồ Chí Minh.</strong></p>
    `;

    return html;
}

const start_time = new Date();
const start_hour = start_time.getHours();
const start_minutes = start_time.getMinutes();
console.log(start_hour, start_minutes);

runAtSpecificTimeOfDay(start_hour, start_minutes + 1, async () => {
    console.log("check end date");
    let today = new Date();

    let licenses = await db
        .getDb()
        .collection("licenses")
        .aggregate([
            {
                $lookup: {
                    from: "billboard",
                    localField: "billboard",
                    foreignField: "_id",
                    as: "billboard",
                },
            },
        ])
        .toArray();

    let expired_licenses = [];
    let expired_pending_licenses = [];
    let company_emails = [];
    let email_contents = [];

    for (let i = 0; i < licenses.length; i++) {
        let end_date = new Date(licenses[i].end_date);
        if (licenses[i].state == 1 && today >= end_date) {
            expired_licenses.push(licenses[i]._id);
            company_emails.push(licenses[i].company_contact);
            let address = licenses[i].billboard[0].properties.place;
            address = address.split(", Thành")[0];
            address = address.replace("Đ. ", "");
            email_contents.push(
                createEmailContent(licenses[i].company_name, address)
            );
            continue;
        }
        if (licenses[i].state == 3 && today > end_date) {
            expired_pending_licenses.push(licenses[i]._id);
        }
    }
    if (expired_licenses.length > 0) {
        console.log("expired licenses:");
        console.log(expired_licenses);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "sovhtthcm@gmail.com",
                pass: "kapkcvmjwslabwdu",
            },
        });

        for (let i = 0; i < expired_licenses.length; i++) {
            await db
                .getDb()
                .collection("billboard")
                .findOneAndUpdate(
                    { license: expired_licenses[i] },
                    { $unset: { license: "" } }
                );
            console.log(
                "removed license " +
                    expired_licenses[i].toString() +
                    " from billboard."
            );
            await db
                .getDb()
                .collection("licenses")
                .findOneAndUpdate(
                    { _id: expired_licenses[i] },
                    { $set: { state: 4 } }
                );
            console.log(
                "set state of license " +
                    expired_licenses[i].toString() +
                    " to expired."
            );

            const info = await transporter.sendMail({
                from: "Sở VHTT Tp.HCM <sovhtthcm@gmail.com>",
                to: company_emails[i],
                subject: "Thông báo hết hạn cấp phép bảng quảng cáo.",
                html: email_contents[i],
            });
            console.log("Email sent: " + info.messageId);
        }
    } else console.log("expired licenses: 0");

    if (expired_pending_licenses > 0) {
        console.log("expired pending licenses:");
        console.log(expired_pending_licenses);

        for (let i = 0; i < expired_pending_licenses.length; i++) {
            await db
                .getDb()
                .collection("billboard")
                .findOneAndUpdate(
                    { license: expired_pending_licenses[i] },
                    { $unset: { license: "" } }
                );

            console.log(
                "removed license " +
                    expired_pending_licenses[i].toString() +
                    " from billboard."
            );
            await db
                .getDb()
                .collection("licenses")
                .findOneAndUpdate(
                    { _id: expired_pending_licenses[i] },
                    { $set: { state: 4 } }
                );

            console.log(
                "set state of pending license " +
                    expired_pending_licenses[i].toString() +
                    " to expired."
            );
        }
    }
});

//số item mỗi trang

const ITEMS_PER_PAGE = 20;

//lấy số item tổng cộng và số trang
async function getItemAmount(collection_id, query = {}) {
    return await db.getDb().collection(collection_id).countDocuments(query);
}

function pageAmount(item_amount) {
    return Math.ceil(item_amount / ITEMS_PER_PAGE);
}

// //req query -> mongodb query
// async function createPaginationInfo(req, res, collection_name, queries){
//     let current_page = parseInt(req.query.page) || 1;
//     let skip_val = (current_page - 1) * ITEMS_PER_PAGE;

//     res.locals.item_amount = await getItemAmount(collection_name, queries);
//     res.locals.page_amount = pageAmount(res.locals.item_amount);
//     res.locals.current_page = current_page;
//     res.locals.items_per_page = ITEMS_PER_PAGE;

//     return skip_val;
// }

async function getPageContent(req, res, item_list) {
    let current_page = parseInt(req.query.page) || 1;
    let start_index = (current_page - 1) * ITEMS_PER_PAGE;
    let end_index = current_page * ITEMS_PER_PAGE;

    res.locals.item_amount = item_list.length;
    res.locals.page_amount = pageAmount(res.locals.item_amount);
    res.locals.current_page = current_page;
    res.locals.items_per_page = ITEMS_PER_PAGE;

    let page_item_list = item_list.slice(start_index, end_index);

    return page_item_list;
}

function createSearchQuery(search_val) {
    let search_query =
        search_val != null && search_val != ""
            ? {
                  "properties.place": { $regex: search_val, $options: "i" },
              }
            : {};

    return search_query;
}

async function sortList(item_list, sort_val, type) {
    if (sort_val != null && sort_val != "") {
        if (sort_val == "newest") {
            item_list.sort((a, b) => {
                a._id = a._id.toString();
                b._id = b._id.toString();
                return b._id.localeCompare(a._id);
            });
        } else if (sort_val == "oldest") {
            item_list.sort((a, b) => {
                a._id = a._id.toString();
                b._id = b._id.toString();
                return a._id.localeCompare(b._id);
            });
        } else if (sort_val == "address_asc") {
            if (type != "users") {
                item_list.sort(
                    (a, b) =>
                        a.district.localeCompare(b.district, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        }) ||
                        a.ward.localeCompare(b.ward, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        }) ||
                        a.street.localeCompare(b.street, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        })
                );
            } else {
                item_list.sort((a, b) => {
                    if (a.district == null || a.ward == null) {
                        a.district = "";
                        a.ward = "";
                    }
                    if (b.district == null || b.ward == null) {
                        b.district = "";
                        b.ward = "";
                    }
                    return (
                        a.type_user - b.type_user ||
                        a.district.localeCompare(b.district, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        }) ||
                        a.ward.localeCompare(b.ward, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        })
                    );
                });
            }
        } else if (sort_val == "address_desc") {
            if (type != "users") {
                item_list.sort(
                    (a, b) =>
                        b.district.localeCompare(a.district, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        }) ||
                        b.ward.localeCompare(a.ward, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        }) ||
                        b.street.localeCompare(a.street, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        })
                );
            } else {
                item_list.sort((a, b) => {
                    if (a.district == null || a.ward == null) {
                        a.district = "";
                        a.ward = "";
                    }
                    if (b.district == null || b.ward == null) {
                        b.district = "";
                        b.ward = "";
                    }
                    return (
                        b.type_user - a.type_user ||
                        b.district.localeCompare(a.district, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        }) ||
                        b.ward.localeCompare(a.ward, undefined, {
                            numeric: true,
                            sensitivity: "base",
                        })
                    );
                });
            }
        } else {
            //sắp xếp mới nhất nếu query khác
            item_list.sort((a, b) => {
                a._id = a._id.toString();
                b._id = b._id.toString();
                return b._id.localeCompare(a._id);
            });
        }
    } else {
        //mặc định sắp xếp mới nhất
        item_list.sort((a, b) => {
            a._id = a._id.toString();
            b._id = b._id.toString();
            return b._id.localeCompare(a._id);
        });
    }
    item_list.sort((a, b) => {
        a.district.localeCompare(b.district, undefined, {
            numeric: true,
            sensitivity: "base",
        }) ||
            a.ward.localeCompare(b.ward, undefined, {
                numeric: true,
                sensitivity: "base",
            }) ||
            a.street.localeCompare(b.street, undefined, {
                numeric: true,
                sensitivity: "base",
            });
    });
    return item_list;
}

//filter
async function filterItems(item_list, query, path) {
    let district_arr = [];
    let type_arr = [];
    let ad_type_arr = [];
    let land_type_arr = [];
    let status_arr = [];

    if ("district" in query) {
        district_arr = query.district.split(",");
        item_list = item_list.filter((item) => {
            for (let i = 0; i < district_arr.length; i++) {
                if (district_arr[i] != "Quận 1" && item.district == "1") {
                    continue;
                }
                if (district_arr[i].includes(item.district)) {
                    return true;
                }
            }
        });
    }

    if ("item-type" in query) {
        type_arr = query["item-type"].split(",");

        item_list = item_list.filter((item) => {
            if (path.includes("billboards") || path.includes("licenses")) {
                for (let i = 0; i < type_arr.length; i++) {
                    if (type_arr[i].includes(item.properties.type)) {
                        return true;
                    }
                }
            } else if (path.includes("reports")) {
                for (let i = 0; i < type_arr.length; i++) {
                    if (type_arr[i].includes(item.type)) {
                        return true;
                    }
                }
            } else if (path.includes("users")) {
                for (let i = 0; i < type_arr.length; i++) {
                    if (type_arr[i].includes(item.level)) {
                        return true;
                    }
                }
            }
        });
    }

    if ("ad-type" in query) {
        ad_type_arr = query["ad-type"].split(",");

        item_list = item_list.filter((item) => {
            for (let i = 0; i < ad_type_arr.length; i++) {
                if (ad_type_arr[i].includes(item.properties.type_advertise)) {
                    return true;
                }
            }
        });
    }

    if ("land-type" in query) {
        land_type_arr = query["land-type"].split(",");

        item_list = item_list.filter((item) => {
            for (let i = 0; i < land_type_arr.length; i++) {
                if (land_type_arr[i].includes(item.properties.place_type)) {
                    return true;
                }
            }
        });
    }

    if ("status" in query) {
        status_arr = query.status.split(",");
        item_list = item_list.filter((item) => {
            for (let i = 0; i < status_arr.length; i++) {
                if (path.includes("billboards") || path.includes("licenses")) {
                    for (let i = 0; i < status_arr.length; i++) {
                        if (status_arr[i].includes(item.properties.status)) {
                            return true;
                        }
                    }
                } else if (path.includes("reports")) {
                    for (let i = 0; i < status_arr.length; i++) {
                        if (status_arr[i].includes(item.state)) {
                            return true;
                        }
                    }
                }
            }
        });
    }

    return item_list;
}

async function processList(collection, search_queries) {
    //const filter_query = createFilterQuery(filterVal);
    //const sort_query = createSortQuery(sortVal);
    let item_list = [];
    if (collection != "licenses" && collection != "requests") {
        item_list = await db
            .getDb()
            .collection(collection)
            .find(search_queries)
            .toArray();
    } else {
        if (collection == "licenses") {
            item_list = await db
                .getDb()
                .collection(collection)
                .aggregate([
                    { $match: search_queries },
                    {
                        $lookup: {
                            from: "billboard",
                            localField: "billboard.billboard_id",
                            foreignField: "_id",
                            as: "billboard_info",
                        },
                    },
                ])
                .toArray();

            for (let i = 0; i < item_list.length; i++) {
                if (
                    item_list[i].billboard_info != null &&
                    item_list[i].billboard_info.length > 0
                ) {
                    const boards_number =
                        item_list[i].billboard_info[0].properties.boards.length;

                    for (let j = 0; j < boards_number; j++) {
                        if (
                            item_list[i].billboard.board_id.toString() ==
                            item_list[i].billboard_info[0].properties.boards[
                                j
                            ]._id.toString()
                        ) {
                            item_list[i].billboard_info[0].properties.boards =
                                item_list[
                                    i
                                ].billboard_info[0].properties.boards[j];
                            break;
                        }
                    }
                }
            }
        } else if (collection == "requests") {
            item_list = await db
                .getDb()
                .collection(collection)
                .aggregate([
                    { $match: search_queries },
                    {
                        $lookup: {
                            from: "billboard",
                            localField: "billboard",
                            foreignField: "_id",
                            as: "billboard",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "official_id",
                            foreignField: "_id",
                            as: "official",
                        },
                    },
                ])
                .toArray();
        }
    }

    if (collection == "billboard") {
        item_list = await db
            .getDb()
            .collection(collection)
            .aggregate([
                {
                    $unwind: "$properties.boards",
                },
                {
                    $lookup: {
                        from: "licenses",
                        localField: "properties.boards.license",
                        foreignField: "_id",
                        as: "properties.boards.license",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        type: 1,
                        "properties.place": 1,
                        "properties.place_type": 1,
                        "properties.type_advertise": 1,
                        "properties.status": "$properties.status",
                        "properties.board_amount": 1,
                        boards: "$properties.boards",
                        geometry: 1,
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        type: {
                            $first: "$type",
                        },
                        properties: {
                            $first: "$properties",
                        },
                        boards: {
                            $push: "$boards",
                        },
                        geometry: {
                            $first: "$geometry",
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        type: 1,
                        "properties.place": 1,
                        "properties.place_type": 1,
                        "properties.type_advertise": 1,
                        "properties.status": "$properties.status",
                        "properties.board_amount": 1,
                        "properties.boards": "$boards",
                        geometry: 1,
                    },
                },
            ])
            .toArray();
        const full_list = await db
            .getDb()
            .collection(collection)
            .find(search_queries)
            .toArray();
        for (let i = 0; i < full_list.length; i++) {
            if (full_list[i].properties.boards.length == 0) {
                item_list.push(full_list[i]);
            }
        }
    }
    for (let i = 0; i < item_list.length; i++) {
        let place = "";
        if (collection == "users") return item_list;
        if (collection == "billboard") {
            place = item_list[i].properties.place;
        } else if (collection == "licenses") {
            if (
                item_list[i].billboard_info != null &&
                item_list[i].billboard_info.length > 0
            ) {
                place = item_list[i].billboard_info[0].properties.place;
            }
        } else if (collection == "reports") {
            place = item_list[i].place;
        }

        if (place.includes("Đ. ") == true) {
            place = place.replace("Đ. ", "");
        }
        let address = place.split(", ");
        let street = address[0];
        let ward = address[1];
        let district = address[2];

        ward = ward?.replace("Phường ", "");
        ward = ward?.replace("Xã ", "");
        district = district?.replace("Quận ", "");
        district = district?.replace("Huyện ", "");

        item_list[i].street = street;
        item_list[i].ward = ward;
        item_list[i].district = district;
    }
    // item_list.sort((a, b) =>
    //     a.properties.district.localeCompare(b.properties.district, undefined, { numeric: true, sensitivity: "base" })
    //     || a.properties.ward.localeCompare(b.properties.ward, undefined, { numeric: true, sensitivity: "base" })
    // );

    return item_list;
}

async function getUniqueDistrictsWards(item_list) {
    let unique_districts = [];
    for (let i = 0; i < item_list.length; i++) {
        if (unique_districts.includes(item_list[i].district) == false) {
            unique_districts.push(item_list[i].district);
        }
    }

    unique_districts.sort((a, b) =>
        a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: "base",
        })
    );
    //very hard to read loop for adding district prefix
    const district_db = await db
        .getDb()
        .collection("district-ward")
        .find()
        .toArray();
    for (
        let uni_dist_index = 0;
        uni_dist_index < unique_districts.length;
        uni_dist_index++
    ) {
        for (
            let dist_db_index = 0;
            dist_db_index < district_db.length;
            dist_db_index++
        ) {
            if (
                district_db[dist_db_index].district.includes(
                    unique_districts[uni_dist_index]
                ) == true
            ) {
                unique_districts[uni_dist_index] =
                    district_db[dist_db_index].district;
                break;
            }
        }
    }
    return unique_districts;
}

async function getUniqueTypesAndStatuses(item_list, item_type) {
    let unique_types = [];
    let unique_statuses = [];

    if (item_type == "billboards") {
        for (let i = 0; i < item_list.length; i++) {
            if (unique_types.includes(item_list[i].properties.type) == false) {
                unique_types.push(item_list[i].properties.type);
            }
            if (
                unique_statuses.includes(item_list[i].properties.status) ==
                false
            ) {
                unique_statuses.push(item_list[i].properties.status);
            }
        }
    } else if (
        item_type == "licenses" ||
        item_type == "reports" ||
        item_type == "requests"
    ) {
        for (let i = 0; i < item_list.length; i++) {
            if (unique_types.includes(item_list[i].type) == false) {
                unique_types.push(item_list[i].type);
            }
            if (unique_statuses.includes(item_list[i].state) == false) {
                unique_statuses.push(item_list[i].state);
            }
        }
    } else if (item_type == "users") {
        for (let i = 0; i < item_list.length; i++) {
            if (unique_types.includes(item_list[i].level) == false) {
                unique_types.push(item_list[i].level);
            }
        }
    }
    unique_types.sort((a, b) => {
        if (!isNaN(a) && !isNaN(b)) {
            a = a.toString();
            b = toString();
        }
        a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: "base",
        });
    });

    unique_statuses.sort((a, b) => a - b);

    return { unique_types, unique_statuses };
}

async function getUniqueAdInfo(item_list) {
    let unique_ad_types = [];
    let unique_land_types = [];

    if (item_list[0] && "properties" in item_list[0]) {
        for (let i = 0; i < item_list.length; i++) {
            if (
                unique_ad_types.includes(
                    item_list[i].properties.type_advertise
                ) == false
            ) {
                unique_ad_types.push(item_list[i].properties.type_advertise);
            }

            if (
                unique_land_types.includes(
                    item_list[i].properties.place_type
                ) == false
            ) {
                unique_land_types.push(item_list[i].properties.place_type);
            }
        }
    } else if (item_list[0] && "billboard_info" in item_list[0]) {
        for (let i = 0; i < item_list.length; i++) {
            if (
                unique_ad_types.includes(
                    item_list[i].billboard_info[0].properties.type_advertise
                ) == false
            ) {
                unique_ad_types.push(
                    item_list[i].billboard_info[0].properties.type_advertise
                );
            }

            if (
                unique_land_types.includes(
                    item_list[i].billboard_info[0].properties.place_type
                ) == false
            ) {
                unique_land_types.push(
                    item_list[i].billboard_info[0].properties.place_type
                );
            }
        }
    } else {
        for (let i = 0; i < item_list.length; i++) {
            if (
                unique_ad_types.includes(
                    item_list[i].billboard[0].properties.type_advertise
                ) == false
            ) {
                unique_ad_types.push(
                    item_list[i].billboard[0].properties.type_advertise
                );
            }

            if (
                unique_land_types.includes(
                    item_list[i].billboard[0].properties.place_type
                ) == false
            ) {
                unique_land_types.push(
                    item_list[i].billboard[0].properties.place_type
                );
            }
        }
    }

    unique_ad_types.sort((a, b) =>
        a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: "base",
        })
    );

    unique_land_types.sort((a, b) =>
        a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: "base",
        })
    );

    return { unique_ad_types, unique_land_types };
}

//Quản lí bảng quảng cáo
const _get_billboards = async (req, res) => {
    let search_val = req.query.search;
    let sort_val = req.query.sort;

    let search_query = createSearchQuery(search_val);

    res.locals.type_user = 2;
    res.locals.isAuth = true;
    // res.locals.billboards = await db
    //     .getDb()
    //     .collection("billboard")
    //     .find(
    //         search_query
    //     )
    //     .skip(skip_val)
    //     .sort(sort_val)
    //     .collation({locale: 'en', numericOrdering: true})
    //     .limit(ITEMS_PER_PAGE)
    //     .toArray();

    let item_list = await processList("billboard", search_query);

    res.locals.list_districts = await getUniqueDistrictsWards(item_list);

    let { unique_types, unique_statuses } = await getUniqueTypesAndStatuses(
        item_list,
        "billboards"
    );
    let { unique_ad_types, unique_land_types } = await getUniqueAdInfo(
        item_list
    );

    res.locals.list_types = unique_types;
    res.locals.list_statuses = unique_statuses;
    res.locals.ad_types = unique_ad_types;
    res.locals.land_types = unique_land_types;

    item_list = await filterItems(item_list, req.query, req.path);

    item_list = await sortList(item_list, sort_val, "billboards");
    let pageItems = await getPageContent(req, res, item_list);

    res.locals.billboards = pageItems;

    res.locals.billboards.forEach((billboard) => {
        billboard.properties.place =
            billboard.properties.place.split(", Thành phố")[0];
    });

    res.render("phan-cum-soVHTT/QuanLiQC");
};

const _edit_billboard = async (req, res) => {
    const {
        id,
        type,
        place,
        type_advertise,
        place_type,
        size,
        amount,
        status,
    } = req.body;
    const billboard = await db
        .getDb()
        .collection("billboard")
        .findOne({ _id: new ObjectId(id) });
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
        res.send("billboard " + id + " updated!");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};

const _edit_billboard_on_map = async (req, res) => {
    let {
        _id,
        id,
        billboard__type,
        ad__type,
        position,
        land__type,
        width,
        height,
        amount,
        billboard__status,
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
        amount: Number(amount) + " trụ/bảng",
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
        res.send("billboard " + id + " updated!");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};

const _delete_billboard = async (req, res) => {
    const { id } = req.body;
    try {
        db.getDb()
            .collection("billboard")
            .deleteOne({ _id: new ObjectId(id) });
        console.log("billboard " + id + " deleted!");
        res.send("billboard " + id + " deleted!");
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
        amount,
        billboard__status,
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

    let geometry = {
        coordinates: [lnt, lat],
        type: "Point",
    };

    let properties = {
        globalid: v4(),
        amount: Number(amount) + " trụ/bảng",
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
        res.send("billboard " + id + " created!");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};

//Cấp phép quảng cáo dựa trên yêu cầu cấp phép của phường
const _get_licenses = async (req, res) => {
    let search_val = req.query.search;
    let sort_val = req.query.sort;

    let search_query = createSearchQuery(search_val);

    let item_list = await processList("licenses", search_query);
    res.locals.list_districts = await getUniqueDistrictsWards(item_list);

    let { unique_types, unique_statuses } = await getUniqueTypesAndStatuses(
        item_list,
        "licenses"
    );
    let { unique_ad_types, unique_land_types } = await getUniqueAdInfo(
        item_list
    );

    res.locals.list_types = unique_types;
    res.locals.list_statuses = unique_statuses;
    res.locals.ad_types = unique_ad_types;
    res.locals.land_types = unique_land_types;

    item_list = await filterItems(item_list, req.query, req.path);
    item_list = await sortList(item_list, sort_val, "licenses");
    let pageItems = await getPageContent(req, res, item_list);

    res.locals.licenses = pageItems;

    res.locals.licenses.forEach((license) => {
        license.billboard_info[0].properties.place =
            license.billboard_info[0].properties.place.split(", Thành phố")[0];
    });

    res.render("phan-cum-soVHTT/DuyetYCCapPhep");
};
const _approve_license = async (req, res) => {
    const { id, state } = req.body;

    try {
        const license = await db
            .getDb()
            .collection("licenses")
            .findOne({ _id: new ObjectId(id) });
        const updateInfo = new License(
            license.billboard,
            license.company_name,
            license.company_contact,
            license.start_date,
            license.end_date,
            state,
            license.images
        );
        await db
            .getDb()
            .collection("licenses")
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { ...updateInfo } }
            );

        await db
            .getDb()
            .collection("billboard")
            .findOneAndUpdate(
                { _id: new ObjectId(license.billboard) },
                { $set: { license: license._id } }
            );
        console.log("license " + id + " approved!");
        return res.send("license " + id + " approved!");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _decline_license = async (req, res) => {
    const { id, state } = req.body;

    try {
        const license = await db
            .getDb()
            .collection("licenses")
            .findOne({ _id: new ObjectId(id) });
        const updateInfo = new License(
            license.billboard,
            license.company_name,
            license.company_contact,
            license.start_date,
            license.end_date,
            state,
            license.images
        );
        await db
            .getDb()
            .collection("licenses")
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { ...updateInfo } }
            );

        await db
            .getDb()
            .collection("billboard")
            .findOneAndUpdate(
                { _id: new ObjectId(license.billboard) },
                { $set: { license: license._id } }
            );
        console.log("license for billboard " + id + " declined.");
        return res.send("license for billboard " + id + " declined.");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _post_license_edit_request = async (req, res) => {
    const { id, edit_request } = req.body;
    try {
        await db
            .getDb()
            .collection("licenses")
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { edit_request: edit_request, state: 3 } }
            );
        console.log("Edit request for license " + id + " sent!");
        return res.send("Edit request for license " + id + " sent!");
    } catch (err) {
        res.send(err);
        console.log(err);
    }
};

const _get_edit_requests = async (req, res) => {
    let search_val = req.query.search;
    let sort_val = req.query.sort;

    let search_query = createSearchQuery(search_val);

    let item_list = await processList("requests", search_query);

    res.locals.list_districts = await getUniqueDistrictsWards(item_list);

    let { unique_types, unique_statuses } = await getUniqueTypesAndStatuses(
        item_list,
        "requests"
    );
    let { unique_ad_types, unique_land_types } = await getUniqueAdInfo(
        item_list
    );

    res.locals.list_types = unique_types;
    res.locals.list_statuses = unique_statuses;
    res.locals.ad_types = unique_ad_types;
    res.locals.land_types = unique_land_types;

    item_list = await filterItems(item_list, req.query, req.path);
    item_list = await sortList(item_list, sort_val, "requests");
    let pageItems = await getPageContent(req, res, item_list);

    res.locals.edit_requests = pageItems;

    res.locals.edit_requests.forEach((edit_req) => {
        edit_req.billboard[0].properties.place =
            edit_req.billboard[0].properties.place.split(", Thành phố")[0];
    });

    res.render("phan-cum-soVHTT/DuyetYCChinhSua");
};
const _approve_edit_request = async (req, res) => {
    const { id, state } = req.body;

    try {
        const license = await db
            .getDb()
            .collection("licenses")
            .findOne({ _id: new ObjectId(id) });
        const updateInfo = new License(
            license.billboard,
            license.company_name,
            license.company_contact,
            license.start_date,
            license.end_date,
            state,
            license.images
        );
        await db
            .getDb()
            .collection("licenses")
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { ...updateInfo } }
            );

        await db
            .getDb()
            .collection("billboard")
            .findOneAndUpdate(
                { _id: new ObjectId(license.billboard) },
                { $set: { license: license._id } }
            );
        console.log("license " + id + " approved!");
        return res.send("license " + id + " approved!");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _decline_edit_request = async (req, res) => {
    const { id, state } = req.body;

    try {
        const license = await db
            .getDb()
            .collection("licenses")
            .findOne({ _id: new ObjectId(id) });
        const updateInfo = new License(
            license.billboard,
            license.company_name,
            license.company_contact,
            license.start_date,
            license.end_date,
            state,
            license.images
        );
        await db
            .getDb()
            .collection("licenses")
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { ...updateInfo } }
            );

        await db
            .getDb()
            .collection("billboard")
            .findOneAndUpdate(
                { _id: new ObjectId(license.billboard) },
                { $set: { license: license._id } }
            );
        console.log("license for billboard " + id + " declined.");
        return res.send("license for billboard " + id + " declined.");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};

//Duyệt yêu cầu chỉnh sửa của phường
const _get_reports = async (req, res) => {
    let search_val = req.query.search;
    let sort_val = req.query.sort;

    let search_query = createSearchQuery(search_val);

    res.locals.type_user = 2;
    res.locals.isAuth = true;

    let item_list = await processList("reports", search_query);

    res.locals.list_districts = await getUniqueDistrictsWards(item_list);

    let { unique_types, unique_statuses } = await getUniqueTypesAndStatuses(
        item_list,
        "reports"
    );

    res.locals.list_types = unique_types;
    res.locals.list_statuses = unique_statuses;

    item_list = await filterItems(item_list, req.query, req.path);
    item_list = await sortList(item_list, sort_val, "reports");
    let pageItems = await getPageContent(req, res, item_list);

    res.locals.reports = pageItems;

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
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { state: state } }
            );
        if (state == 1) {
            console.log("Report " + id + " approved!");
            res.send("Report " + id + " approved!");
        } else if (state == 2) {
            console.log("Report " + id + " denied!");
            res.send("Report " + id + " denied!");
        }
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _post_report_change_request = async (req, res) => {
    const { id, state, edit_request } = req.body;
    try {
        await db
            .getDb()
            .collection("reports")
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { edit_request: edit_request, state: state } }
            );
        console.log("Edit request for report " + id + " sent!");
        return res.send("Edit request for report " + id + " sent!");
    } catch (err) {
        res.send(err);
        console.log(err);
    }
};

//Quản lí tài khoản
const _get_accounts = async (req, res) => {
    let search_val = req.query.search;
    let sort_val = req.query.sort;

    let search_query = createSearchQuery(search_val);

    let item_list = await processList("users", search_query);

    res.locals.list_districts = await getUniqueDistrictsWards(item_list);

    let { unique_types, unique_statuses } = await getUniqueTypesAndStatuses(
        item_list,
        "users"
    );

    res.locals.list_types = unique_types;
    res.locals.list_statuses = unique_statuses;

    item_list = await filterItems(item_list, req.query, req.path);
    item_list = await sortList(item_list, sort_val, "users");
    let pageItems = await getPageContent(req, res, item_list);

    res.locals.users = pageItems;
    // res.locals.users = await db
    //     .getDb()
    //     .collection("users")
    //     .find({})
    //     .project({ password: 0 })
    //     .toArray();
    res.locals.areas = await db
        .getDb()
        .collection("district-ward")
        .find({})
        .sort({ type: 1, district: 1 })
        .toArray();
    res.render("phan-cum-soVHTT/QuanLiTK");
};
const _edit_account = (req, res) => {
    const { id, name, email, phone, birth, type_user, district, ward } =
        req.body;
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
        return res.send("Account " + id + " updated!");
    } catch (err) {
        res.send(err);
        console.log(err);
    }
};
const _delete_account = (req, res) => {
    const { id } = req.body;
    try {
        db.getDb()
            .collection("users")
            .deleteOne({ _id: new ObjectId(id) });
        console.log("account " + id + " deleted!");
        return res.send("account " + id + " deleted!");
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
        return res.send("Account for " + name + " created!");
    } catch (err) {
        res.send(err);
        console.log(err);
    }
};

const _get_districts_wards = async (req, res) => {
    let search_val = req.query.search;
    let sort_val = req.query.sort;

    let search_query = createSearchQuery(search_val);

    let item_list = await processList("districts", search_query);

    item_list = await filterItems(item_list, req.query, req.path);
    item_list = await sortList(item_list, sort_val, "districts");
    let pageItems = await getPageContent(req, res, item_list);

    res.locals.districts = pageItems;

    res.locals.districts = await db
        .getDb()
        .collection("district-ward")
        .find({})
        .sort({ type: 1, district: 1 })
        .collation({ locale: "en_US", numericOrdering: true })
        .toArray();
    res.render("phan-cum-soVHTT/QuanLiQuanPhuong");
};

const _create_district = async (req, res) => {
    const { code, name, type } = req.body;
    try {
        const existing_dist = await db
            .getDb()
            .collection("district-ward")
            .findOne({ $or: [{ code: code }, { district: name }] });
        if (existing_dist == null) {
            await db.getDb().collection("district-ward").insertOne({
                district: name,
                code: code,
                type: type,
                wards: [],
            });

            console.log("District added!");
            return res.send("District added!");
        } else {
            console.log("District already exists!");
            return res.send("District already exists!");
        }
    } catch (err) {
        res.send(err);
        console.log(err);
    }
};
const _create_ward = async (req, res) => {
    const { district_id, code, name } = req.body;
    try {
        const district = await db
            .getDb()
            .collection("district-ward")
            .findOne({ _id: new ObjectId(district_id) });
        const existing_ward = district.wards.filter((ward) => {
            ward.code == code || ward.ward == name;
        });
        if (existing_ward != null) {
            const new_ward = { code: code, ward: name };
            await db
                .getDb()
                .collection("district-ward")
                .updateOne(
                    { _id: new ObjectId(district_id) },
                    { $push: { wards: new_ward } }
                );

            console.log("Ward added!");
            return res.send("Ward added!");
        } else {
            console.log("Ward already exists!");
            return res.send("Ward already exists!");
        }
    } catch (err) {
        res.send(err);
        console.log(err);
    }
};

const _edit_district = async (req, res) => {
    const { district_id, code, name, type } = req.body;
    try {
        const existing_district = await db
            .getDb()
            .collection("district-ward")
            .findOne({ _id: new ObjectId(district_id) });
        console.log(district_id);
        if (existing_district != null) {
            await db
                .getDb()
                .collection("district-ward")
                .findOneAndUpdate(
                    { _id: new ObjectId(district_id) },
                    {
                        $set: {
                            code: code,
                            name: name,
                            type: type,
                            wards: existing_district.wards,
                        },
                    }
                );
            console.log("District " + district_id + " updated!");
            return res.send("District " + district_id + " updated!");
        } else {
            console.log("District not found!");
            return res.send("District not found!");
        }
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _edit_ward = async (req, res) => {
    const { district_id, old_ward_code, new_ward_code, new_ward_name } =
        req.body;
    try {
        const existing_district = await db
            .getDb()
            .collection("district-ward")
            .findOne({
                _id: new ObjectId(district_id),
                "wards.code": old_ward_code,
            });
        if (existing_district != null) {
            await db
                .getDb()
                .collection("district-ward")
                .findOneAndUpdate(
                    {
                        _id: new ObjectId(district_id),
                        "wards.code": old_ward_code,
                    },

                    {
                        $set: {
                            "wards.$.code": new_ward_code,
                            "wards.$.ward": new_ward_name,
                        },
                    }
                );
            console.log("Ward " + old_ward_code + " updated!");
            return res.send("Ward " + old_ward_code + " updated!");
        } else {
            console.log("District/ward not found!");
            return res.send("District/ward not found!");
        }
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _delete_district = (req, res) => {
    const { district_id } = req.body;
    try {
        db.getDb()
            .collection("district-ward")
            .deleteOne({ _id: new ObjectId(district_id) });
        console.log("District " + district_id + " deleted!");
        return res.send("District " + district_id + " deleted!");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};
const _delete_ward = async (req, res) => {
    const { district_id, ward_code } = req.body;
    try {
        await db
            .getDb()
            .collection("district-ward")
            .updateOne(
                { _id: new ObjectId(district_id) },
                { $pull: { wards: { code: ward_code } } }
            );

        console.log("ward " + ward_code + " deleted!");
        return res.send("Ward " + ward_code + " deleted!");
    } catch (err) {
        res.send(err);
        console.error(err);
    }
};

module.exports = {
    _create_account,
    _get_accounts,
    _delete_account,
    _edit_account,
    _approve_license,
    _edit_billboard,
    _edit_billboard_on_map,
    _delete_billboard,
    _create_billboard,
    _get_billboards,
    _post_license_edit_request,
    _decline_license,
    _get_reports,
    _post_report_change_request,
    _get_licenses,
    _change_report_status,
    _get_edit_requests,
    _approve_edit_request,
    _decline_edit_request,
    _get_districts_wards,
    _create_district,
    _create_ward,
    _edit_district,
    _edit_ward,
    _delete_district,
    _delete_ward,
};
