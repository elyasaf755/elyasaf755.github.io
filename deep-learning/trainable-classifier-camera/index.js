const classifier = knnClassifier.create();

const webcamElement = document.getElementById('webcam');

let constraints = {
    facingMode: "user",
    resizeWidth: 224,
    resizeHeight: 224
};

if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    constraints = {
        facingMode: "environment",
        resizeWidth: 224,
        resizeHeight: 224
    };

    alert("supports");
}

const classNames = ['A', 'B'];

let net;

let addExample;

async function app() {
    console.log('Loading mobilenet..');

    // Load the model.
    net = await mobilenet.load();
    console.log('Successfully loaded model');

    // Create an object from Tensorflow.js data API which could capture image 
    // from the web camera as Tensor.
    const webcam = await tf.data.webcam(webcamElement);

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

    while (true) {
        if (classifier.getNumClasses() > 0) {
            const img = await webcam.capture();

            // Get the activation from mobilenet from the webcam.
            const activation = net.infer(img, 'conv_preds');
            // Get the most likely class and confidence from the classifier module.
            const result = await classifier.predictClass(activation);

            document.getElementById('console').innerText = `
                prediction: ${classNames[result.label]}\n
                probability: ${result.confidences[result.label]}
            `;

            // Dispose the tensor to release the memory.
            img.dispose();
        }

        await tf.nextFrame();
    }
}

app();