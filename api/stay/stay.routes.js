const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getStays, getStayById, updateStay, addReview } = require('./stay.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getStays)
router.get('/:id', getStayById)
router.post('/')
router.put('/:id', updateStay)
// router.delete('/:id', removeStay)

module.exports = router

// requireAuth, requireAdmin,
// requireAuth, requireAdmin,
// requireAuth, requireAdmin,