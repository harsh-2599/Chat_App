const socket = io()


document.querySelector('#form').addEventListener('submit',(e)=>{
    e.preventDefault()
    // const message = document.querySelector('input').value //if more than one inouts are present then it will create conflicts
    const message = document.querySelector('text').value
    // const message = e.target.elements.message //other way 
    socket.emit('sendMessage',message)
})

socket.on('message',(message) => {
    console.log(message);
})