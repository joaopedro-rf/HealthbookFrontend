function changeTab(tabIndex) {
    var tabPanes = document.querySelectorAll('.tab-pane');
    var buttons = document.querySelectorAll('.services-btn');

    tabPanes.forEach(function (pane) {
        pane.classList.remove('active');
    });

    var selectedPane = document.getElementById('tab' + tabIndex + 'Content');
    if (selectedPane) {
        selectedPane.classList.add('active');
    }


    
    buttons.forEach(function(button) {
        button.classList.remove('active');
    });
    
    var selectedButton = document.querySelector('.services-btn:nth-child(' + tabIndex + ')');
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}