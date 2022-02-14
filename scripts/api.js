const joinRoom = () => {
    username = document.querySelector('section input').value
    document.querySelector('section form').innerHTML = loadingScreen

    axios
        .post(SRC + '/participants', {
                name: username
            }
        )
        .then(chatInitialize)
        .catch((response)=>{alert('Nome em uso! Escolha outro nome:\n' + response)})
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

const submitMessage = (form) => {
    const value = document.querySelector('footer input').value
    form.reset()
    if (value === '')
        return

    axios
        .post(SRC + '/messages',
        {
            from: username,
            to: currentOptions.target,
            text: value,
            type: currentOptions.privacy
        })
        .then((message) => {
            loadMessages()
        })
        .catch(()=>{
            alert('Falha ao enviar sua mensagem, favor reconecte-se')
            window.location.reload()
        })
}

const queryParticipants = () => {
    axios
        .get(SRC + '/participants')
        .then((response) => {
            onlineParticipants = response.data.filter((user) => {return user.name !== username})
            sidebarContent()
        })
        .catch(()=>{
            alert('Falha ao carregar lista de usuários, favor reconecte-se')
            window.location.reload()
        })
}

const loadMessages = () => {
    axios
        .get(SRC + '/messages')
        .then((response) => renderMessages(response.data))
        .catch(()=>{
            alert('Falha ao carregar novas mensagens, favor reconecte-se')
            window.location.reload()
        })

}