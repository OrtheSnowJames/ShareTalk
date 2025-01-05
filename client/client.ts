let groupnamefield = document.createElement("input");
let logintext = document.createElement("h1");
let centeralign = document.createElement("div");
let namefield = document.createElement("input");
let grouppasswdfield = document.createElement("input");
let donebutton = document.createElement("input");
let signupbutton = document.createElement("button");

setTimeout(() => {
    console.log("elo");

    centerAndSpaceDiv(centeralign);
    centeralign.style.color = "#808080";
    centeralign.style.fontSize = "12px";
    centeralign.style.height = "auto";
    centeralign.style.width = "35%";
    centeralign.style.flexDirection = "column";

    logintext.innerText = "Login to a group or sign up one";
    logintext.style.color = "#000000";
    logintext.style.fontSize = "20px";
    logintext.style.fontFamily = "Arial";
    centeralign.appendChild(logintext);

    groupnamefield.type = "text";
    groupnamefield.required = true;
    groupnamefield.style.color = "#000000";
    groupnamefield.style.fontSize = "12px";
    groupnamefield.style.fontFamily = "Arial";
    groupnamefield.style.width = "100%";
    groupnamefield.style.marginBottom = "10px";
    groupnamefield.style.backgroundColor = "#f0f0f0";
    groupnamefield.style.height = "40px";
    groupnamefield.placeholder = "Enter group name";
    centeralign.appendChild(groupnamefield);

    grouppasswdfield.type = "password";
    grouppasswdfield.required = true;
    grouppasswdfield.style.color = "#000000";
    grouppasswdfield.style.fontSize = "12px";
    grouppasswdfield.style.fontFamily = "Arial";
    grouppasswdfield.style.width = "100%";
    grouppasswdfield.style.marginBottom = "10px";
    grouppasswdfield.style.backgroundColor = "#f0f0f0";
    grouppasswdfield.style.height = "40px";
    grouppasswdfield.placeholder = "Password";
    centeralign.appendChild(grouppasswdfield);

    namefield.type = "text";
    namefield.required = true;
    namefield.style.color = "#000000";
    namefield.style.fontSize = "12px";
    namefield.style.fontFamily = "Arial";
    namefield.style.width = "100%";
    namefield.style.marginBottom = "10px";
    namefield.style.backgroundColor = "#f0f0f0";
    namefield.style.height = "40px";
    namefield.placeholder = "Enter your name";
    centeralign.appendChild(namefield);

    donebutton.type = "button";
    donebutton.value = "Login";
    donebutton.style.marginBottom = "10px";
    centeralign.appendChild(donebutton);

    signupbutton.textContent = "Sign Up";
    signupbutton.type = "button";
    centeralign.appendChild(signupbutton);

    document.body.appendChild(centeralign);

    signupbutton.addEventListener("click", function () {
        document.body.innerHTML = "";

        let signupTitle = document.createElement("h1");
        signupTitle.innerText = "Sign Up for a New Group";
        signupTitle.style.color = "#000000";
        signupTitle.style.fontSize = "20px";
        signupTitle.style.fontFamily = "Arial";

        let personalnamefield = document.createElement("input");
        personalnamefield.type = "text";
        personalnamefield.required = true;
        personalnamefield.style.color = "#000000";
        personalnamefield.style.fontSize = "12px";
        personalnamefield.style.fontFamily = "Arial";
        personalnamefield.style.width = "100%";
        personalnamefield.style.marginBottom = "10px";
        personalnamefield.style.backgroundColor = "#f0f0f0";
        personalnamefield.style.height = "40px";
        personalnamefield.placeholder = "Enter names separated by commas";

        let signupGroupnamefield = document.createElement("input");
        signupGroupnamefield.type = "text";
        signupGroupnamefield.required = true;
        signupGroupnamefield.style.color = "#000000";
        signupGroupnamefield.style.fontSize = "12px";
        signupGroupnamefield.style.fontFamily = "Arial";
        signupGroupnamefield.style.width = "100%";
        signupGroupnamefield.style.marginBottom = "10px";
        signupGroupnamefield.style.backgroundColor = "#f0f0f0";
        signupGroupnamefield.style.height = "40px";
        signupGroupnamefield.placeholder = "Enter new group name";

        let signupPasswordField = document.createElement("input");
        signupPasswordField.type = "password";
        signupPasswordField.required = true;
        signupPasswordField.style.color = "#000000";
        signupPasswordField.style.fontSize = "12px";
        signupPasswordField.style.fontFamily = "Arial";
        signupPasswordField.style.width = "100%";
        signupPasswordField.style.marginBottom = "10px";
        signupPasswordField.style.backgroundColor = "#f0f0f0";
        signupPasswordField.style.height = "40px";
        signupPasswordField.placeholder = "Enter group password";

        let signupDoneButton = document.createElement("input");
        signupDoneButton.type = "button";
        signupDoneButton.value = "Sign Up";

        let signupDiv = document.createElement("div");
        centerAndSpaceDiv(signupDiv);
        signupDiv.appendChild(signupTitle);
        signupDiv.appendChild(personalnamefield);
        signupDiv.appendChild(signupGroupnamefield);
        signupDiv.appendChild(signupPasswordField);
        signupDiv.appendChild(signupDoneButton);

        document.body.appendChild(signupDiv);

        signupDoneButton.addEventListener("click", function () {
            const groupName = signupGroupnamefield.value;
            const groupPassword = signupPasswordField.value;
            console.log(`Raw Personal Names: ${personalnamefield.value}`);
            const personalNames = personalnamefield.value
                .split(",")
                .map(name => name.trim())
                .filter(name => name.length > 0);
            console.log(`Array: ${personalNames}`)
            const message = {
                SignupRequest: {
                    GroupName: groupName,
                    GroupPassword: groupPassword,
                    Names: personalNames
                }
            };

            fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(`Data received: ${data}`);
                })
                .catch(error => {
                    console.error(`Error: ${error}`);
                });
        });
    });

    donebutton.addEventListener("click", function () {
        const groupName = groupnamefield.value;
        const groupPassword = grouppasswdfield.value;
        const name = namefield.value;

        const message = {
            LoginRequest: {
                GroupName: groupName,
                GroupPassword: groupPassword,
                Name: name
            }
        };

        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
            .then(response => response.json())
            .then(data => {
                console.log(`Data received: ${data}`);
            })
            .catch(error => {
                console.error(`Error: ${error}`);
            });
    });
}, 500);

function centerAndSpaceDiv(element: HTMLDivElement) {
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";

    element.style.display = "flex";
    element.style.justifyContent = "space-evenly";
    element.style.alignItems = "center";
    element.style.flexDirection = "column";
    element.style.width = "80%";
}
