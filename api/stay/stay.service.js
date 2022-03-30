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
    // if (filterBy.type) {
    //     criteria.roomType = { $eq: 'Private room' }
    // }
    // console.log('criteria', criteria)
    // , { 'roomType': filterBy.type }
    // criteria.$or.push({ 'roomType': 'Entire home/apt' });
    // console.log(criteria)
    // if (filterBy.type) {
    //     filterBy.type.map(typ =>
    //         criteria.$or = [{ 'roomType': typ }])
    // }
    // console.log('criteria', criteria)

    // console.log(criteria)
    return criteria

}

// function _buildCriteria(filterBy) {
//     const criteria = {}
//     if (filterBy.txt) {
//         const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
//         criteria.$or = [{
//                 username: txtCriteria
//             },
//             {
//                 fullname: txtCriteria
//             }
//         ]
//     }

//     return criteria
// }



// function _buildCriteria(filterBy) {
//     const criteria = {}

//     if (filterBy.name) {
//         criteria.name = { $regex: filterBy.name, $options: 'i' }
//     }
//     if (filterBy.inStock) {
//         const inStock = filterBy.inStock === 'true' ? true : false
//         criteria.inStock = { $eq: inStock }
//     }
//     if (filterBy.labels && filterBy.labels.length) {
//         criteria.labels = { $in: filterBy.labels }
//             // criteria.labels = { $all: filterBy.labels }
//     }
//     return criteria
// }
// function _sort(toys, sortBy){
//     if(!sortBy) return

//     switch(sortBy){
//         case 'time':
//             toys.sort((t1, t2) => t1.createdAt - t2.createdAt)
//             break
//         case 'name':
//             toys.sort((t1, t2) => t1.name.localeCompare(t2.name))
//             break
//         case 'price':
//             toys.sort((t1, t2) => t1.price - t2.price)
//             break
//     }
// }


// function _sortQueriedArray(queriedArray, { sortBy }) {
//     if (sortBy === "name") {
//         return queriedArray.sort(function (a, b) {
//             const nameA = a.name.toUpperCase();
//             const nameB = b.name.toUpperCase();
//             if (nameA < nameB) {
//                 return -1;
//             }
//             if (nameA > nameB) {
//                 return 1;
//             }
//             return 0;
//         });
//     } else if (sortBy === "created") {
//         return queriedArray.sort((a, b) => a.createdAt - b.createdAt);
//     } else if ((sortBy === "price")) {
//         return queriedArray.sort((a, b) => b.price - a.price);
//     } else {
//         return queriedArray
//     }
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
        await collection.updateOne({ "_id": id }, { $set: {...stay } })
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