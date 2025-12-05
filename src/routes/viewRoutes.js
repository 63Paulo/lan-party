import { Router } from 'express'
import * as gameService from '../services/gameService.js'
import * as stationService from '../services/stationService.js'
import { gameSchema } from '../schemas/gameSchema.js'
import { stationSchema } from '../schemas/stationSchema.js'
import { validate } from '../middlewares/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// Home page
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [gamesCount, stationsCount] = await Promise.all([
      gameService.count(),
      stationService.count(),
    ])

    res.render('pages/home', {
      gamesCount,
      stationsCount,
    })
  })
)

// ================== GAMES ROUTES ==================

// Games list
router.get(
  '/games',
  asyncHandler(async (req, res) => {
    const games = await gameService.findAllSimple()
    res.render('pages/games/list', { games })
  })
)

// New game form
router.get('/games/new', (req, res) => {
  res.render('pages/games/form', { game: null })
})

// Create game
router.post(
  '/games/new',
  validate(gameSchema),
  asyncHandler(async (req, res) => {
    if (res.locals.errors) {
      return res.render('pages/games/form', {
        game: null,
        errors: res.locals.errors,
        formData: res.locals.formData,
      })
    }

    await gameService.create(req.body)
    res.redirect('/games')
  })
)

// Game detail
router.get(
  '/games/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(404).render('pages/error', {
        title: 'Jeu non trouve',
        message: `ID invalide.`,
      })
    }

    try {
      const game = await gameService.findById(id)
      res.render('pages/games/detail', { game })
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Jeu non trouve',
          message: `Le jeu avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Edit game form
router.get(
  '/games/:id/edit',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const game = await gameService.findById(id)
      res.render('pages/games/form', { game })
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Jeu non trouve',
          message: `Le jeu avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Update game
router.post(
  '/games/:id/edit',
  validate(gameSchema),
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const game = await gameService.findById(id)

      if (res.locals.errors) {
        return res.render('pages/games/form', {
          game,
          errors: res.locals.errors,
          formData: res.locals.formData,
        })
      }

      await gameService.update(id, req.body)
      res.redirect('/games')
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Jeu non trouve',
          message: `Le jeu avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Delete game
router.post(
  '/games/:id/delete',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    await gameService.remove(id)
    res.redirect('/games')
  })
)

// ================== STATIONS ROUTES ==================

// Stations list
router.get(
  '/stations',
  asyncHandler(async (req, res) => {
    const stations = await stationService.findAllSimple()
    res.render('pages/stations/list', { stations })
  })
)

// New station form
router.get('/stations/new', (req, res) => {
  res.render('pages/stations/form', { station: null })
})

// Create station
router.post(
  '/stations/new',
  validate(stationSchema),
  asyncHandler(async (req, res) => {
    if (res.locals.errors) {
      return res.render('pages/stations/form', {
        station: null,
        errors: res.locals.errors,
        formData: res.locals.formData,
      })
    }

    await stationService.create(req.body)
    res.redirect('/stations')
  })
)

// Station detail
router.get(
  '/stations/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(404).render('pages/error', {
        title: 'Station non trouvee',
        message: `ID invalide.`,
      })
    }

    try {
      const station = await stationService.findById(id)
      res.render('pages/stations/detail', { station })
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Station non trouvee',
          message: `La station avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Edit station form
router.get(
  '/stations/:id/edit',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const station = await stationService.findById(id)
      res.render('pages/stations/form', { station })
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Station non trouvee',
          message: `La station avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Update station
router.post(
  '/stations/:id/edit',
  validate(stationSchema),
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const station = await stationService.findById(id)

      if (res.locals.errors) {
        return res.render('pages/stations/form', {
          station,
          errors: res.locals.errors,
          formData: res.locals.formData,
        })
      }

      await stationService.update(id, req.body)
      res.redirect('/stations')
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).render('pages/error', {
          title: 'Station non trouvee',
          message: `La station avec l'ID ${id} n'existe pas.`,
        })
      }
      throw error
    }
  })
)

// Delete station
router.post(
  '/stations/:id/delete',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    await stationService.remove(id)
    res.redirect('/stations')
  })
)

export default router
