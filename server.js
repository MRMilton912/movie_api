const http = require('http'),
  fs = require('fs'),
  url = require('url');

http.createServer((request, response) => {
  let addr = request.url;
    q = url.parse(addr, true);
    filePath = '';
  if (q.pathname.includes('documentation')) {
    filePath = (_dirname = '/documentation.html');
  } else {
    filePath = 'index.html'
  }

  fs.appendFile('log.txt','URL:' +addr+ '\nGTimestamp:' + new Date() + '\n\n', (err) => {
    if (err) {
      console.group(err);
    }
  });

}).listen(8080);

console.log('My first Node test server is running on Port 8080.');