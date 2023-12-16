function passToConfirmModal(btn) {
    console.log(btn);
    const confirm_inputs = document.querySelectorAll("#id__confirm");
    confirm_inputs.forEach((confirm_input) => {
        confirm_input.value = btn.dataset.billboardId;
    });
}

async function approveLicense(billboard_id) {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/licenses", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: billboard_id,
            state: 0,
        })
    );
    console.log(xhr.responseText);
    showToast("accept__success__toast");
}

async function declineLicense(billboard_id) {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/management/licenses/decline", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: billboard_id,
            state: 2,
        })
    );
    console.log(xhr.responseText);
    showToast("decline__success__toast");
}

async function sendLicenseChangeRequest(billboard_id, details) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/management/licenses", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        JSON.stringify({
            id: billboard_id,
            details: details,
        })
    );
    console.log(xhr.responseText);
    showToast("send__success__toast");
}
