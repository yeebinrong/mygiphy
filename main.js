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

//     getGiphy(q, API_KEY)
//         .then(data => {
//             images = data['data']

//             resp.status(200)
//             resp.type('text/html')
//             resp.render('search',
//                 {
//                     title: 'Search',
//                     name: q,
//                     images
//                 }
//             )
//         })
//         .catch(e => {
//             console.info('Failed.')
//             console.error("Error : ", e)
//         })
// })

app.get('/search',
    async (req, resp) => {
        const search = req.query['name']
        
        try {
            // attempt async function to retrieve data from GIPHY API
            const result = await getGiphy(search, API_KEY)
            const images = result['data']

            // render the webpage 'search' with the following string keys
            resp.status(200)
            resp.render('search',
                {
                    title: 'Searching for GIFs',
                    name: search,
                    images,
                    hasContent: images.length
                }
            )
        } catch (e) {
            console.error('search ERROR : ', e, '(Check your API key)')
        }
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

// ##METHODS##
// async function to retrieve data from GIPHY API
const getGiphy = async (search, API_KEY) => {
    // using withQuery to generate URL with endpoint and query strings
    const URL = withQuery(
        ENDPOINT,
        {
            q: search,
            api_key: API_KEY,
            limit: '12'
        }
    )

    try {
        // attempt to fetch data from URL
        const result = await fetch(URL)
        // check if the result fetched is OK 200
        if (result.status == 200)
        {
            // attempt to convert result into json
            const dataArray = await result.json()
            return Promise.resolve(dataArray)
        }
        else
        {
            // rejects if the data fetched is !OK
            return Promise.reject(result.statusText)
        }
    } 
    // catch if any error occurs in fetching data from URL
    catch (e) {
        console.error('fetch ERROR : ', e)
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