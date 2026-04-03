const https = require('https');

https.get('https://v1.sstudy.site/api/batches?exam=IIT-JEE&class=12%2B', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('IIT-JEE 12+:', data.substring(0, 100)));
});
