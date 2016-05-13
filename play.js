var Rx = require('rx');

var proxy = new Rx.ReplaySubject(1)

var ping = proxy.delay(500).map(function(i){ return 'ping' });

var pong = ping.delay(500).map(function(i){ return 'pong' })


pong.subscribe(proxy)
proxy.onNext('wtf')



pong.subscribe(function(i){ console.log(i); })
ping.subscribe(function(i){ console.log(i); })