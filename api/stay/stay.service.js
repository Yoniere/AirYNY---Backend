const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId


async function query(filterBy) {
    // console.log('criteria', filterBy)
    try {
        const criteria = _buildCriteria(filterBy)
        // const criteria = {}

        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).toArray()
        if (filterBy.sortBy) {
            if (filterBy.sortBy === 'time')
                stays = stays.sort((t1, t2) => t1.createdAt - t2.createdAt);
            else if (filterBy.sortBy === 'price')
                stays = stays.sort((t1, t2) => t1.price - t2.price);
            else if (filterBy.sortBy === 'name') {
                // collection.find().sort({ name: 1 });
                stays = stays.sort((t1, t2) => {
                    return t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1;
                });
            }
        }

        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    const criteria = {};
    //filter by name
    if (filterBy.name) {
        const regex = new RegExp(filterBy.name, 'i');
        criteria.name = { $regex: regex };
    }

    // filter by inStock
    if (filterBy.inStock) {
        let inStock = JSON.parse(filterBy.inStock);
        criteria.inStock = { $eq: inStock };
    }
    if (filterBy.labels && filterBy.labels.length) {
        criteria.labels = { $in: filterBy.labels };
    }
    return criteria;
}



async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ '_id': ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ '_id': ObjectId(stayId) })
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    console.log(stay);
    try {
        const collection = await dbService.getCollection('stay')
        const addedstay = await collection.insertOne(stay)
        return addedstay
    } catch (err) {
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
        logger.error(`cannot update stay ${stayId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}



// async function query(filterBy) {

//     try {
//         // logger.info('JSON.parse(filterBy)', JSON.parse(filterBy));
//         const criteria = _buildCriteria(filterBy)
//         logger.info('criteria', criteria)
//         // const criteria = {}
//         // logger.info('filterBy', filterBy)

//         const collection = await dbService.getCollection('stay')
//         var toys = await collection.find(criteria).toArray()
//         return toys
//     } catch (err) {
//         logger.error('cannot find toys', err)
//         throw err
//     }
// }


// function _buildCriteria(filterBy) {
//     const criteria = {}

//     if (filterBy.name) {
//         criteria.name = { $regex: filterBy.name, $options: 'i' }

//         // const regex = new RegExp(filterBy.name, 'i')
//         // criteria.name = { $regex: regex }
//     }
//     // if (filterBy.inStock) {
//     //     // criteria.inStock = inStock
//     //     criteria.inStock = { $regex: filterBy.inStock, inStock === "true"
//     // }


//     // if (filterBy.labels.length) {
//     // criteria.labels = labels
//     // criteria.balance = { $gte: filterBy.minBalance }
//     // }

//     console.log('criteria', criteria);
//     return criteria
// }