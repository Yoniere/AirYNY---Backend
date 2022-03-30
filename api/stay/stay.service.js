const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const PAGE_SIZE = 50;


async function query(filterBy) {
    try {
        // var criteria = {};
        var criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).toArray();
        var staysByPagination = _staysToShow(stays)
        // const { sortBy } = filterBy
        // stays = _sortQueriedArray(stays, { sortBy })
        return staysByPagination
    } catch (err) {
        console.log('err', err);

        logger.error('cannot find stays', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    let criteria = {};
    // console.log(filterBy)
    if (!filterBy.country && !filterBy.type) return criteria
    if (filterBy.country) {
        const regex = { $regex: filterBy.country, $options: 'i' }
        criteria.$or = [{ 'address.country': regex },
        { 'address.city': regex }
        ]
    }
    if (filterBy.type) {
        criteria.roomType = { $all: filterBy.type }
        console.log('filterBy.type', filterBy.type);
    }
}
// if (filterBy.price) {
//     criteria.price = { $min: filterBy.price }

//     console.log('filterBy.price', filterBy.price);
// }

function _staysToShow(filteredStays) {
    return filteredStays.slice(0, 50)
}



async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ '_id': ObjectId(stayId) })
        return stay
    } catch (err) {
        console.log('err', err);

        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

// async function remove(stayId) {
//     try {
//         const collection = await dbService.getCollection('stay')
//         await collection.deleteOne({ '_id': ObjectId(stayId) })
//         return stayId
//     } catch (err) {
//         logger.error(`cannot remove stay ${stayId}`, err)
//         throw err
//     }
// }

async function add(stay) {
    console.log(stay);
    try {
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        return addedStay
    } catch (err) {
        console.log('err', err);

        logger.error('cannot insert stay', err)
        throw err
    }
}
async function update(stay) {

    try {
        var id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ "_id": id }, { $set: { ...stay } })
        stay._id = id
        return stay
    } catch (err) {
        console.log('err', err);

        logger.error(`cannot update stay ${stayId}`, err)
        throw err
    }
}

module.exports = {
    add,
    query,
    getById,
    update,
}


