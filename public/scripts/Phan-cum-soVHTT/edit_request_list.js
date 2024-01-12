function passToConfirmModal(btn, mode) {
    const request_id = document.querySelector("#request__id__" + mode);
    const request_option = document.querySelector("#request__option__" + mode);
    if (request_id) {
        request_id.value = btn.dataset.editRequestId;
        console.log(btn.dataset.editRequestId);
    }
    if (request_option) {
        request_option.value = btn.dataset.editRequestOption;
        console.log(btn.dataset.editRequestOption);
    }
}

async function approveRequest(request_id, select_option) {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/edit_requests", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            request_id: request_id,
            select_option: select_option,
        })
    );
    console.log(xhr.responseText);
    $("#accept__confirm__modal").modal("hide");
    showToast("accept__success__toast");
}

async function declineRequest(request_id, select_option) {
    let xhr = new XMLHttpRequest();
    console.log(request_id, select_option);
    xhr.open("PUT", "/management/edit_requests/decline", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            request_id: request_id,
            select_option: select_option,
        })
    );
    console.log(xhr.responseText);
    $("#decline__confirm__modal").modal("hide");
    showToast("decline__success__toast");
}
