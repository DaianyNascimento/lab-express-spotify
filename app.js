require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const PORT = 3000;

const app = express();
app.set('view engine', 'hbs');
//app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/artist-search', (req, res) => {
    //console.log(req.query);
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            const [firstArtistFound] = data.body.artists;

            res.render("artist-search-results", {
                name: firstArtistFound.name,
                imgUrl: firstArtistFound.images,
            });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get("/", (req, res) => {
    res.render("layout", { pageTitle: "Home - Daify" });
});

app.listen(PORT, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
