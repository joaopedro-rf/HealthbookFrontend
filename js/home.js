document.addEventListener('DOMContentLoaded', function () {

    const url = "http://127.0.0.1:8080/api/";
    const response = fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },

    })
        .then(response => {
        if (!response.ok) {
            throw new Error(`Request error: ${response.statusText}`);
        }
        return response.json();

    })
        .then(data => {
        })
        .catch(error => {
        });

});