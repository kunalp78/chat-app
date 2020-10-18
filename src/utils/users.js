const users = [];

const addUser = ({ id, username, room }) => {
    //Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    
    //Validate the data
    if(!username || !room){
        return {
            error: 'Username and Password are required'
        }
    }
    
    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })
    
    //Validate username
    if(existingUser){
        return {
            error: 'Username in use!'
        }
    }
    //store user
    const user = { id, username, room };
    users.push(user)
    return { user }
}
const removeUser = (id)=>{
    const index = users.findIndex(user=> user.id === id)

    if(index !== -1 ){
        return users.splice(index, 1)[0]
    }
}
const getUser = (id)=>{
    return users.find((user)=> user.id === id);
    
}
const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>user.room === room)
}

// addUser({
//     id:123,
//     username:'Kunal',
//     room:'jamshe'
// })
// console.log(users)
// console.log(getUser(123))
// console.log(getUsersInRoom('jamshe'))
// console.log(removeUser(123))
 console.log(users)
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
