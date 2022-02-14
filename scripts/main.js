const SRC = 'https://mock-api.driven.com.br/api/v4/uol'

let username = ''
let currentOptions = {
    privacy: 'message',
    target: 'Todos'
}
let onlineParticipants = []

const chatInitialize = () => {
    setInterval(stayActive, 5000)
    setInterval(loadMessages, 3000)
    setInterval(queryParticipants, 10000)
    loadMessages()
    queryParticipants()
    targetText()
    togglePanel('section')
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
 
    let buttonClass = currentOptions['target'] === 'Todos' ? 'selected' : '' 
    participantsList.innerHTML = sidebarContentHTML(buttonClass, 'Todos', 'people')

    onlineParticipants.forEach((user) => {
        buttonClass = currentOptions['target'] === user.name ? 'selected' : ''  
        participantsList.innerHTML += sidebarContentHTML(buttonClass, user.name, 'person-circle')
    }) 
}

const targetText = () => {
    const targetTextContainer = document.querySelector('form p')
    const privacy = currentOptions['privacy'] === 'message' ? '' : ' (reservadamente)'

    targetTextContainer.innerText = `Enviando para ${currentOptions['target']}${privacy}`
}