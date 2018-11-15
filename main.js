let recorder = document.getElementById('recorder')

let videoElement = document.getElementById('videoElement')

recorder.onclick = async () => {
    let mStream = await navigator.getDisplayMedia({ 'video': true })

    videoElement.srcObject = mStream

    let opts = { mimeType: 'video/webm; codecs=vp9' };
    let rec = new MediaRecorder(videoElement.srcObject, opts);
    let blobs = [];

    rec.ondataavailable = (e) => (e.data && e.data.size > 0) ? blobs.push(e.data) : null;
    rec.onstop = () => {
        //  get the image blob
        let finalBlob = new Blob(blobs, { type: 'video/mp4' });
        // create form data for submission         
        let formData = new FormData();
        formData.append('upload_preset', 'CLOUDINARY_UPLOAD_PRESET');
        formData.append('api_key', "CLOUDINARY_API_KEY");
        formData.append('file', finalBlob);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://api.cloudinary.com/v1_1/CLOUDINARY_CLOUD_NAME/auto/upload');

        xhr.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                console.log(this.status);
                alert("Video uploaded to your cloudinary media library");
            }
        }

        xhr.send(formData);
    }

    rec.start(100);
    setTimeout(() => rec.stop(), 2000)
};
