import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = e.target.elements.content.value
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content)
            e.target.elements.content.value = ""
            socket.emit("CLIENT_SEND_TYPING", "hidden")

        }
    })
}

//  Server REturn
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .inner-body")
    const boxTyping = document.querySelector(".chat .inner-list-typing")    
    const div = document.createElement("div")
    div.classList.add("inner-incoming")
    let html = ""

    if (myId == data.userId) {
        div.classList.add("inner-outgoing")
    } else {
        html = `<div class="inner-name">${data.fullName}</div>`
        div.classList.add("inner-incoming")
    }

    div.innerHTML = `
            ${html}
            <div class="inner-content"> ${data.content}</div>
        `

    body.insertBefore(div,boxTyping)

    body.scrollTop = body.scrollHeight
})

const bodyChat = document.querySelector(".chat .inner-body")
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight
}

const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
var timeout
const emojiPicker = document.querySelector("emoji-picker")
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")
    emojiPicker.addEventListener("emoji-click", event => {
        const icon = event.detail.unicode
        inputChat.value = inputChat.value + icon

        const end = inputChat.value.length
        inputChat.setSelectionRange(end,end)
        inputChat.focus()

        socket.emit("CLIENT_SEND_TYPING", "show")

        clearTimeout(timeout)
        timeout = setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", "hidden")

        },3000)
    })

    

    inputChat.addEventListener("keyup", () => {
        socket.emit("CLIENT_SEND_TYPING", "show")

        clearTimeout(timeout)
        timeout = setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", "hidden")

        },3000)
    })
}
//typing
const elementListTyping = document.querySelector(".chat .inner-list-typing");
socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
        const existListTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
        const bodyChat = document.querySelector(".chat .inner-body")

        if (!existListTyping) {
            const boxTyping = document.createElement("div")
            boxTyping.classList.add("box-typing")
            boxTyping.setAttribute("user-id", data.userId)
            boxTyping.innerHTML = `
            <div class="inner-name">${data.fullName}</div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
        `
            elementListTyping.appendChild(boxTyping);
            bodyChat.scrollTop = bodyChat.scrollHeight;
        }else{
            const boxRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
            if(boxRemove){
                elementListTyping.removeChild(boxRemove)
            }
        }


    }
})