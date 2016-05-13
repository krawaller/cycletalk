import Rx from 'rx'
import jQuery from 'jquery'

const TRAVELTIME = 8000; // match this to delay in css transition!

// shorthands for the stream definitions
const fromEvent = (sel,evt)=>
  Rx.Observable.fromEvent(document.querySelector(sel),evt)
const fromClick = (sel)=> fromEvent(sel,'click')
const Obs = Rx.Observable
const docsource = document.documentElement.outerHTML
const USER_URL = "http://jsonplaceholder.typicode.com/users/"
const getJSON = url=> {
  console.log("GETTING",url)
  return jQuery.getJSON(url)
}
const proxy = new Rx.ReplaySubject(1)

// used for all stream subscriptions
const addEventToStream = (container,content) => {
  const event = document.createElement("div");
  event.classList.add("event");
  event.innerHTML = content;
  container.appendChild(event);
  setTimeout(()=>event.classList.add("active"),50)
  setTimeout(()=>container.removeChild(event), TRAVELTIME+50)
}


// setting up a new stream from a definition

let nbrOfStreams = 0
let streamcontainer = document.querySelector('.streams')
let streams = {}

const addStreams = (streams)=>
  streams.forEach(s=> addStream.apply(null,s) )

const addStream = (id,desc,code)=> {
  const row = document.createElement("div")
  row.classList.add("stream");
  row.id='s'+(++nbrOfStreams);
  row.innerHTML = `
    <div class="id">${id}</div>
    <div class="description">${desc}</div>
    <div class="events"></div>
    <div class="code">${code.replace(/streams\./g,'')}</div>
`
  const container = row.querySelector('.events');
  streamcontainer.appendChild(row)
  row.addEventListener('click',e=>{
    let stream
    if (typeof code === 'string'){
      stream = eval(code+'.share()')
    }
    stream = stream.map(
      i=>typeof i === 'string' ? (i+'').replace(/ /g,'&nbsp;') : i
    );
    streams[id] = stream;
    if (!row.classList.contains('started')){
      row.classList.add('started')
      setTimeout(()=>{
        stream.subscribe((item)=>{
          addEventToStream(container,item);
        });
      },300)
    }
  })
  
}

export {addEventToStream,addStream,streams,addStreams}