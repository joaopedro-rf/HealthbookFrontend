async function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const passwordConfirmInput = document.getElementById('passwordConfirmInput');
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    const passwordMatch = document.getElementById('passwordMatch');
    const registerButton = document.querySelector('#registerButton');

    if (password === passwordConfirm && password.length > 0) {
        passwordMatch.style.display = "block";
        passwordMatch.textContent = "The password match!";
        passwordMatch.style.color = "green";
        registerButton.disabled = false;

    } else if (password !== passwordConfirm && password.length > 0) {
        passwordMatch.style.display = "block";
        passwordMatch.textContent = "The passwords are not the same!";
        passwordMatch.style.color = "red";
        registerButton.disabled = true;
    } else {
        passwordMatch.style.display = "none";
    }
}


async function userRegister() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (!name || !email || !password) {
        alert('Please, fill all the fields');
        return;
    }

    const newUser = {
        username: name,
        email: email,
        password: password,
    };
    const url ='https://test-healthbook-deploy.onrender.com/api/users/register';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            throw new Error(`Request error: ${response.statusText}`);
        }
        alert('User successfully registered');
        document.getElementById('userForm').reset();
        return window.location.href = '/login.html';
    }
    catch (error) {
        console.error('Error:', error);
        alert('Error on trying to register the user, check console for more info');
    }
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('userForm').addEventListener('submit', function (event) {
        event.preventDefault();
        userRegister();
    });

    document.getElementById('passwordInput').addEventListener('input', function (event) {
        event.preventDefault();
        checkPassword();
    });
    document.getElementById('passwordConfirmInput').addEventListener('input', function (event) {
        event.preventDefault();
        checkPassword();
    });
});


