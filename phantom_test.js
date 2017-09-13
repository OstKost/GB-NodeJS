const phantom = require('phantom')
const async = require('asyncawait/async')
const await = require('asyncawait/await')
const url = 'https://www.gamespot.com/news/';

(async (function() {
  const instance = await (phantom.create())
  const page = await (instance.createPage())
  await (page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url)
  }))

  const status = await (page.open(url))
  if(status === "success") {
    page.render('example.png')
  }
  const content = await (page.property('content'))
  console.log(content)

  await (instance.exit())
}))()