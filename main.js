let download = document.getElementById('download')

let videoElement = document.getElementById('videoElement')

download.onclick = async () => {
    let mStream = await navigator.getDisplayMedia({ 'video': true })

    videoElement.srcObject = mStream

    let opts = { mimeType: 'video/webm; codecs=vp9' };
    let rec = new MediaRecorder(videoElement.srcObject, opts);
    let blobs = [];

    rec.ondataavailable = (e) => (e.data && e.data.size > 0) ? blobs.push(e.data) : null;
    rec.onstop = () => {
        //  get the image blob
        let finalBlob = new Blob(blobs, { type: 'video/mp4' });

        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://api.cloudinary.com/v1_1/og_tech/image/upload', true);
        xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

        xhr.onreadystatechange = function () {//Call a function when the state changes.
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                console.log(this.status);
            }
        }

        let formData = new FormData();
        formData.append('upload_preset', 'cloudy_shot');
        formData.append('file', finalBlob);
        xhr.send(formData);
    }

    rec.start(100);
    setTimeout(() => rec.stop(), 2000)
};
