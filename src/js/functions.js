var db 
var config
// Definicion de variables











// Funciones
const loadContent = async ()=>{
var container =  $('.container')
await fetch('../servers.json').then((res)=>
res.json()
).then((json)=>{
    console.log(json['data'])
    db = json['data']
    config = json['config']
    loadCards(json['data'])
    globalUpdate()
    self.setInterval(globalUpdate,config['check_seconds']*1000)

}).catch((error) => console.error(error))

}


const loadCards = (data)=>{
    var container = $('.container')

    data.forEach(el => {
        
        let card = createElement('div',{
            id:el['$id'],
            classList:'card',
            key:el['$id']
        })
       
        card.onclick = ()=>{fetchRequest('#'+el['$id'],el['ip'],el['method'])}
        let header = createElement('div',{
            classList:'card-header'

         })
        header.appendChild(createElement('h1',{'innerHTML':el['name']}))
        header.appendChild(createElement('div',{
            classList:'status status_warning',
            innerHTML:'WAIT<i class="fa-solid fa-spinner fa-spin"></i>'
        }))
        let content = createElement('div',{
            classList:'card-content'
        })


        content.appendChild(createElement('h5',{'innerHTML':el['ip'],classList:'ip'}))
        content.appendChild(createElement('div',{'innerHTML':el['method'],classList:'method'}))
        content.appendChild(createElement('div',{innerHTML:'waiting...',classList:'fetch_response'}))
        let footer = createElement('div',{
            classList:'card-footer',
        }) 
        footer.appendChild(createElement('span',{innerHTML :new Date().toLocaleString()}))
        footer.appendChild(createElement('span',{innerHTML :el['type']}))
        card.appendChild(header)
        card.appendChild(content)
        card.appendChild(footer)
        container[0].appendChild(card)
    });
}
const createElement = (element,options)=>{

    return Object.assign(document.createElement(element),options)
}


const globalUpdate = async ()=>{
    const lastGlobalUpdate = $('#date_container')[0]

    lastGlobalUpdate.innerHTML ='Last Global Update:'+new Date().toLocaleString();
    db.forEach(async(el)=>{
       await fetchRequest('#'+el['$id'],el['ip'],el['method'])
    })






}


const fetchRequest = async(element,ip,method)=>{
// Colocar elemento de status en 
    let statusbar = $(element+' .card-header .status')[0]
    let responseText = $(`${element} .fetch_response `)[0]
    let lastUpdated = $(`${element} .card-footer span `)[0]
    responseText.innerHTML = 'waiting...'
    statusbar.classList='status status_warning'
    statusbar.innerHTML ='WAIT<i class="fa-solid fa-spinner fa-spin"></i>'
if (method=='GET')
    await fetch(ip).then((res)=>{
        if (res.status = 200)
        {
            console.log(res)
            statusbar.classList='status status_ok'
            statusbar.innerHTML = 'OK<i class="fa-solid fa-thumbs-up"></i>'
            responseText.innerHTML =`${res.status} ${res.statusText}`
            lastUpdated.innerHTML = new Date().toLocaleString()
        }

        
    }).catch((err)=>{
        console.log(err)
        statusbar.classList='status status_error'
        statusbar.innerHTML = 'ERROR<i class="fa-solid fa-circle-exclamation"></i>'
        responseText.innerHTML = err
        lastUpdated.innerHTML = new Date().toLocaleString()
        new Audio('./static/sound/notification.mp3').play()
       
    })
if (method =='PING'){
    $.ajax({url: ip,
        type: "HEAD",
        timeout:1000,
        crossDomain: true,

        statusCode: {
            200: function (response) {
                console.log(response)
                statusbar.classList='status status_ok'
                statusbar.innerHTML = 'OK<i class="fa-solid fa-thumbs-up"></i>'
                responseText.innerHTML =`Server is UP `
                lastUpdated.innerHTML = new Date().toLocaleString()
            },
            400: function (response) {
                statusbar.classList='status status_error'
                statusbar.innerHTML = 'ERROR<i class="fa-solid fa-circle-exclamation"></i>'
                responseText.innerHTML =`Server is DOWN `
                lastUpdated.innerHTML = new Date().toLocaleString()
                new Audio('./static/sound/notification.mp3').play()
            },
            0: function (response) {
                statusbar.classList='status status_error'
                statusbar.innerHTML = 'ERROR<i class="fa-solid fa-circle-exclamation"></i>'
                responseText.innerHTML =`Server is DOWN `
                 lastUpdated.innerHTML = new Date().toLocaleString()
                new Audio('./static/sound/notification.mp3').play()
            }              
        }
 }).then((res)=>{console.log(res)});
}

}

