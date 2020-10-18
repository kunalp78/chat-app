const socket = io()


//Elements
 const $messageForm = document.querySelector('#message-form')
 const $messageFormButton = $messageForm.querySelector('button');
 const $messageFormInput = $messageForm.querySelector('input');
 const $sendLocationButton = document.querySelector('#send-location');
 const $messages = document.querySelector('#messages');
 //const $locations = document.querySelector('#locations')
 //Templates
 const messageTemplate = document.querySelector('#message-template').innerHTML;
 const locationTemplate = document.querySelector('#location-template').innerHTML;
 const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

 //options
 const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

 //autoScroll
 const autoScroll = ()=>{
    //new message element
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    //visible Height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight;

    //how far I have scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
 }
//location using Mustache
 socket.on('locationMessage', (url)=>{
     console.log(url);
     const html = Mustache.render(locationTemplate,{
         username:url.username,
         url: url.url,
         createdAt: moment(url.createdAt).format("h:mm a")
     })
     $messages.insertAdjacentHTML('beforeend', html)
     autoScroll();
 })
//plain dynamic text using Mustache
 socket.on('message',(message)=>{
    //console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message: message.text,
        createdAt:moment(message.createdAt).format("hh:mm a")
    });
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll();
})
//get users info on screen
socket.on('roomData',({ room, users })=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})
//general form event listener
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled')
    //disable
    const message = e.target.elements.message.value;

    socket.emit('sendMessage',message, (error)=>{
        //enable
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value='';
        $messageFormInput.focus();
        if(error){
            return console.log(error)
        }
        console.log('The message was Delivered');
    })
})
//location button event Listener
$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('GeoLocation Not Suported by browser!!') 
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position)=>{
        
        console.log(position)
        socket.emit('sendLocation',{ 
            latitude:position.coords.latitude, 
            longitude:position.coords.longitude },()=>{
                $sendLocationButton.removeAttribute('disabled');
                $messageFormInput.focus();
                console.log('location was shared')
            })
    })
})

socket.emit('join',{ username, room }, (error)=>{
    if(error){
        alert(error);
        location.href = '/'
    }
});