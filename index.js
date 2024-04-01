const PORT = process.env.PORT || 8000
const express =  require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const sources = [
  {
    name: 'cnn',
    address: 'https://www.cnn.com/politics',
    base: 'https://www.cnn.com'
  },
  {
    name: 'guardian',
    address: 'https://www.theguardian.com/us-news',
    base: 'https://www.theguardian.com'
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/us/',
    base: "https://www.telegraph.co.uk"
  },
]

const articles = []

app.get('/', (req, res) => {
  res.json('Welcome to my API')
})


sources.forEach((source) => {
  axios.get(source.address)
  .then((response) => {
    const html = response.data
    const $ = cheerio.load(html)

    $('a:contains("Trump")', html).each(function () {
          const title = $(this).text()
        const url = $(this).attr('href')      
        articles.push({
        title,
        url: source.base + url,
        source: source.name
      })
    })    
  })    
})

app.get('/info', (req, res) => { 
    res.json(articles)
    console.log(articles.length);
 })

app.get('/info/:sourceId', (req, res) => {

  const sourceId = req.params.sourceId

  const sourceAddress = sources.filter(source => source.name == sourceId)[0].address
  const base = sources.filter(source => source.name == sourceId)[0].base

  axios.get(sourceAddress)
  .then(response => {
    const html = response.data
    const $ = cheerio.load(html)
    const queriedArticles = []

    $('a:contains("Trump")', html).each(function () {
      const title = $(this).text()
      const url = $(this).attr('href')
      queriedArticles.push({
        title,
        url: base + url,
        source: sourceId
      })
    })

    res.json(queriedArticles)

  }).catch(err => console.log(err))
  
})

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
})