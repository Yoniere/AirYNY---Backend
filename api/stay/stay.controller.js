const stayService = require('./stay.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getStays(req, res) {

    try {

        var queryParams = req.query
        const stays = await stayService.query(queryParams)
            // console.log('stays', stays);
        res.json(stays);

    } catch (err) {

        logger.error('Failed to get stays', err)
        res.status(500).send({ err: 'Failed to get stays' })
    }
}

// GET BY ID 
async function getStayById(req, res) {
    try {
        const stayId = req.params.id;
        const stay = await stayService.getById(stayId)
            // console.log('stay', stay);
        res.json(stay)

    } catch (err) {
        logger.error('Failed to get stay', err)
        res.status(500).send({ err: 'Failed to get stay' })
    }
}

// post(addStay)
// async function addStay(req, res) {
//   try {
//     const Stay = req.body;
//     const addedStay = await StayService.add(Stay)
//     res.json(addedStay)
//   } catch (err) {
//     logger.error('Failed to add Stay', err)
//     res.status(500).send({ err: 'Failed to add Stay' })
//   }
// }

// PUT (Update Stay)
async function updateStay(req, res) {
    try {
        const stay = req.body;
        const updatedStay = await stayService.update(stay)
        res.json(updatedStay)
    } catch (err) {
        logger.error('Failed to update Stay', err)
        res.status(500).send({ err: 'Failed to update Stay' })

    }
}

// DELETE (Remove Stay)
// async function removeStay(req, res) {
//   try {
//     const stayId = req.params.id;
//     const removedId = await stayService.remove(stayId)
//     res.send(removedId)
//   } catch (err) {
//     logger.error('Failed to remove Stay', err)
//     res.status(500).send({ err: 'Failed to remove Stay' })
//   }
// }

module.exports = {
    getStays,
    getStayById,
    // addStay,
    updateStay,
    // removeStay
}