const classifier = knnClassifier.create();

const webcamElement = document.getElementById('webcam');

const modes = ['user', 'environment'];

let facingMode = "user";
let facingModeIndex = 0;
let run = true;

if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    facingMode = "environment";
    facingModeIndex = 1;
}

const classNames = ['A', 'B'];

let net;
let addExample;
let webcam;

async function loadWebcam(){
    // define webcam settings
    const webcamConfig = {
        facingMode: facingMode,
        resizeWidth: 224,
        resizeHeight: 224
    };

    // Create an object from Tensorflow.js data API which could capture image 
    // from the web camera as Tensor.
    webcam = await tf.data.webcam(webcamElement, webcamConfig);
}

async function app() {
    console.log('Loading mobilenet..');

    // Load the model.
    net = await mobilenet.load();
    console.log('Successfully loaded model');

    // loads the webcam
    await loadWebcam();

    // Reads an image from the webcam and associates it with a specific class
    // index.
    addExample = async classId => {
        // Capture an image from the web camera.
        const img = await webcam.capture();

        // Get the intermediate activation of MobileNet 'conv_preds' and pass that
        // to the KNN classifier.
        const activation = net.infer(img, true);

        // Pass the intermediate activation to the classifier.
        classifier.addExample(activation, classId);

        // Dispose the tensor to release the memory.
        img.dispose();
    };

    while (run) {
        if (classifier.getNumClasses() > 0) {
            const img = await webcam.capture();

            // Get the activation from mobilenet from the webcam.
            const activation = net.infer(img, 'conv_preds');
            // Get the most likely class and confidence from the classifier module.
            const result = await classifier.predictClass(activation);

            document.getElementById('console').innerText = `
                I see ${classNames[result.label]}\n
                probability: ${result.confidences[result.label]}
            `;

            // Dispose the tensor to release the memory.
            img.dispose();
        }

        await tf.nextFrame();
    }
}

app();