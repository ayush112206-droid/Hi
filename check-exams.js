const https = require('https');

https.get('https://v1.sstudy.site/api/exams', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Exams:', res.statusCode, data.substring(0, 100)));
});
