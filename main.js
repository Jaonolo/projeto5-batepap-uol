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