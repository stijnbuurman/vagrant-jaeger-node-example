var initTracer = require('jaeger-client').initTracer;

var logger = {
    info: function (text) {
        console.log(text);
    },
    error: function (error) {
        console.log(error);
    }
};

// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
var config = {
    serviceName: 'my-awesome-service',
    reporter: {
        collectorEndpoint: 'http://localhost:14268/api/traces',
    },
    sampler: {
        type: "const",
        param: 1.0
    }
};
var options = {
    tags: {
        'my-awesome-service.version': '1.1.2',
    },
    logger: logger,
};
var tracer = initTracer(config, options);

function randomTimeout() {
    return Math.floor(Math.random() * Math.floor(5000));
}

function createRandomSpan(tracer, actionName) {
    return new Promise((resolve, reject) => {
        const randTimeout1 = randomTimeout();
        const randTimeout2 = randomTimeout();

        const span = tracer.startSpan(actionName);

        setTimeout(() => {
            span.setTag('type', 'timeout');
            const childSpan = tracer.startSpan('DB query', {childOf: span});
            setTimeout(() => {
                childSpan.log({timeout: randTimeout1 + randTimeout2});
                childSpan.finish();
                span.finish();
                resolve();
            }, randTimeout2);
        }, randTimeout1);
    });
}

function randomSpanBatch(tracer) {
    let promises = [];
    for (let i = 0; i < 5; i++) {
        promises.push(createRandomSpan(tracer, 'Create a user'));
        promises.push(createRandomSpan(tracer, 'Create a webpage'));
    }

    return Promise.all(promises);
}


function infiniteRandomSpans(tracer) {
    return randomSpanBatch(tracer).then(() => infiniteRandomSpans(tracer));
}

infiniteRandomSpans(tracer);








