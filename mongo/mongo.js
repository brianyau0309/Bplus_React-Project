const db = new Mongo().getDB("bplus");
db.counters.remove({});

db.counters.insert([
    {
        title: "counter one", created: new Date('2019-08-01'),
        number: 0, lastUpdate: new Date('2019-08-01'), 
    },
    {
        title: "counter two", created: new Date('2019-07-11'),
        number: 9999, lastUpdate: new Date('2019-07-31'),
    },
    {
        title: "counter three", created: new Date('2019-07-21'),
        number: 123, lastUpdate: new Date('2019-08-01'), 
    },
]);

db.counters.createIndex({ created: 1 })
