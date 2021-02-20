let btn = document.querySelector("#addBtn");
let input = document.querySelector("input");
let mainRow = document.querySelector("#mainRow");

btn.addEventListener("click", () => {
    let inputVal = input.value;
    
    let xml = new XMLHttpRequest();
    xml.open("post", "/save");
    
    xml.onreadystatechange = function() {
        if(xml.readyState == 4 && xml.status == 200) {
            displayTodos();
        }
    }
    xml.setRequestHeader("Content-Type", "application/json");
    xml.send(JSON.stringify({message: inputVal}));
});

function displayTodos() {
    let data = new Promise((resolve, reject) => {
        let xml = new XMLHttpRequest();
        xml.open("get", "/get_data");
        
        xml.onreadystatechange = function() {
            if(xml.readyState == 4 && xml.status == 200) {
                resolve(JSON.parse(xml.responseText));
            }
        }

        xml.send();
    });
    data.then((data) => {
        let text = ``;
        for(let i = 0; i < data.length; i++) {
            text += `
            <div class="col-4">
                <div class="card">
                    <div class="card-header">
                        <button class="btn btn-sm btn-secondary float-left">Todo:${i+1}</button>
                        <button class="btn btn-sm btn-success float-right">${data[i].date}</button>
                    </div>
                    <div class="card-body text-center">
                        <p>${data[i].msg}</p>
                    </div>
                    <div class="card-footer text-center">
                        <button data-id="${data[i]._id}" class="delete-btn btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>
            </div>
            `;
        }
        mainRow.innerHTML = text;

        let allDeleteBtns = document.querySelectorAll(".delete-btn");
        for(let i = 0; i < allDeleteBtns.length; i++) {
            allDeleteBtns[i].addEventListener("click", () => {
                deleteTodo(allDeleteBtns[i]);
            });
        }
    });
}

const deleteTodo = (button) => {
    console.log(button.getAttribute("data-id"));
    let xml = new XMLHttpRequest();
    xml.open("post", "/delete");

    xml.onreadystatechange = function () {
        if(xml.readyState == 4 && xml.status == 200) {
            displayTodos();
        }
    }
    xml.setRequestHeader("Content-Type", "application/json");
    xml.send(JSON.stringify({id: button.getAttribute("data-id")}));
}

window.addEventListener("load", () => {
    displayTodos();
})