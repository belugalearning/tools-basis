var util = require('util')
  , fs = require('fs')
  , express = require('express')
  , seaport = require('seaport')
;

var localise = !!~process.argv.indexOf('--localise')

var seaportServiceName = 'teach-dev'

var app = express()
app.use(express.cookieParser())
app.use(express.session({ key: 'beluga-teach-sid', secret: 'bdae701ef257c3d7bc2cf2b2f1fbf16f842470b775308ac02d27e82a31c3ebafd22d24b90ea4cac7cd27389ea598629b' }))
app.use(express.bodyParser())

app.all('*', function(req, res, next) {
  if (req.session.authenticated || (req.method == 'GET' && /^\/(shared-resources|res)\/.*\.png/.test(req.url))) return next()

  if (req.method == 'GET') {
    return res.send(fs.readFileSync(__dirname + '/sign-in.html', 'utf8'))
  }

  if (req.method == 'POST' && req.url == '/sign-in') {
    if (req.body.password == 'thisisnotalovesong') {
      req.session.authenticated = true
    }
    return res.redirect('/')
  }

  res.send(403)
  console.log(req.sessionID, req.url, req.session.authenticated)
})


app.use(express.static(__dirname + '/web-client/host'))
app.use('/', express.static(__dirname + '/web-client'))
app.use('/host-helpers', express.static(__dirname + '/host-helpers'))
app.use('/shared-resources', express.static(__dirname + '/shared-resources'))
app.use('/tools-tests', express.static(__dirname + '/tools-tests'))

var ports = seaport.connect('127.0.0.1', 9090)
var port = localise ? 3333 : ports.register(seaportServiceName)
app.listen(port)
console.log('listening on %d', port)
