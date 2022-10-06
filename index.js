const path = require("path");
const async = require("async");
const newman = require("newman");
fs = require("fs");
const PARALLEL_RUN_COUNT = 1;
const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
const parametersForTestRun = {
  collection: path.join(
    __dirname,
    "postman/CryptoManagement.postman_collection.json"
  ), // your collection
  environment: path.join(
    __dirname,
    "postman/Dev-Server-Local.postman_environment.json"
  ), //your env
  reporters: ["htmlextra"],
  reporter: {
    htmlextra: { export: `log/responses/${date}/response.html` },
  },
};

parallelCollectionRun = newmanWorkflow();

let commands = [];
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
  commands.push(parallelCollectionRun);
}

// Runs the Postman sample collection thrice, in parallel.
async.parallel(commands, (err, results) => {
  err && console.error(err);

  results.forEach(function (result) {
    var failures = result.run.failures;
    // var executions = result.run.executions;
    // console.log("executions =>", executions[0].response.stream.toString());
    console.info(
      failures.length
        ? JSON.stringify(failures.failures, null, 2)
        : `${result.collection.name} ran successfully.`
    );
  });
});

function newmanWorkflow() {
  return (done) => {
    newman
      .run(parametersForTestRun, done)
      .on("request", function (error, data) {
        if (error) {
          console.error(error);
        } else {
          const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
          const name =
            `log/responses/${date}/` +
            data.item.name.replace("-", " ").replace(/\s+/g, "_") +
            ".json";

          
          fs.mkdir(`log/responses/${date}`, { recursive: true }, (err) => {
            if (err) throw err;

            fs.writeFile(
              name,
              data.response.stream.toString(),
              function (error) {
                if (error) {
                  console.error(error);
                }
              }
            );
          });
        }
      });
  };
}
