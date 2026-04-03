const https = require('https');

const req = https.request('https://v1.sstudy.site/api/batches?exam=IIT-JEE&class=11', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://example.com',
    'Access-Control-Request-Method': 'GET'
  }
}, (res) => {
  console.log('OPTIONS statusCode:', res.statusCode);
  console.log('OPTIONS Headers:', res.headers);
  res.on('data', () => {});
  res.on('end', () => console.log('Done'));
});
req.on('error', (e) => console.error(e));
req.end();
