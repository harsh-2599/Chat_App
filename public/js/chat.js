const socket = io() // Initialization

// Elements of form are stored in variable
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Template of form are stored in variable. Data is printed on templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Gets username and room name from query string 
// ignoreQueryPrefix ignores the '?' at the beginning of the query
const {username, room }= Qs.parse(location.search ,{ignoreQueryPrefix : true})

// Function for autoscroll
const autoscroll = ()=>{
    //New Message element. New message which is sent
    const $newMessage = $messages.lastElementChild

    //Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible Height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

// When form is submitted this function is runs
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    
    //Attribute of form is set. Disabled is set to disabled 
    $messageFormButton.setAttribute('disabled','disabled')
    
    // const message = document.querySelector('input').value //if more than one inputs are present then it will create conflicts
    var message = $messageFormInput.value
    // const message = e.target.elements.message.value //other way 
    
    // Message is emitted 
    socket.emit('sendMessage',message,(error)=>{
        // Once the message is sent button is enabled by removing 'disabled' attribute
        $messageFormButton.removeAttribute('disabled')
        // Once message is sent the input is reset
        $messageFormInput.value = ''
        // Once message is sent textbox is focused
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message delivered to all clients')
    })
})

// When send location button is clicked this function is called
$sendLocationButton.addEventListener('click',()=>{
    // Wheb button is clicked it is disabled till location is sent
    $sendLocationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    // This provides the current location
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        // Location is emitted 
        socket.emit('sendLocation',{
            lat : position.coords.latitude,
            long : position.coords.longitude
        },()=>{
            // Disabled attribute is removed once location is sent
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared with all users')
        })
    })
})

// Runs when server side messages are to be listened
socket.on('message',(message) => {
    console.log(message);
    // Mustache library is used to send html into the template
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    // Html is inserted into the html paragraph
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

// Runs when server side location messages are received
socket.on('locationMessage',(message)=>{
    // console.log(url)
    // Mustache library is used to send html into the template
    const html = Mustache.render(locationTemplate,{
        username : message.username,
        url : message.url,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    // Html is inserted into the html paragraph
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

// Runs when server sends room data to users
socket.on('roomData',({room , users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    //Inserts data into sidebar
    document.querySelector('#sidebar').innerHTML = html
})

// Emit when user joins the room
socket.emit('join',{username,room},(error)=>{
    // If error occurs user is directed to home page
    if(error){  
        alert(error)
        location.href = '/'
    }
})