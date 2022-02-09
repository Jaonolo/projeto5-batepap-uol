const USERNAME = 'Jao'
let lastResponse = []

const createMessage = (options) => {

    const time = formatTime(options.time)
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

const renderMessage = (message) => {
    document.querySelector('main').innerHTML += message
}

const formatTime = (time) => {
    const dateSent = new Date(time)

    const hours = ('' + dateSent.getHours()).padStart(2, '0')
    const minutes = ('' + dateSent.getMinutes()).padStart(2, '0')
    const seconds = ('' + dateSent.getSeconds()).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
}

const togglePanel = (selector) => {
    document.querySelector(selector).classList.toggle('hidden')
}

const loadMessages = () => {
    axios.get('https://mock-api.driven.com.br/api/v4/uol/messages').then((response) => {
        let filteredResponse = response.data.filter(elem => !lastResponse.includes(elem))
        filteredResponse.forEach((elem) => {
            if(checkMessagePrivacy(elem))
                renderMessage(createMessage(elem))
        })
    })
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

    renderMessage(createMessage(
        {
            from: USERNAME,
            to: 'Tets',
            type: 'public',
            time: Date.now(),
            text: value
        }
    ))
}