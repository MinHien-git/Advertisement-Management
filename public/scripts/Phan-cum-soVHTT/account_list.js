//chỉnh sửa thông tin tài khoản
async function editAccount(e) {
    e.preventDefault();
    let user_type = 1;
    let district,
        ward = "";
    const type_value = e.target.type_user_edit.value;
    if (type_value == 1) {
        user_type = 2;
    }

    if (type_value >= 2) {
        district =
            e.target.district_edit.options[e.target.district_edit.selectedIndex]
                .text;

        if (type_value == 3) {
            ward =
                e.target.ward_edit.options[e.target.ward_edit.selectedIndex]
                    .text;
        }
    }

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/accounts", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: e.target.id_edit.value,
            name: e.target.name_edit.value,
            email: e.target.email_edit.value,
            phone: e.target.phone_edit.value,
            birth: e.target.birth_edit.value,
            type_user: user_type,
            district: district,
            ward: ward,
        })
    );

    console.log(xhr.responseText);

    $("#Modify__modal").modal("hide");
    showToast("save__success__toast");
}

//tạo tài khoản
async function createAccount(e) {
    e.preventDefault();
    let user_type = 1;
    let district,
        ward = null;
    const type_value = e.target.type_user_create.value;
    if (type_value == 1) {
        user_type = 2;
    }

    if (type_value >= 2) {
        district =
            e.target.district_create.options[
                e.target.district_create.selectedIndex
            ].text;

        if (type_value == 3) {
            ward =
                e.target.ward_create.options[e.target.ward_create.selectedIndex]
                    .text;
        }
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/management/accounts", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            name: e.target.name_create.value,
            email: e.target.email_create.value,
            phone: e.target.phone_create.value,
            birth: e.target.birth_create.value,
            type_user: user_type,
            district: district,
            ward: ward,
        })
    );

    console.log(xhr.responseText);

    $("#Create__modal").modal("hide");
    showToast("create__success__toast");
}

//xoá tài khoản
async function deleteAccount(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/management/accounts", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ id: e.target.id_delete.value }));
    console.log(xhr.responseText);
    $("#delete__confirm__modal").modal("hide");
    showToast("delete__success__toast");
}

//truyền dữ liệu vào modal
function passToEditModal(btn) {
    const level_text = btn.dataset.accountLevel;
    const district = btn.dataset.accountDistrict;
    const ward = btn.dataset.accountWard;

    let level_value = 0;

    if (level_text === "Sở") {
        level_value = 1;
    } else if (level_text === "Quận/Huyện") {
        level_value = 2;
    } else if (level_text === "Phường/Xã") {
        level_value = 3;
    }

    const district_list = document.getElementById(
        "district__selector__edit"
    ).options;

    const ward_list = document.getElementById("ward__selector__edit").options;
    let district_value,
        ward_value = 0;

    if (level_value == 1) {
        district_value = null;
        ward_value = null;
        district_list.selectedIndex = -1;
        ward_list.selectedIndex = -1;
    } else if (level_value >= 2) {
        for (let i = 1; i < district_list.length; i++) {
            if (district === district_list[i].text) {
                district_value = i - 1;
                district_list.selectedIndex = i - 1;
                break;
            }
        }
        if (level_value == 3) {
            document.querySelector("#district__selector__edit").value =
                district_value;
            changeWardOptionsEdit(
                document.querySelector("#district__selector__edit")
            );
            for (let j = 0; j < ward_list.length; j++) {
                if (ward === ward_list[j].innerHTML) {
                    ward_value = j - 1;
                    break;
                }
            }
        }
    }

    document.querySelector("#id__edit").value = btn.dataset.accountId;
    document.querySelector("#name__edit").value = btn.dataset.accountName;
    document.querySelector("#email__edit").value = btn.dataset.accountEmail;
    document.querySelector("#phone__edit").value = btn.dataset.accountPhone;
    document.querySelector("#birth__edit").value = btn.dataset.accountBirth;
    document.querySelector("#level__selector__edit").value = level_value;
    document.querySelector("#district__selector__edit").value = district_value;

    changeLevelSelectorsEdit(document.querySelector("#level__selector__edit"));
    changeWardOptionsEdit(document.querySelector("#district__selector__edit"));

    document.querySelector("#ward__selector__edit").value = ward_value;
}

function passToDeleteModal(btn) {
    document.querySelector("#id__delete").value = btn.dataset.accountId;
}

//thay đổi lựa chọn phường quận dựa theo cấp trực thuộc
function changeLevelSelectorsEdit(lvl_selector) {
    const val = lvl_selector.value;

    const district_label = document.getElementById(
        "district__selector__edit__label"
    );
    const district_selector = document.getElementById(
        "district__selector__edit"
    );
    const ward_label = document.getElementById("ward__selector__edit__label");
    const ward_selector = document.getElementById("ward__selector__edit");
    if (val == 1) {
        district_label.setAttribute("hidden", "");

        district_selector.setAttribute("hidden", "");
        district_selector.setAttribute("disabled", "");

        ward_label.setAttribute("hidden", "");

        ward_selector.setAttribute("hidden", "");
        ward_selector.setAttribute("disabled", "");
    } else if (val == 2) {
        district_label.removeAttribute("hidden");

        district_selector.removeAttribute("hidden");
        district_selector.removeAttribute("disabled");

        ward_label.setAttribute("hidden", "");

        ward_selector.setAttribute("hidden", "");
        ward_selector.setAttribute("disabled", "");
    } else if (val == 3) {
        district_label.removeAttribute("hidden", "");

        district_selector.removeAttribute("hidden", "");
        district_selector.removeAttribute("disabled", "");

        ward_label.removeAttribute("hidden", "");

        ward_selector.removeAttribute("hidden", "");
        ward_selector.removeAttribute("disabled", "");
    }
}

function changeLevelSelectorsCreate(lvl_selector) {
    const val = lvl_selector.value;

    const district_label = document.getElementById(
        "district__selector__create__label"
    );
    const district_selector = document.getElementById(
        "district__selector__create"
    );
    const ward_label = document.getElementById("ward__selector__create__label");
    const ward_selector = document.getElementById("ward__selector__create");
    if (val == 1) {
        district_label.setAttribute("hidden", "");

        district_selector.setAttribute("hidden", "");
        district_selector.setAttribute("disabled", "");

        ward_label.setAttribute("hidden", "");

        ward_selector.setAttribute("hidden", "");
        ward_selector.setAttribute("disabled", "");
    } else if (val == 2) {
        district_label.removeAttribute("hidden");

        district_selector.removeAttribute("hidden");
        district_selector.removeAttribute("disabled");

        ward_label.setAttribute("hidden", "");

        ward_selector.setAttribute("hidden", "");
        ward_selector.setAttribute("disabled", "");
    } else if (val == 3) {
        district_label.removeAttribute("hidden", "");

        district_selector.removeAttribute("hidden", "");
        district_selector.removeAttribute("disabled", "");

        ward_label.removeAttribute("hidden", "");

        ward_selector.removeAttribute("hidden", "");
        ward_selector.removeAttribute("disabled", "");
    }
}
