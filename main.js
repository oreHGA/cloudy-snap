let download = document.getElementById('download')

let videoElement = document.getElementById('videoElement')

download.onclick = async () => {
    if (navigator.mediaDevices.getUserMedia !== undefined) {
        let mStream = await navigator.getDisplayMedia({'video': true})

        videoElement.srcObject = mStream

        let opts = { mimeType: 'video/webm; codecs=vp9' };
        let rec = new MediaRecorder(videoElement.srcObject, opts);
        let blobs = [];

        function downloader(blob) {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'test.webm';
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);
        }

        rec.ondataavailable = (e) => (e.data && e.data.size > 0) ? blobs.push(e.data) : null;
        rec.onstop = () => downloader(new Blob(blobs, { type: 'video/webm' }));

        rec.start(100);
        setTimeout(() => rec.stop(), 10000)
    }
};  