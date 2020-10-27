const mongoose = require("mongoose");

const dbURI = `mongodb+srv://my_altas_user:${process.env.ALTAS_PASSWD}@cluster0.p9sgd.mongodb.net/loc8r`;
mongoose.connect(dbURI, { useNewUrlParser: true });

// 데이터베이스 연결
mongoose.connection.on('connected', function () {
    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', function (error) {
    console.log(`Mongoose connection error: ${error}`);
});

mongoose.connection.on('disconnected', function () {
    console.log(`Mongoose disconnected`);
});

process.once('SIGUSR2', function () {
    gracefulShutdonw('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// 데이터베이스 Closing
process.on('SIGINT', function () {
    gracefulShutdonw('app termination', function () {
        process.exit(0);
    });
});

process.on('SIGTERM', function () {
    gracefulShutdonw('Heroku app shutdown', function () {
        process.exit(0);
    });
});


function gracefulShutdonw(msg, callback) {
    mongoose.connection.close(function () {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
}

require('./locations');
