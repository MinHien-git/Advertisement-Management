function passToModal(btn, mode, type) {
    let data_id = document.getElementById("data__id__" + mode);
    let data_type = document.getElementById("data__type__" + mode);
    let data_value = document.getElementById("data__value__" + mode);

    if (data_id != null) {
        data_id.value = btn.dataset.typeId;
    }
    if (data_type != null) {
        if (type == "board_type") {
            data_type.value = "Loại bảng quảng cáo";
        } else if (type == "ad_type") {
            data_type.value = "Loại hình quảng cáo";
        } else if (type == "place_type") {
            data_type.value = "Phân loại đất";
        } else if (type == "report_type") {
            data_type.value = "Loại báo cáo";
        }
    }
    if (data_value != null) {
        data_value.value = btn.dataset.typeValue;
    }
}

async function addType(e) {
    e.preventDefault();

    let collection = "";
    const data_type = e.target.data_type_add_type.value;
    if (data_type == "Loại bảng quảng cáo") collection = "billboard_types";
    else if (data_type == "Loại hình quảng cáo") collection = "ad_types";
    else if (data_type == "Phân loại đất") collection = "place_types";
    else if (data_type == "Loại báo cáo") collection = "report_types";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/management/general/general_types", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            collection: collection,
            type_value: e.target.data_value_input_add_type.value,
        })
    );

    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#add__type__modal").modal("hide");
    showToast("add__type__success__toast");
}

async function editType(e) {
    e.preventDefault();

    let collection = "";
    const data_type = e.target.data_type_edit_type.value;
    if (data_type == "Loại bảng quảng cáo") collection = "billboard_types";
    else if (data_type == "Loại hình quảng cáo") collection = "ad_types";
    else if (data_type == "Phân loại đất") collection = "place_types";
    else if (data_type == "Loại báo cáo") collection = "report_types";
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/general/general_types", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            collection: collection,
            type_id: e.target.data_id_edit_type.value,
            type_value: e.target.data_value_input_edit_type.value,
        })
    );

    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#edit__type__modal").modal("hide");
    showToast("save__success__toast");
}

async function deleteType(e) {
    e.preventDefault();

    let collection = "";
    const data_type = e.target.data_type_delete_type.value;
    if (data_type == "Loại bảng quảng cáo") collection = "billboard_types";
    else if (data_type == "Loại hình quảng cáo") collection = "ad_types";
    else if (data_type == "Phân loại đất") collection = "place_types";
    else if (data_type == "Loại báo cáo") collection = "report_types";
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/management/general/general_types", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            collection: collection,
            type_id: e.target.data_id_delete_type.value,
        })
    );

    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#delete__type__modal").modal("hide");
    showToast("delete__success__toast");
}
