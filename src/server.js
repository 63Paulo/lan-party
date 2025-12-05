import express from 'express'
import session from 'express-session'
import chalk from 'chalk'
import swaggerUi from 'swagger-ui-express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { env } from './config/env.js'
import prisma from './config/prisma.js'
import apiRoutes from './routes/index.js'
import viewRoutes from './routes/viewRoutes.js'
import viewAuthRoutes from './routes/viewAuthRoutes.js'
import viewAdminRoutes from './routes/viewAdminRoutes.js'
import { swaggerSpec } from './config/swagger.js'
import { icon } from './utils/icons.js'
import { logger } from './middlewares/logger.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Configure EJS as view engine
app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'views'))

// Make icon helper available in all templates
app.locals.icon = icon

// Serve static files
app.use(express.static(join(__dirname, 'public')))

// Verify database connection on startup
async function initServer() {
  try {
    const gamesCount = await prisma.game.count()
    const stationsCount = await prisma.station.count()
    const usersCount = await prisma.user.count()
    console.log(
      chalk.green(
        `Database connected: ${gamesCount} games, ${stationsCount} stations, ${usersCount} users`
      )
    )
  } catch (error) {
    console.error(chalk.red('Failed to connect to database:'), error.message)
    throw error
  }
}

// Logging middleware (must be first)
app.use(logger)

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session middleware
app.use(
  session({
    secret: env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
)

// Make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null
  next()
})

// View routes (HTML pages)
app.use('/auth', viewAuthRoutes)
app.use('/admin', viewAdminRoutes)
app.use('/', viewRoutes)

// API routes
app.use('/api', apiRoutes)

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 404 handler (after all routes)
app.use(notFound)

// Error handler (must be last)
app.use(errorHandler)

// Start server
app.listen(env.PORT, async () => {
  await initServer()
  console.log(chalk.cyan(`\nMode: ${env.NODE_ENV}`))
  console.log(chalk.cyan(`Server started on http://localhost:${env.PORT}\n`))
})
