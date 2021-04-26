const input = document.getElementById('add-class-input');
const addClassBtn = document.getElementById('add-class-btn');

addClassBtn.onclick = () => addClass();

function addClass() {
    const className = input.value;
    const classId = classNames.length;
    const div = document.getElementById("add-btns");

    const ele = `<div class="add-div">
    <button id="class-${classId}">Add ${className}</button>
    <input id="input-${classId}" type="text" placeholder="Class ${classId}" value="${className}">
  </div>`;

    div.innerHTML += ele;

    input.setAttribute('value', '');

}