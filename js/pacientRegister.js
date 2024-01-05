async function registerPacient() {
    const name = document.getElementById('nameInput').value;
    const age = document.getElementById('ageInput').value;
    const phoneNumber = document.getElementById('phoneInput').value;
    const address = document.getElementById('addressInput').value;

    
    if (!name || isNaN(age) || !phoneNumber || !address) {
        alert('Please, fill all the fields');
        return;
    }

    const newPacient = {
        name: name,
        age: age,
        phoneNumber: phoneNumber,
        address: address
    };

    const storedToken = localStorage.getItem("token");
    console.log("Token recuperado em arquivo2.js:", storedToken);

   
        try {
            const response = await fetch('https://test-healthbook-deploy.onrender.com/api/pacients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + storedToken 
                },
                body: JSON.stringify(newPacient)
            });
            if (!response.ok) {
                throw new Error(`Request error: ${response.statusText}`);
            }
            const responseData = await response.json();
            console.log('Response' , response);
            if(response.ok)
                return window.location.href = '/calendar.html';
           
            
        } catch (error) {
            console.error('Error:', error);            
            alert('Error on trying to register the pacient, check console for more info');
        }
};



document.addEventListener('DOMContentLoaded', function () {
    const pacientForm = document.getElementById('pacientForm');

    pacientForm.removeEventListener('submit', registerPacient);


    pacientForm.addEventListener('submit', function (event) {
        event.preventDefault();
        registerPacient()
        
    });
    
});