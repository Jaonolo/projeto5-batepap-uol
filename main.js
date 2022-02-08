const createMessage = (options) => {
    return `
        <div class="${options.type}">
            <small></small>
            <p>
                <strong>${options.origin}</strong> para <strong>${options.target}</strong>:  ${options.message}
            </p>
        </div>
    `
}

const createSystemMessage = (options) => {
    return `
        <div class="system">
            <small></small>
            <p>
                <strong>${options.origin}</strong>  ${options.message}
            </p>
        </div>
    `
}