var model = undefined;

async function init() {
    // Load the trained model
    model = await tf.loadLayersModel('trained_model/model.json');
}

async function predict() {

    const predictedClass = tf.tidy(() => {
      
        const imageElement = document.getElementById('img');
        
        const img = tf.image.resizeBilinear(tf.browser.fromPixels(imageElement), [150, 150]).toFloat().expandDims();
    
        const predictions = model.predict(img); // predict
    
        return predictions;
      });

    const classId = (await predictedClass.data())[0];

    switch (classId) {
        case 0:
            document.getElementById('prediction').innerHTML = 'Cat';
            break;
        case 1:
            document.getElementById('prediction').innerHTML = 'Dog';
        default:
            break;
    }
}

async function changeImage() {
    let img = document.getElementById('img');

    let uploadedImage = document.getElementById('file-uploader').files[0];

    img.src = URL.createObjectURL(uploadedImage);
}



init();