function passToModal(btn, mode) {
    const billboard_id = document.querySelector("#billboard__id__" + mode);
    const billboard_address = document.querySelector(
        "#billboard__address__" + mode
    );
    const board_id = document.querySelector("#board__id__" + mode);
    const billboard_type = document.querySelector("#billboard__type__" + mode);
    const board_type = document.querySelector("#board__type__" + mode);
    const board_height = document.querySelector("#board__height__" + mode);
    const board_width = document.querySelector("#board__width__" + mode);
    const ad_type = document.querySelector("#ad__type__" + mode);
    const place_type = document.querySelector("#place__type__" + mode);
    const billboard_status = document.querySelector(
        "#billboard__status__" + mode
    );

    const board_status = document.querySelector("#board__status__" + mode);
    if (billboard_id) {
        billboard_id.value = btn.dataset.billboardId;
    }
    if (billboard_address) {
        billboard_address.value = btn.dataset.billboardAddress;
    }
    if (board_id) {
        board_id.value = btn.dataset.boardId ? btn.dataset.boardId : "";
    }
    if (billboard_type) {
        billboard_type.value = btn.dataset.billboardType
            ? btn.dataset.billboardType
            : "";
    }
    if (board_type) {
        board_type.value = btn.dataset.boardType ? btn.dataset.boardType : "";
    }
    if (board_height) {
        board_height.value = btn.dataset.boardHeight
            ? btn.dataset.boardHeight
            : "";
    }
    if (board_width) {
        board_width.value = btn.dataset.boardWidth
            ? btn.dataset.boardWidth
            : "";
    }
    if (ad_type) {
        ad_type.value = btn.dataset.adType ? btn.dataset.adType : "";
    }
    if (place_type) {
        place_type.value = btn.dataset.placeType ? btn.dataset.placeType : "";
    }
    if (billboard_status) {
        billboard_status.value = btn.dataset.billboardStatus
            ? btn.dataset.billboardStatus.toString()
            : "";
    }
    if (board_status) {
        board_status.value = btn.dataset.boardStatus
            ? btn.dataset.boardStatus.toString()
            : "";
    }
}

async function addBoard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/management/billboards/boards", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(
        JSON.stringify({
            billboard_id: e.target.billboard_id_add_board.value,
            board_type:
                e.target.board_type_selector_add_board.options[
                    e.target.board_type_selector_add_board.selectedIndex
                ].text,
            board_height: e.target.board_height_input_add_board.value,
            board_width: e.target.board_width_input_add_board.value,
        })
    );

    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#add__board__modal").modal("hide");
    showToast("add__board__success__toast");
}

async function editBoard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/billboards/boards", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(
        JSON.stringify({
            billboard_id: e.target.billboard_id_edit_board.value,
            board_id: e.target.board_id_edit_board.value,
            board_type:
                e.target.board_type_selector_edit_board.options[
                    e.target.board_type_selector_edit_board.selectedIndex
                ].text,
            board_height: e.target.board_height_input_edit_board.value,
            board_width: e.target.board_width_input_edit_board.value,
        })
    );

    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#edit__board__modal").modal("hide");
    showToast("save__success__toast");
}

async function deleteBoard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/management/billboards/boards", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(
        JSON.stringify({
            billboard_id: e.target.billboard_id_delete_board.value,
            board_id: e.target.board_id_delete_board.value,
        })
    );

    xhr.onload = () => [console.log(`${xhr.response}`)];
    $("#delete__board__modal").modal("hide");
    showToast("delete__board__toast");
}

async function editBillboard(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/billboards", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: e.target.billboard_id_edit_billboard.value,

            place: e.target.billboard_address_input_edit_billboard.value,

            type_advertise:
                e.target.ad_type_selector_edit_billboard.options[
                    e.target.ad_type_selector_edit_billboard.selectedIndex
                ].text,

            place_type:
                e.target.place_type_selector_edit_billboard.options[
                    e.target.place_type_selector_edit_billboard.selectedIndex
                ].text,

            status: e.target.billboard_status_selector_edit_billboard.options[
                e.target.billboard_status_selector_edit_billboard.selectedIndex
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
    if (checkbox_el.checked) {
        textarea_el.style.display = "flex";
    } else textarea_el.style.display = "none";
}
