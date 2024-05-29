const PORT = process.env.PORT || 8000
const express =  require('express')
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const Twilio = require('twilio');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const twilioClient = new Twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

const theatre = [
  // {
  //   name: 'cnn',
  //   address: 'https://www.cnn.com/politics',
  //   base: 'https://www.cnn.com'
  // },
  // {
  //   name: 'guardian',
  //   address: 'https://www.theguardian.com/us-news',
  //   base: 'https://www.theguardian.com'
  // },
  // {
  //   name: 'telegraph',
  //   address: 'https://www.telegraph.co.uk/us/',
  //   base: "https://www.telegraph.co.uk"
  // },
  {
    name: 'steinbach-theatre',
    address: 'https://keystonecinema.net/',
    base: 'https://keystonecinema.net/',
  },
];

const showtimes = [];

app.get('/', (req, res) => {
  res.json('Welcome to my API');
});

theatre.forEach((source) => {
  axios
    .get(source.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const localShowtimes = []; // We use a local variable to store the showtimes for this source.

      // Extract movie titles as before (if this part is still needed).
      $('div.et_pb_text_inner h2 span').each(function () {
        const title = $(this).text();
        localShowtimes.push({
          title,
          isUpcoming: false,
        });
      });

      // Extract titles, runtime, and showtimes for each movie.
      $('.ws_movie').each(function () {
        const title = $(this).find('h2').text();
        const runtime = $(this).find('.ws_runtime').text(); // Ensure correct class selector usage
        const showtimesInfo = $(this).find('.ws_showtimes').text();

        localShowtimes.push({
          title,
          runtime,
          showtimes: showtimesInfo,
          isUpcoming: true,
        });
      });

      // Append items from localShowtimes to the global showtimes array without reassignment
      showtimes.push(...localShowtimes);
    })
    .catch((err) => console.log(err));
});

app.get('/info', (req, res) => {
  res.json(showtimes);
  console.log(showtimes.length);
});

app.post('/reminder/', async (req, res) => {
  const { phone, movieId } = req.body;
  const dates = showtimes[movieId].showtimes.replace('Showtimes: ', '').trimEnd();
  let trimmedDates = dates.split(',')

  res.json({ phone: phone, movie: showtimes[movieId], dates: dates, trimmedDates: trimmedDates });

});
  // try {
  //   const message = await twilioClient.messages.create({
  //     body: `Reminder: Your movie '${showDetails.title}' is playing soon on ${showDetails.date} at ${showDetails.time}`,
  //     to: phone,
  //     from: '+12565705965',
  //     sendAt: new Date(Date.UTC())
  //   })
  //   res.send({ success: true, message: 'Reminder set successfully!' })
  // } catch (err) {
  //   console.error(err)
  //   res.status(500).send({ success: false, message: 'Failed to set reminder' })
  // }
// });

// app.get('/info/:sourceId', (req, res) => {

//   const sourceId = req.params.sourceId

//   const sourceAddress = sources.filter(source => source.name == sourceId)[0].address
//   const base = sources.filter(source => source.name == sourceId)[0].base

//   axios.get(sourceAddress)
//   .then(response => {
//     const html = response.data
//     const $ = cheerio.load(html)
//     const queriedArticles = []

//     $('a:contains("Election")', html).each(function () {
//       const title = $(this).text()
//       const url = $(this).attr('href')
//       queriedArticles.push({
//         title,
//         url: base + url,
//         source: sourceId
//       })
//     })

//     res.json(queriedArticles)

//   }).catch(err => console.log(err))
  
// })

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
})