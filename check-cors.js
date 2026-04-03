const https = require('https');

https.get('https://v1.sstudy.site/api/batches?exam=IIT-JEE&class=11', {
  headers: {
    'Origin': 'https://example.com'
  }
}, (res) => {
  console.log('Headers:', res.headers);
});
