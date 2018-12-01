const rp = require("request-promise")
const $ = require("cheerio")
const fs = require("fs")
const base = "https://travel.usnews.com"
const options = {
  uri: base + "/rankings/worlds-best-vacations/",
  headers: {
    "cookie": "ak_bmsc=3BA277CEB703615A2E3FD26A43548DF1174FFFADA73E00007CC2015C3AAAED07~pl8Bl30dKOfplOEmr7CA6+K0TziT1BrN37kqsf9lzCD3E3z6+SJONA4CKNzoMug2AubbVSeMR/cUXqUKn/NriQnepj8hDIYJi7QMBnx/zCDnTJx4GjVs1b9zIIFjZWYc+gMeyYPzlVdITX5swvLJN4yutJZX2i82Xl10yFnufEEG58AZ7rY7QYS7rQGHp84h/o+x0rRNjeAX4Q8IxZiP47dS4y5+aT0Msu/5Cg3jmlpNc=",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36",
  }
}
const destinations = []

const parseDestPage = (i, dest) => {
  options.uri = base + dest.link
  return rp(options).then(html => {
    let subtitle = $('p.block-normal.block-flush-for-medium-up.hero-ranking-data-rank', html).text().trim().replace(/(\r\n\t|\n|\r\t)/gm,"").replace(/\s+/g, " ")
    let description = $('#overview-section div.jquery-collapser', html).text()
    let monthsToVisit = $('#when-to-visit-section p', html).text()
    let cultureCustoms = $('#culture-and-customs-section div.jquery-collapser', html).text()
    let whatToEat = $('#what-to-eat-section div.jquery-collapser', html).text()
    destinations[i] = {
      ...dest,
      subtitle,
      image,
      description,
      monthsToVisit,
      cultureCustoms
    }
  })
}

rp(options)
.then(html => {
  let i = 0
  let destinationTitles = $('a.ranking-name', html)
  let numDestinations = destinationTitles.length

  /* Get all destination links */
  for (i = 0; i < numDestinations; i++) {
    let destination = destinationTitles[i]
    destinations.push({
      "title": destination.children[0].data,
      "link": destination.attribs.href
    })
  }

  /* Get details for each destination */
  let promises = []
  for (i = 0; i < numDestinations; i++) {
    promises.push(parseDestPage(i, destinations[i]))
  }
  Promise.all(promises)
  .then(() => {
    console.log("got destinations...")
    fs.writeFile("destinations.json", JSON.stringify(destinations), error => {
      if (error) {
        console.log(error)
        console.log("error :(")
      } else {
        console.log("wrote to file!")
      }
    })
  }).catch(error => {
    console.log(error)
    console.log("error :(")
  })
}).catch(error => {
  console.log(error)
  console.log("error :(")
})
