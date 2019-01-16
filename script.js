renderVideo = (file) => {
    document.querySelector('.video-input').hidden = true;
    document.getElementById('loadingText').hidden = false;
    var reader = new FileReader();
    reader.onload = (event) => {
        const main = document.querySelector('main');

        let videoEl = document.createElement('video');
        videoEl.id = 'videoElement';
        videoEl.setAttribute('controls', true);
        videoEl.width = 600;
        videoEl.height = 400;
        videoEl.src = event.target.result; // video url
        main.appendChild(videoEl);

        let button = document.createElement('button');
        button.id = 'togglePipButton';
        button.innerHTML = 'Toggle Picture-in-Picture Mode!';
        main.appendChild(button);
        document.getElementById('loadingText').hidden = true;
        runPIPScripts();
    }

    reader.onerror = (error) => {
        console.log(error);
    }

    reader.readAsDataURL(file); // when the file is read it triggers the onload event

}
document.getElementById('inputFile').addEventListener('change', event => renderVideo(event.target.files[0]));

function runPIPScripts() {
    let pipWindow;
    let video = document.getElementById('videoElement');
    let togglePipButton = document.getElementById('togglePipButton');
    
    togglePipButton.addEventListener('click', async function (event) {
        togglePipButton.disabled = true;
        try {
            if (video !== document.pictureInPictureElement)
                await video.requestPictureInPicture();
            else
                await document.exitPictureInPicture();
    
        } catch (error) {
            console.log(error);
        } finally {
            togglePipButton.disabled = false;
        }
    });
    
    video.addEventListener('enterpictureinpicture', function (event) {
        console.log('Entered PiP');
        pipWindow = event.pictureInPictureWindow;
        console.log(`Window size -  \n Width: ${pipWindow.width} \n Height: ${pipWindow.height}`);
    });
    
    video.addEventListener('leavepictureinpicture', function (event) {
        console.log('Left PiP');
        togglePipButton.disabled = false;
    });
    
    
    if ('pictureInPictureEnabled' in document) {
        showPipButton();
        video.addEventListener('loadedmetadata', showPipButton);
        video.addEventListener('emptied', showPipButton);
    } else {
        togglePipButton.hidden = true;
    }
    
    function showPipButton() {
        togglePipButton.disabled = (video.readyState === 0) || !document.pictureInPictureEnabled ||video.disablePictureInPicture;
    }
}