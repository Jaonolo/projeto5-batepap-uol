const createMessage = (options) => {

    const time = formatTime(options.timestamp)
    const messageHeader = options.type === 'system' ?
        `  <strong>${options.origin}</strong> para <strong>${options.target}</strong>:  `:
        `  <strong>${options.origin}</strong>  `

    return `
        <div class="${options.type}">
            <small>(${time})</small>
            <p>
                ${messageHeader}
                ${options.messageBody}
            </p>
        </div>
    `
}

const renderMessage = (message) => {
    document.querySelector('main').innerHTML =+ message
}

const formatTime = (timestamp) => {
    const dateSent = new Date(timestamp)

    const hours = ('' + dateSent.getHours()).padStart(2, '0')
    const minutes = ('' + dateSent.getMinutes()).padStart(2, '0')
    const seconds = ('' + dateSent.getSeconds()).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
}

const togglePanels = (selector) => {
    document.querySelector(selector).classList.toggle('hidden')
}