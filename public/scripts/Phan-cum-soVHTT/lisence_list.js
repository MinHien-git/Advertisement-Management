function passToConfirmModal(btn) {
    const confirm_inputs = document.querySelectorAll("#id__confirm");
    confirm_inputs.forEach((confirm_input) => {
        confirm_input.value = btn.dataset.licenseId;
    });
}

async function approveLicense(license_id) {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/licenses", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: license_id,
            state: 1,
        })
    );
    console.log(xhr.responseText);
    showToast("accept__success__toast");
}

async function declineLicense(license_id) {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/licenses/decline", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: license_id,
            state: 2,
        })
    );
    console.log(xhr.responseText);
    showToast("decline__success__toast");
}

async function sendLicenseChangeRequest(license_id, edit_request) {
    console.log(license_id);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/management/licenses", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: license_id,
            state: 3,
            edit_request: edit_request,
        })
    );
    console.log(xhr.responseText);
    showToast("send__success__toast");
}
