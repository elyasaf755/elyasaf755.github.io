const classifier = knnClassifier.create();
let net;

var classNames = ['A', 'B']
let loaded = false;

const addExamples = async classId => {
    const files = filesList[classId];
    for (let i = 0; i < files.length; ++i) {
        addExample(classId, files[i]);
    }
}

const addExample = async (classId, file) => {

    // loads the image into a canvas
    const canvasEle = await loadImage(file);

    // img should be a tensor of shape [224, 224, 3]
    const img = tf.browser.fromPixels(canvasEle);

    // Get the intermediate activation of MobileNet 'conv_preds'
    const activation = net.infer(img, true);

    // Pass the intermediate activation to the KNN classifier.
    classifier.addExample(activation, classId);

    // Dispose the tensor to release the memory.
    img.dispose();
};

async function predict() {
    if (classifier.getNumClasses() > 0) {
        const img = tf.browser.fromPixels(document.getElementById("img"));

        // Get the activation of mobilenet from our image.
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
}

async function app() {
    console.log('Loading mobilenet..');

    // Load the model.
    net = await mobilenet.load();
    
    document.getElementById('status').innerText = 'Successfully loaded model,\nYou can now upload images for training.';
    console.log('Successfully loaded model');
}

app();