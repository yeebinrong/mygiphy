// load libraries
const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

// declare PORT used
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const ENDPOINT = 'https://api.giphy.com/v1/gifs/search'
const API_KEY = process.env.GIPHY_API || ""

// create an instance of express
const app = express()

// configure handlebars
app.engine('hbs',
    handlebars({defaultLayout : 'template.hbs'})
)
app.set('view engine', 'hbs')

// load resources
app.use(express.static('public'))

// middleware routes

// WORKING /SEARCH
// app.get('/search', (req, resp) => {

//     const q = req.query.name

//     try {
//         getGiphy(q, API_KEY)
//             .then(data => {
//                 images = data['data']

//                 resp.status(200)
//                 resp.type('text/html')
//                 resp.render('search',
//                     {
//                         title: 'Search',
//                         name: q,
//                         images
//                     }
//                 )
//             })
//     } catch(e) {
//         console.info('Failed.')
//         console.error("Error : ", e)
//     }
// })

app.get('/search',
    async (req, resp) => {
        const search =req.query['name']
        
        const result = await getGiphy(search, API_KEY)
        const images = result['data']

        resp.status(200)
        resp.render('search',
            {
                title: 'Searching for GIFs',
                name: search,
                images
            }
        )
    }
)

app.get('/', (req, resp) => {
    resp.status(200)
    resp.type('text/html')
    resp.render('homepage',
        {
            title: 'Homepage'
        }
    )
})

// methods 
const getGiphy = async (search, API_KEY) => {
    const URL = withQuery(
        ENDPOINT,
        {
            q: search,
            api_key: API_KEY,
            limit: 12
        }
    )
    //console.info(`URL IS : ${URL}`)
    const result = await fetch(URL)
    try {
        const dataArray = await result.json()
        return dataArray
    } catch (e) {
        console.error('ERROR', e)
        return Promise.reject(e)
    }
}

// Listen for port
if (API_KEY)
    app.listen(PORT, () => {
        console.info(`Application is listening port ${PORT} at ${new Date()}`)
    })
else
    console.error('API_KEY is not set')