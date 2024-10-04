
function hideAlert(alertId,timeout){
    setTimeout(()=>{
        var alertElement = document.getElementById(alertId);
        if(alertElement){
            alertElement.style.display = 'none';
        }
    },timeout)
}