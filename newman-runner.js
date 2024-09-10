const path = require('path');
const async = require('async');
const newman = require('newman');

const PARALLEL_RUN_COUNT = 1;

const collections = [   
    'collections/BusinessOwnerAuth-Murtaza.postman_collection.json',
    'collections/SuperAdminRole&Permission-Rizwan.postman_collection.json'
    // 'collections/SuperAdminAuth.postman_collection.json',
    // 'collections/second.postman_collection.json',
    // 'collections/third.postman_collection.json'
]

const environments = [
    'environments/PatientQ-QA.postman_environment.json'
    // 'environments/PatientQ-Dev.postman_environment.json',
    // 'environments/stg.postman_environment.json'
];

const environment = environments[0];
const collectionToRun = [];

for (let index = 0; index < collections.length; index++) {

    const collectionName = path.basename(collections[index], '.postman_collection.json');  // Extracts the collection name without extension
    
    collectionToRun[index] = {
        collection: path.join(__dirname, collections[index]),
        // iterationData:path.join(__dirname, '.json'),
        environment: path.join(__dirname, environment), 
        // reporters: ['cli','htmlextra','junit'],
        reporters:['cli','htmlextra'],
        bail: newman,
        reporter:
        {
            htmlextra: {
                export: `newman/report_${collectionName}.html`,
                title: 'API Test Report',
                inlineAssets: true
        }    
        }
    };
};

parallelCollectionRun = function (done) {
    for (let index=0; index < collectionToRun.length; index++){
        newman.run(collectionToRun[index], 
            function (err) {
                if (err) { throw err; }
                console.log(collections[index]+' collection run complete!');
            });
    }
    done;
};

let commands = [];
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
    commands.push(parallelCollectionRun);
};

async.parallel(
    commands,
    (err, results) => {
        err && console.error(err);
        results.forEach(function (result) {
            var failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                `${result.collection.name} ran successfully.`);
    });
});