let username = ''
// let lastResponse = []

const createMessage = (options) => {

    const time = options.time
    const messageHeader = options.type === 'status' ?
        `  <strong>${options.from}</strong>  `:
        `  <strong>${options.from}</strong> para <strong>${options.to}</strong>:  `

    return `
        <div class="${options.type}">
            <p>
                <small>(${time})</small>
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
}

const togglePanel = (selector) => {
    document.querySelector(selector).classList.toggle('hidden')
}

const loadMessages = () => {
    axios
        .get('https://mock-api.driven.com.br/api/v4/uol/messages')
        .then((response) => renderMessages(response.data))
        // console.log(lastResponse)
        // let filteredResponse = response.data.filter(elem => !lastResponse.includes(elem))
        // filteredResponse.forEach((elem) => {
        // lastResponse = response.data

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


/* this should be a fuction */
loadMessages()
setInterval(loadMessages, 3000)

/* TEMPORARY */
const submitMessage = () => {
    const value = document.querySelector('footer input').value
    if (value === '')
        return

    axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',
        {
            from: username,
            to: 'Todos',
            text: value,
            type: 'message'
        }
    ).then((message) => {
        console.log(message)
    })
}

const joinRoom = () => {
    username = document.querySelector('section input').value

    axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {
        name: username
    }).then((response) => {
        if(response.status === 200) {
            setInterval(stayActive, 5000)
            togglePanel('section')
            loadMessages()
            setInterval(loadMessages, 3000)
        }
        else
            console.log('deu ruim')
    })
}