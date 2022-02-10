const USERNAME = 'Jao'
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

const checkMessagePrivacy = (message) => {
    isReserved = (message.type === 'private_message')
    isForMe = (message.to === USERNAME || message.from === USERNAME)

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
            from: USERNAME,
            to: 'Tets',
            type: 'public',
            text: value
        }
    )
}