let filesList = [];

async function train() {
  for (let i = 0; i < classNames.length; ++i) {
    addExamples(i);
  }
}

function addClass() {
  const className = document.getElementById('add-class-name').value;
  const classNumber = classNames.length;

  // Add drag & drop zone
  let div = document.getElementById('classes');
  let e = `<div id="div-class-${classNumber}" class="drag-area">
  <div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
  <header>Drag & Drop to Upload Images</header>
  <span>OR</span>
  <button id="browse-btn-${classNumber}">Browse File</button>
  <input id="files-uploader-${classNumber}" accept="image/*" multiple type="file" hidden>
  <br>
  <input id="label-${classNumber}" type="text" placeholder="Class ${className}" value="${className}">
</div>`;

  div.innerHTML += e;

  classNames.push(className);
  filesList.push([]);

  for (var i = 0; i < classNames.length; i++) {
    addListeners(i);
  }
}

function addListeners(classNumber) {
  const dropArea = document.querySelector(`#div-class-${classNumber}`),
    dragText = dropArea.querySelector("header"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input"),
    inputTxt = dropArea.querySelector(`#label-${classNumber}`);

  inputTxt.addEventListener("input", () => {
    classNames[classNumber] = inputTxt.value;
    inputTxt.placeholder = `Class ${inputTxt.value}`;
    inputTxt.setAttribute('value', inputTxt.value);
  });

  button.onclick = () => {
    input.click();
  };

  input.addEventListener("change", function () {
    dropArea.classList.add("active");
  });

  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();

    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload Images";
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();

    const files = e.dataTransfer.files;

    filesList[classNumber] = files;
  });
}

function copyImgToCanvas(sourceImgEle, targetCanvasEle) {
  const ctx = targetCanvasEle.getContext('2d');
  const oc = document.createElement('canvas'),
    octx = oc.getContext('2d');
  const width = sourceImgEle.width;

  targetCanvasEle.width = width;
  targetCanvasEle.height = targetCanvasEle.width * sourceImgEle.height / sourceImgEle.width;

  var cur = {
    width: Math.floor(sourceImgEle.width * 0.5),
    height: Math.floor(sourceImgEle.height * 0.5)
  }

  oc.width = cur.width;
  oc.height = cur.height;

  octx.drawImage(sourceImgEle, 0, 0, cur.width, cur.height);

  while (cur.width * 0.5 > width) {
    cur = {
      width: Math.floor(cur.width * 0.5),
      height: Math.floor(cur.height * 0.5)
    };
    octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
  }

  ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, targetCanvasEle.width, targetCanvasEle.height);
}

function addPredictionDragDropListeners() {
  const dropArea = document.querySelector(`#div-to-predict`),
    dragText = dropArea.querySelector("header"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input");

  function change(file) {

    // if no image has been seleted
    if (file == null) {
      return;
    }

    const imgEle = document.getElementById("img");
    const canvasEle = document.getElementById("gallery-canvas");

    imgEle.onload = () => {
      predict();
      copyImgToCanvas(imgEle, canvasEle);
    };

    imgEle.src = URL.createObjectURL(file);
  }

  button.onclick = () => {
    input.click();
  };

  input.addEventListener("change", function () {
    dropArea.classList.add("active");

    const file = this.files[0];

    change(file);
  });

  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Predict";
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    change(file);
  });
}

async function loadImage(file) {
  const canvasEle = document.getElementById('canvas');
  const url = URL.createObjectURL(file);

  let im = await new Promise(r => {
      let i = new Image();
      i.height = 224;
      i.width = 224;
      i.onload = (() => r(i));
      i.src = url;
  });

  copyImgToCanvas(im, canvasEle);

  return canvasEle;
}

function init() {
  addListeners(0);
  addListeners(1);

  filesList.push([]);
  filesList.push([]);

  addPredictionDragDropListeners();
}

init();
