const path = require("path");
const async = require("async");
const newman = require("newman");

const PARALLEL_RUN_COUNT = 1;

const parametersForTestRun = {
  collection: path.join(
    __dirname,
    "postman/CSP Core_WCF.postman_collection.json"
  ), // your collection
  environment: path.join(
    __dirname,
    "postman/Dev-Server-Local.postman_environment.json"
  ), //your env
  iterationCount: 1,
  reporters: "cli",
};

parallelCollectionRun = function (done) {
  newman.run(parametersForTestRun, done);
};

let commands = [];
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
  commands.push(parallelCollectionRun);
}

// Runs the Postman sample collection thrice, in parallel.
async.parallel(commands, (err, results) => {
  err && console.error(err);

  console.log('Results => ',results)

  results.forEach(function (result) {
    var failures = result.run.failures;
    var executions = JSON.stringify(result.run.executions);
    console.log("executions =>", executions);
    // console.info(
    //   failures.length
    //     ? JSON.stringify(failures.failures, null, 2)
    //     : `${result.collection.name} ran successfully.`
    // );
  });
});
