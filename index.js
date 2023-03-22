const path = require("path");
const async = require("async");
const newman = require("newman");
const ProgressBar = require('progress');
const iterationCount = 100;
const bar = new ProgressBar(':bar :current/:total', { total: iterationCount });
fs = require("fs");

const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
let results = [];
newman.run({
  collection: path.join(
    __dirname,
    "postman/PruebasEcommerce.postman_collection.json"
  ), // your collection
  environment: path.join(
    __dirname,
    "postman/STAGING .postman_environment.json"
  ), //your env
  reporters: ["htmlextra"],
  iterationCount: iterationCount,
  reporter: { json: { export: "log/response.json" } },
}).on('request', function(err, args) {
  bar.tick();
  if(!err) {
    var rawBody = args.response.stream,
                 body = rawBody.toString();

                results.push(JSON.parse(body));
  }
}).on('done', function(err, summary) {
  console.log('Termino!');
  fs.writeFileSync('./log/ecommers-report.json', JSON.stringify(results, null, 4));
});



