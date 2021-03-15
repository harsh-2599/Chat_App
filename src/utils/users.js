const users = [] // Array of all users

// Function for adding user
const addUser = ({id,username,room})=>{
    
    //Validating Data
    if(!username || !room){
        return {
            error : 'Username and room are required'
        }
    }
   
    //Cleaning Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    
    //Checking for username
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //Validating Username
    if(existingUser){
        return {
            error : 'User already exists'
        }
    }

    //Storing User
    const user  = {id,username,room}
    users.push(user);
    return { user}
}

// Function for removing the user from array
const removeUser = (id)=>{
    const index = users.findIndex((user) =>{
        return user.id === id
    })

    if(index!= -1){
        return users.splice(index,1)[0]
    }
}

// Function for viewing any user by id
const getUser = (id) =>{
    return users.find((user)=>user.id === id)
}

// Function for getting info about all users in a room
const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>user.room === room)
}

// addUser({
//     id : 45,
//     username : 'Nisarg',
//     room : 'My room'
// })
// addUser({
//     id : 46,
//     username : 'Nisarg',
//     room : 'My room'
// })
// addUser({
//     id : 47,
//     username : 'Harsh',
//     room : 'Room'
// })
// console.log(users)
// const res = getUser(47)
// console.log(res);
// const res1 = getUsersInRoom('my room')
// console.log(res1)
// // console.log(usertoadd);

module.exports = { addUser, getUser, removeUser, getUsersInRoom}