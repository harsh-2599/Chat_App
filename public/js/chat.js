const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML


const {username, room }= Qs.parse(location.search ,{ignoreQueryPrefix : true})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    
    // const message = document.querySelector('input').value //if more than one inouts are present then it will create conflicts
    var message = $messageFormInput.value
    // const message = e.target.elements.message.value //other way 
    
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message delivered to all clients')
    })
})

$sendLocationButton.addEventListener('click',()=>{
    $sendLocationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        socket.emit('sendLocation',{
            lat : position.coords.latitude,
            long : position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared with all users')
        })
    })
})

socket.on('message',(message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(message)=>{
    // console.log(url)
    const html = Mustache.render(locationTemplate,{
        url : message.url,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})


socket.emit('join',{username,room})