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

 //options
 const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
//location using Mustache
 socket.on('locationMessage', (url)=>{
     console.log(url);
     const html = Mustache.render(locationTemplate,{
         url: url.url,
         createdAt: moment(url.createdAt).format("h:mm a")
     })
     $messages.insertAdjacentHTML('beforeend', html)
 })
//plain dynamic text using Mustache
 socket.on('message',(message)=>{
    //console.log(message)
    const html = Mustache.render(messageTemplate,{
        message: message.text,
        createdAt:moment(message.createdAt).format("hh:mm a")
    });
    $messages.insertAdjacentHTML('beforeend', html)
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
        $sendLocationButton.removeAttribute('disabled');
        $messageFormInput.focus()
        console.log(position)
        socket.emit('sendLocation',{ 
            latitude:position.coords.latitude, 
            longitude:position.coords.longitude },error=>console.log(error?error:'the location was shared'))
    })
})

socket.emit('join',{ username, room });