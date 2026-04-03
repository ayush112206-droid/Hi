const https = require('https');

https.get('https://v1.sstudy.site/api/batches', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('ALL:', res.statusCode, data));
});
