const loadingScreen = `
    <p>Entrando...</p>
`

const sidebarContentHTML = (buttonClass, value, icon) => {
    return `
        <button onclick="sidebarSelect('target', this)" value="${value}" class="${buttonClass}" data-identifier="participant">
            <ion-icon name="${icon}"></ion-icon>
            <p>${value}</p>
            <ion-icon class='select-symbol' name='checkmark'></ion-icon>
        </button>
    `
}

const createMessage = (options) => {
    let messageHeader = ''
    switch (options.type){
        case 'private_message':
            messageHeader = ` reservadamente`
        case 'message':
            messageHeader = messageHeader + ` para <strong>${options.to}</strong>:`
        case 'status':
            messageHeader = `<strong>${options.from}</strong>` + messageHeader
    }
 
    return `
        <div class="${options.type}" data-identifier="message">
            <p>
                <small>(${options.time})</small>
                ${messageHeader}
                ${options.text}
            </p>
        </div>
    `
}