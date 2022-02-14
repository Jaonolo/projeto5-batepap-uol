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
        .post(SRC + '/participants', {
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
    axios
        .post(SRC + '/status', {
            name: username
        })
        .catch(()=>{
            alert('Falha ao mantê-lo online, favor reconecte-se')
            window.location.reload()
        })
}

const queryParticipants = () => {
    axios
        .get(SRC + '/participants')
        .then((response) => onlineParticipants = response.data.filter(
            (user) => {return user.name !== username}
        ))
        .catch(()=>{
            alert('Falha ao carregar lista de usuários, favor reconecte-se')
            window.location.reload()
        })
}

// ==============================================================

const loadMessages = () => {
    axios
        .get(SRC + '/messages')
        .then((response) => renderMessages(response.data))
        .catch(()=>{
            alert('Falha ao carregar novas mensagens, favor reconecte-se')
            window.location.reload()
        })

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
    .catch(()=>{
        alert('Falha ao enviar sua mensagem, favor reconecte-se')
        window.location.reload()
    })

}

// ==============================================================

const togglePanel = (selector) => {
    document.querySelector(selector).classList.toggle('hidden')
    if (selector === 'aside')
        setTimeout(() => {
            document.querySelector('aside > div').classList.toggle('sidebar-grow')
        }, 250)
}

const sidebarSelect = (section, button) => {
    currentOptions[section] = button.getAttribute('value')
    const selected = button.parentNode.querySelector('.selected')
    if(selected)
        selected.classList.remove('selected')
    button.classList.add('selected')
    targetText()
}

const sidebarContent = () => {
    const participantsList = document.querySelector('.participants')
    queryParticipants()

    let buttonClass = currentOptions['target'] === 'Todos' ? 'selected' : '' 
    participantsList.innerHTML = `
        <button onclick="sidebarSelect('target', this)" value="Todos" class="${buttonClass}">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
            <ion-icon class='select-symbol' name='checkmark'></ion-icon>
        </button>
    `
    onlineParticipants.forEach((user) => {
        buttonClass = currentOptions['target'] === user.name ? 'selected' : ''  
        participantsList.innerHTML += `
            <button onclick="sidebarSelect('target', this)" value="${user.name}" class="${buttonClass}">
                <ion-icon name="person-circle"></ion-icon>
                <p>${user.name}</p>
                <ion-icon class='select-symbol' name='checkmark'></ion-icon>
            </button>
        `
    }) 
}

const targetText = () => {
    const targetTextContainer = document.querySelector('form p')
    const privacy = currentOptions['privacy'] === 'message' ? '' : ' (reservadamente)'

    targetTextContainer.innerText = `Enviando para ${currentOptions['target']}${privacy}`
}