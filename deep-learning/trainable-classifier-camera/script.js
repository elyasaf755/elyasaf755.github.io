const input = document.getElementById('add-class-input');
const addClassBtn = document.getElementById('add-class-btn');
const switchBtn = document.getElementById('changeCameraBtn');

addClassBtn.onclick = () => addClass();
switchBtn.onclick = () => {
    run = false;
    facingModeIndex = 1 - facingModeIndex;
    facingMode = modes[facingModeIndex];
    run = true;
    app();
}

function addClass() {
    const className = input.value;
    const classId = classNames.length;
    const div = document.getElementById("add-btns");

    const ele = `<div class="add-div">
    <button id="class-${classId}">Add ${className}</button>
    <input id="input-${classId}" class="input-class" type="text" placeholder="Class ${classId}" value="${className}">
  </div>`;

    div.innerHTML += ele;

    input.value = '';
    input.setAttribute('value', '');

    if (className == '') {
        classNames.push(classId);
    }
    else {
        classNames.push(className);
    }

    for (let i = 0; i < classNames.length; ++i) {
        addListeners(i);
    }
}

function addListeners(classId) {
    const inputTxt = document.getElementById(`input-${classId}`);
    const button = document.getElementById(`class-${classId}`);

    inputTxt.addEventListener("input", () => {
        classNames[classId] = inputTxt.value;
        inputTxt.placeholder = `Class ${inputTxt.value}`;
        inputTxt.setAttribute('value', inputTxt.value);
        button.innerText = `Add ${inputTxt.value}`;
    });

    button.addEventListener('click', () => addExample(classId));
}

addListeners(0);
addListeners(1);