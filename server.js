const express = require('express')
const cors = require('cors')
const path = require('path')
const expressSession = require('express-session')

const app = express()
const http = require('http').createServer(app)

const session = expressSession({
    secret: 'coding is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
app.use(express.json())
app.use(session)


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

// routes
const stayRoutes = require('./api/stay/stay.routes')
const userRoutes = require('./api/user/user.routes')
const reviewRoutes = require('./api/review/review.routes')

app.use('/api/user', userRoutes)
app.use('/api/stay', stayRoutes)
app.use('/api/review', reviewRoutes)

// connectSockets(http, session)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
console.log('logger', logger);
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})

// app.listen(3030,
//     () => console.log('Server listening on port 3030'))
