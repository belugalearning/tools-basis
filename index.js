var util = require('util')
  , express = require('express')
  , seaport = require('seaport')
;

var localise = !!~process.argv.indexOf('--localise')

var seaportServiceName = 'teach-dev'

var app = express()
app.use(express.bodyParser())
app.use(express.static(__dirname + '/web-client/host'))
app.use('/', express.static(__dirname + '/web-client'))
app.use('/host-helpers', express.static(__dirname + '/host-helpers'))
app.use('/shared-resources', express.static(__dirname + '/shared-resources'))
app.use('/tools-tests', express.static(__dirname + '/tools-tests'))

var ports = seaport.connect('127.0.0.1', 9090)
var port = localise ? 3333 : ports.register(seaportServiceName)
app.listen(port)
console.log('listening on %d', port)
