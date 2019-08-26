var CollectionExisted = (collection, callback, fail) => {
    try {
        collection.get({ source: 'server' })
            .then(
                result => {
                    callback(!result.empty);
                },
                err => {
                    fail(err);
                }
            );
    } catch (e) {
        console.log(`CollectionExisted Error: ${e}`);
    }
}

var GetRecords = (collection, callback, fail, orderByField = '') => {
    try {
        var query = null;
        if (orderByField) {
            query = collection.orderBy(orderByField).get({ source: 'server' });
        } else {
            query = collection.get({ source: 'server' });
        }
        query.then(
            result => {
                callback(result);
            },
            err => {
                fail(err);
            }
        );
    } catch (e) {
        console.log(`GetRecords Error: ${e}`);
    }
}

var InsertData = (collection, data, callback, fail) => {
    try {
        collection.add(data)
            .then(
                result => {
                    callback(result);
                },
                err => {
                    fail(err);
                }
            );
    } catch (e) {
        console.log(`InsertData Error: ${e}`);
    }
}

var ListenToChangesByField = (collection, field, valudOfField, callback, fieldNameOfTime = '', lastTime = null) => {
    try {
        var query = collection.where(field, '==', valudOfField);
        if (fieldNameOfTime && lastTime) {
            query = query.where(fieldNameOfTime, '>', lastTime);
        }
        query.onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(ele => {
                callback(ele);
            });
        });
    } catch (e) {
        console.log(`ListenToChangesByField Error: ${e}`);
    }
}