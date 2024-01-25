async function userLogin() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;


    if (!email || !password) {
        alert('Please, fill all the fields');
        return;
    }

    const userToLogin = {
        email: email,
        password: password,
    };

    const url = 'https://test-healthbook-deploy.onrender.com/api/users/login';
    console.log(userToLogin);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userToLogin),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            const bearerToken = responseData.token;
            localStorage.setItem('token', bearerToken);
            document.getElementById('loginForm').reset();
            return window.location.href = '/calendar.html';
        }
    } catch (error) {
        console.error('Error:', error.message); 
        alert('Error on trying to log in. Check console for more info');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        userLogin();
    });
});