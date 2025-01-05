var errorMessageDiv = document.createElement("div");
errorMessageDiv.style.color = "red";
errorMessageDiv.style.position = "fixed";
errorMessageDiv.style.top = "10px";
errorMessageDiv.style.width = "100%";
errorMessageDiv.style.textAlign = "center";
errorMessageDiv.style.display = "none";
document.body.appendChild(errorMessageDiv);
function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = "block";
}
function clearError() {
    errorMessageDiv.style.display = "none";
}
var groupnamefield = document.createElement("input");
var logintext = document.createElement("h1");
var centeralign = document.createElement("div");
var namefield = document.createElement("input");
var grouppasswdfield = document.createElement("input");
var donebutton = document.createElement("input");
var signupbutton = document.createElement("button");
setTimeout(function () {
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
    var logoutbutton = document.createElement("button");
    logoutbutton.textContent = "Logout";
    logoutbutton.type = "button";
    centeralign.appendChild(logoutbutton);
    document.body.appendChild(centeralign);
    signupbutton.addEventListener("click", function () {
        var errorDiv = errorMessageDiv; // Save reference to error div
        document.body.innerHTML = "";
        document.body.appendChild(errorDiv); // Add error div back
        var signupTitle = document.createElement("h1");
        signupTitle.innerText = "Sign Up for a New Group";
        signupTitle.style.color = "#000000";
        signupTitle.style.fontSize = "20px";
        signupTitle.style.fontFamily = "Arial";
        var personalnamefield = document.createElement("input");
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
        var signupGroupnamefield = document.createElement("input");
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
        var signupPasswordField = document.createElement("input");
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
        var signupDoneButton = document.createElement("input");
        signupDoneButton.type = "button";
        signupDoneButton.value = "Sign Up";
        var signupDiv = document.createElement("div");
        centerAndSpaceDiv(signupDiv);
        signupDiv.appendChild(signupTitle);
        signupDiv.appendChild(personalnamefield);
        signupDiv.appendChild(signupGroupnamefield);
        signupDiv.appendChild(signupPasswordField);
        signupDiv.appendChild(signupDoneButton);
        document.body.appendChild(signupDiv);
        signupDoneButton.addEventListener("click", function () {
            var groupName = signupGroupnamefield.value;
            var groupPassword = signupPasswordField.value;
            console.log("Raw Personal Names: ".concat(personalnamefield.value));
            var personalNames = personalnamefield.value
                .split(",")
                .map(function (name) { return name.trim(); })
                .filter(function (name) { return name.length > 0; });
            console.log("Array: ".concat(personalNames));
            var message = {
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
                body: JSON.stringify({ message: message })
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                console.log('Data received:', data);
                if (data.Error) {
                    showError(data.Error);
                }
                else if (data.GroupAlreadyExists) {
                    showError("Group \"".concat(data.GroupAlreadyExists, "\" already exists"));
                }
                else if (data.GroupMade) {
                    clearError();
                    alert('Group created successfully!');
                    window.location.reload();
                }
            })
                .catch(function (error) {
                console.error('Error:', error);
                showError(error.message);
            });
        });
    });
    donebutton.addEventListener("click", function () {
        var groupName = groupnamefield.value;
        var groupPassword = grouppasswdfield.value;
        var name = namefield.value;
        var message = {
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
            body: JSON.stringify({ message: message })
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            console.log('Data received:', data);
            if (data.Error) {
                showError(data.Error);
            }
            else if (data.InvalidCredentials) {
                showError('Invalid credentials');
            }
            else if (data.LoginSuccessful) {
                clearError();
                // Store the token with group name
                localStorage.setItem("groupToken_".concat(data.LoginSuccessful), data.token);
                window.location.href = "/groups/".concat(data.LoginSuccessful);
            }
        })
            .catch(function (error) {
            console.error('Error:', error);
            showError(error.message);
        });
    });
    logoutbutton.addEventListener("click", function () {
        var token = localStorage.getItem('token');
        if (token) {
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Authorization': token
                }
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                console.log("Data received: ".concat(data));
                if (data.message === 'Logged out successfully') {
                    localStorage.removeItem('token');
                    alert('Logged out successfully');
                }
            })
                .catch(function (error) {
                console.error("Error: ".concat(error));
            });
        }
        else {
            alert('No token found');
        }
    });
    [groupnamefield, grouppasswdfield, namefield].forEach(function (field) {
        field.addEventListener('input', clearError);
    });
}, 500);
function centerAndSpaceDiv(element) {
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
