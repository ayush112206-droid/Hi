const https = require('https');

https.get('https://v1.sstudy.site/api/batches?exam=BOARD%20EXAM&class=12', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('BOARD EXAM 12:', data));
});

https.get('https://v1.sstudy.site/api/batches?exam=BOARD%20EXAMS&class=12', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('BOARD EXAMS 12:', data));
});

https.get('https://v1.sstudy.site/api/batches?exam=Boards&class=12', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Boards 12:', data));
});
