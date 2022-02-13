const SRC = 'https://mock-api.driven.com.br/api/v4/uol'

let username = ''
let currentOptions = {
    privacy: 'message',
    target: 'Todos'
}
let onlineParticipants = null

// ==============================================================

const joinRoom = () => {
    username = document.querySelector('section input').value

    axios
        .post(SRC + '/participants', 
            {
                name: username
            }
        )
        .then(chatInitialize)
        .catch(()=>{alert('Nome em uso! Escolha outro nome')})
}

const chatInitialize = () => {
    setInterval(stayActive, 5000)
    setInterval(loadMessages, 3000)
    loadMessages()
    queryParticipants()
    targetText()
    togglePanel('section')
}

const stayActive = () => {
    axios.post(SRC + '/status', {
        name: username
    })
}

const queryParticipants = () => {
    axios
        .get(SRC + '/participants')
        .then((response) => onlineParticipants = response.data.filter(
            (user) => {return user.name !== username}
        ))
}

// ==============================================================

const loadMessages = () => {
    axios
        .get(SRC + '/messages')
        .then((response) => renderMessages(response.data))

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

const checkMessagePrivacy = (message) => {
    isReserved = (message.type === 'private_message')
    isForMe = (message.to === username || message.from === username)

    if(isReserved && !isForMe)
        return false
    return true
}

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

const submitMessage = (form) => {
    const value = document.querySelector('footer input').value
    if (value === '')
        return

    axios.post(SRC + '/messages',
        {
            from: username,
            to: currentOptions.target,
            text: value,
            type: currentOptions.privacy
        }
    ).then((message) => {
        form.reset()
        loadMessages()
    })
}

// ==============================================================

const togglePanel = (selector) => {
    document.querySelector(selector).classList.toggle('hidden')
}

const sidebarSelect = (section, button) => {
    currentOptions[section] = button.getAttribute('value')
    const selected = button.parentNode.querySelector('.selected')
    if(selected)
        selected.classList.remove('selected')
    button.classList.add('selected')
    targetText()
    togglePanel('aside')
}

const sidebarContent = () => {
    const participantsList = document.querySelector('.participants')
    queryParticipants()

    let buttonClass = currentOptions['target'] === 'Todos' ? 'selected' : '' 
    participantsList.innerHTML = `
        <button onclick="sidebarSelect('target', this)" value="Todos" class="${buttonClass}">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
            <ion-icon class='select-symbol' name='heart'></ion-icon>
        </button>
    `
    onlineParticipants.forEach((user) => {
        buttonClass = currentOptions['target'] === user.name ? 'selected' : ''  
        participantsList.innerHTML += `
            <button onclick="sidebarSelect('target', this)" value="${user.name}" class="${buttonClass}">
                <ion-icon name="person-circle"></ion-icon>
                <p>${user.name}</p>
                <ion-icon class='select-symbol' name='heart'></ion-icon>
            </button>
        `
    }) 
}

const targetText = () => {
    const targetTextContainer = document.querySelector('form p')
    const privacy = currentOptions['privacy'] === 'message' ? '' : ' (reservadamente)'

    targetTextContainer.innerText = `Enviando para ${currentOptions['target']}${privacy}`
}