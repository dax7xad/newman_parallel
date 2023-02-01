const path = require("path");
const newman = require("newman");
const fs = require("fs");

let results = [];
let requestCount = 0;

newman.run({
  collection: path.join(
    __dirname,
    "postman/PruebasEcommerce.postman_collection.json"
  ),
  environment: path.join(
    __dirname,
    "postman/STAGING .postman_environment.json"
  ),
  reporters: ["json"],
  iterationCount: 10,
  reporter: { json: { export: "log/response.json" } },
})
  .on("request", function(err, args) {
    if (!err) {
      console.log(`Request ${args.item.id} completed.`);
      var rawBody = args.response.stream,
        body = rawBody.toString();
      results.push(JSON.parse(body));
    }
  })
  .on("done", function(err, summary) {
    console.log("\nTermino!");
    fs.writeFileSync("./log/ecommers-report.json", JSON.stringify(results, null, 4));
  });
