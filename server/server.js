require('dotenv')
const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const cors = require('cors')
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder')
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })

spotifyApi.refreshAccessToken().then(
    (data) => {
      res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn
      })
    }).catch((err) => {
        console.log(err)
        res.sendStatus(400)

    })

})


app.post('/login', (req,res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'b66406414e19439e8f6e32f9d06f1dcb',
        clientSecret: '015b8ae9706c4b3ba219489c9a8f9c96',
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch(() => {
        res.sendStatus(400)
    })
})

app.get('/lyrics', async(req,res) => {
    const lyrics = (await lyricsFinder(req.query.artist, req.query.track) ) || "No Lyrics Found"
    res.json({lyrics})
})

app.listen(3001)