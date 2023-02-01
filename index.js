const path = require("path");
const async = require("async");
const newman = require("newman");
fs = require("fs");
const PARALLEL_RUN_COUNT = 1;
const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
const parametersForTestRun = {
  collection: path.join(
    __dirname,
    "postman/PruebasEcommerce.postman_collection.json"
  ), // your collection
  environment: path.join(
    __dirname,
    "postman/STAGING .postman_environment.json"
  ), //your env
  reporters: ["htmlextra"],
  reporter: {
    htmlextra: {
      export: `log/responses/${date}/response.html`,
      template: "./postman/template.hbs",
      logs: true,
      // showOnlyFails: true,
      // noSyntaxHighlighting: true,
      // testPaging: true,
      // browserTitle: "My Newman report",
      // title: "My Newman Report",
      // titleSize: 4,
      // omitHeaders: true,
      // skipHeaders: "Authorization",
      // omitRequestBodies: true,
      // omitResponseBodies: true,
      // hideRequestBody: ["Login"],
      // hideResponseBody: ["Auth Request"],
      // showEnvironmentData: true,
      // skipEnvironmentVars: ["API_KEY"],
      // showGlobalData: true,
      // skipGlobalVars: ["API_TOKEN"],
      // skipSensitiveData: true,
      // showMarkdownLinks: true,
      // showFolderDescription: true,
      // timezone: "Australia/Sydney",
      // skipFolders: "folder name with space,folderWithoutSpace",
      // skipRequests: "request name with space,requestNameWithoutSpace",
      // displayProgressBar: true
    },
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
    const failures = result.run.failures;
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
          // // // const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
          // const name =
          //   `log/responses/${date}/` +
          //   data.item.name.replace("-", " ").replace(/\s+/g, "_") +
          //   ".json";
          // fs.mkdir(`log/responses/${date}`, { recursive: true }, (err) => {
          //   if (err) throw err;
          //   fs.writeFile(
          //     name,
          //     data.response.stream.toString(),
          //     function (error) {
          //       if (error) {
          //         console.error(error);
          //       }
          //     }
          //   );
          // });
          console.log('exitoso!');
        }
      });
  };
}
