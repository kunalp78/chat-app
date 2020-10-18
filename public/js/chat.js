const socket = io()


//Elements
 const $messageForm = document.querySelector('#message-form')
 const $messageFormButton = $messageForm.querySelector('button');
 const $messageFormInput = $messageForm.querySelector('input');
 const $sendLocationButton = document.querySelector('#send-location');
 const $messages = document.querySelector('#messages');

 //Templates
 const messageTemplate = document.querySelector('#message-template').innerHTML;

 socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message: message
        
    });
    $messages.insertAdjacentHTML('beforeend', html)
})
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

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('GeoLocation Not Suported by browser!!') 
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position)=>{
        $sendLocationButton.removeAttribute('disabled')
        console.log(position)
        socket.emit('sendLocation',{ 
            latitude:position.coords.latitude, 
            longitude:position.coords.longitude },error=>console.log(error?error:'the locatin was shared'))
    })
})