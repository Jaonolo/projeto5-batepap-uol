let username = ''
let currentOptions = {
    privacy: 'message',
    target: 'Todos'
}
let repeatLoadMessages = null

const createMessage = (options) => {
    switch (options.type){
        case 'status':
            messageHeader = `<strong>${options.from}</strong>`
            break
        case 'message':
            messageHeader = `<strong>${options.from}</strong> para <strong>${options.to}</strong>:`
            break
        case 'private_message':
            messageHeader = `<strong>${options.from}</strong> reservadamente para <strong>${options.to}</strong>:`
    }
 
    return `
        <div class="${options.type}">
            <p>
                <small>(${options.time})</small>
                ${messageHeader}
                ${options.text}
            </p>
        </div>
    `
}

const renderMessages = (messages) => {
    let renderedMessages = ''
    messages.forEach((elem) => {
        if(checkMessagePrivacy(elem))
            renderedMessages += createMessage(elem)
    })
    document.querySelector('main').innerHTML = renderedMessages
    document.querySelector('main').lastElementChild.scrollIntoView()
}

const togglePanel = (selector) => {
    document.querySelector(selector).classList.toggle('hidden')
}

const loadMessages = () => {
    axios
        .get('https://mock-api.driven.com.br/api/v4/uol/messages')
        .then((response) => renderMessages(response.data))

}

const stayActive = () => {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {
        name: username
    })
}

const checkMessagePrivacy = (message) => {
    isReserved = (message.type === 'private_message')
    isForMe = (message.to === username || message.from === username)

    if(isReserved && !isForMe)
        return false
    return true
}

const submitMessage = (form) => {
    const value = document.querySelector('footer input').value
    if (value === '')
        return

    axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',
        {
            from: username,
            to: currentOptions.target,
            text: value,
            type: currentOptions.privacy
        }
    ).then((message) => {
        form.reset()
        console.log(message)
    })
}

const joinRoom = () => {
    username = document.querySelector('section input').value

    axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {
        name: username
    }).then(() => {
        setInterval(stayActive, 5000)
        togglePanel('section')
        loadMessages()
        repeatLoadMessages = setInterval(loadMessages, 3000)
    })
}

const sidebarSelect = (section, button) => {
    currentOptions[section] = button.getAttribute('value')
    const selected = button.parentNode.querySelector('.selected')
    if(selected)
        selected.classList.remove('selected')
    button.classList.add('selected')
    togglePanel('aside')
}