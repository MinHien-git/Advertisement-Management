function passToEditModal(btn) {
    document.querySelector("#id__edit").value = btn.dataset.billboardId;
    document.querySelector("#billboard__address__edit").value =
        btn.dataset.billboardAddress;
    let size_data = btn.dataset.billboardSize.split("x");
    document.querySelector("#billboard__height__edit").value =
        size_data[0].split("m")[0];
    document.querySelector("#billboard__width__edit").value =
        size_data[1].split("m")[0];
    document.querySelector("#billboard__amount__edit__input").value =
        btn.dataset.billboardAmount.split(" ")[0];
}

function passToDeleteModal(btn) {
    document.querySelector("#id__delete").value = btn.dataset.billboardId;
}

async function editBillboard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/billboards", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: e.target.id_edit.value,

            type: e.target.billboard_type_selector_edit.options[
                e.target.billboard_type_selector_edit.selectedIndex
            ].text,

            place: e.target.billboard_address_input_edit.value,

            type_advertise:
                e.target.ad_type_selector_edit.options[
                    e.target.ad_type_selector_edit.selectedIndex
                ].text,

            place_type:
                e.target.land_type_selector_edit.options[
                    e.target.land_type_selector_edit.selectedIndex
                ].text,

            size:
                e.target.billboard_height_input_edit.value +
                "mx" +
                e.target.billboard_width_input_edit.value +
                "m",

            amount: e.target.billboard_amount_input_edit.value,
            status: e.target.billboard_status_selector_edit.options[
                e.target.billboard_status_selector_edit.selectedIndex
            ].value,
        })
    );
    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#Modify__modal").modal("hide");
    showToast("save__success__toast");
}

async function deleteBillboard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/management/billboards", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ id: e.target.id_delete.value }));
    console.log(xhr.responseText);
    $("#delete__confirm__modal").modal("hide");
    showToast("delete__success__toast");
}

//toggle textarea
function toggleTextarea(checkbox_id, textarea_id) {
    const textarea_el = document.getElementById(textarea_id);
    const checkbox_el = document.getElementById(checkbox_id);
    console.log(textarea_el);
    console.log(checkbox_el);
    if (checkbox_el.checked) {
        textarea_el.style.display = "flex";
    } else textarea_el.style.display = "none";
}
