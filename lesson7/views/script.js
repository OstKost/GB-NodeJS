function getXmlHttp() {
    let xmlhttp
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest()
    }
    return xmlhttp
}

function completeTask(obj) {         
    const divElem = obj.parentElement
    const span = divElem.getElementsByTagName('span')[0]
    const itemID = divElem.attributes.itemid.value;     
    const newStatus = span.classList.contains('done') ? 0 : 1 
    console.log(newStatus)
    const xmlhttp = getXmlHttp()
    xmlhttp.open('PUT', `/tasks/${itemID}`, true)
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlhttp.send(`status=${newStatus}`) // Отправляем запрос
    xmlhttp.onreadystatechange = () => { 
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // alert(xmlhttp.responseText) // Выводим ответ сервера
                document.getElementsByTagName('h1')[0].innerText += ' success'                  
                span.classList.toggle("done")                
            }
        }
    }
}

function deleteTask(obj) {           
    const itemID = obj.parentElement.attributes.itemid.value;       
    const xmlhttp = getXmlHttp()
    xmlhttp.open('DELETE', `/tasks/${itemID}`, true)
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlhttp.send("id=" + itemID) // Отправляем запрос
    xmlhttp.onreadystatechange = () => { 
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                // alert(xmlhttp.responseText) // Выводим ответ сервера
                document.getElementsByTagName('h1')[0].innerText += ' success'
                const elem = obj.parentElement.parentElement                
                elem.parentElement.removeChild(elem)
            }
        }
    }
}
