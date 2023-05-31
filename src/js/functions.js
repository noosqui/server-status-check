const loadContent = async ()=>{
var container =  $('.container')
await fetch('../servers.json').then((data)=>{
loadCards(data.json());

}
).catch((error) => console.error(error))


`




`





}

const loadCards = (data)=>{

    console.log(data)



}
