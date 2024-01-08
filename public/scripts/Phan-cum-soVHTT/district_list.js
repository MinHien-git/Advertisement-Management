function passToModal(btn, mode) {
    const district_id = document.querySelector("#district__id__" + mode);
    const ward_id = document.querySelector("#ward__id__" + mode);
    const district_code = document.querySelector("#district__code__" + mode);
    const ward_code = document.querySelector("#ward__code__" + mode);
    const district_name = document.querySelector("#district__name__" + mode);
    const ward_name = document.querySelector("#ward__name__" + mode);

    if (district_id) {
        district_id.value = btn.dataset.districtId;
    }
    if (ward_id) {
        ward_code_id.value = btn.dataset.wardId ? btn.dataset.wardId : "";
    }
    if (district_code) {
        district_code.value = btn.dataset.districtCode
            ? btn.dataset.districtCode
            : "";
    }
    if (ward_code) {
        ward_code.value = btn.dataset.wardCode ? btn.dataset.wardCode : "";
    }
    if (district_name) {
        district_name.value = btn.dataset.districtName
            ? btn.dataset.districtName
            : "";
    }
    if (ward_name) {
        ward_name.value = btn.dataset.wardName ? btn.dataset.wardName : "";
    }
}

function passToEditWardModal(btn) {
    const district_id = document.querySelector("#district__id__edit__ward");
    const old_ward_code = document.querySelector(
        "#old__ward__code__edit__ward"
    );
    const ward_code = document.querySelector("#ward__code__edit__ward");
    const ward_name = document.querySelector("#ward__name__edit__ward");

    if (district_id) {
        district_id.value = btn.dataset.districtId;
    }
    if (ward_code) {
        ward_code.value = btn.dataset.wardCode;
    }
    if (ward_name) {
        ward_name.value = btn.dataset.wardName;
    }
    if (old_ward_code) {
        old_ward_code.value = btn.dataset.wardCode;
    }
}

async function createDistrict(e) {
    e.preventDefault();
    console.log(event.target);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/management/general/districts_wards/district", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            code: e.target.district_code_input.value,
            name: e.target.district_name_input.value,
            type: Number(
                e.target.district_type_selector.options[
                    e.target.district_type_selector.selectedIndex
                ].value
            ),
        })
    );
    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#create__district__modal").modal("hide");
    showToast("district__create__success__toast");
}

async function createWard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/management/general/districts_wards/ward", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            district_id: e.target.district_id.value,
            code: e.target.ward_code_input.value,
            name: e.target.ward_name_input.value,
        })
    );
    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#create__ward__modal").modal("hide");
    showToast("ward__create__success__toast");
}

async function editDistrict(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/general/districts_wards/district", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            district_id: e.target.district_id.value,
            code: e.target.district_code_input.value,
            name: e.target.district_name_input.value,
            type: Number(
                e.target.district_type_selector.options[
                    e.target.district_type_selector.selectedIndex
                ].value
            ),
        })
    );
    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#edit__district__modal").modal("hide");
    showToast("district__create__success__toast");
}

async function editWard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/general/districts_wards/ward", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            district_id: e.target.district_id.value,
            old_ward_code: e.target.old_ward_code.value,
            new_ward_code: e.target.new_ward_code.value,
            new_ward_name: e.target.new_ward_name.value,
        })
    );
    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#edit__ward__modal").modal("hide");
    showToast("district__create__success__toast");
}

async function deleteDistrict(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    console.log(e.target);
    xhr.open("DELETE", "/management/general/districts_wards/district", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ district_id: e.target.district_id.value }));
    console.log(xhr.responseText);
    $("#delete__district__modal").modal("hide");
    showToast("delete__success__toast");
}

async function deleteWard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    console.log(e.target);
    xhr.open("DELETE", "/management/general/districts_wards/ward", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            district_id: e.target.district_id.value,
            ward_code: e.target.ward_code.value,
        })
    );
    console.log(e.target.district_id.value, e.target.ward_code.value);
    console.log(xhr.responseText);
    $("#delete__ward__modal").modal("hide");
    showToast("delete__success__toast");
}
