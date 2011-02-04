var amqp = require ('amqp');
var event = require ('events')


function Consumer(conn, exchange){
  var emitter = new event.EventEmitter(),
    queues = {};
  
  this.bindQueue = function(routingKey, fn){
    var queue = conn.queue(routingKey, {});
    queue.bind(exchange, routingKey);
    queue.subscribe(fn);
    queues[routingKey] = queue;
  }

  this.stop =function(routingKey){
    queues[routingKey].destroy();
    delete queues[routingKey];
  }
  this.destroyAll = function(){
    for(var key in queues){
      this.stop(key);
    }
  }
}

function createConsumer(exchangeName, fn){
  var connection = amqp.createConnection({ host: 'localhost' });
  connection.addListener('ready', function(){
    fn(new Consumer(connection, exchangeName));
  });
}

module.exports = {
  createConsumer:createConsumer
};
