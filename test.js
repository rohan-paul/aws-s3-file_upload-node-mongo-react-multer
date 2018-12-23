console.log("Program Start");

var async = require("async");
async.waterfall(
    [
        function(callback) {
            console.log("First Step --> ");
            callback(null, "1", "2");
        },
        function(arg1, arg2, callback) {
            console.log("Second Step --> " + arg1 + " " + arg2);
            callback(null, "3");
        },
        function(arg1, callback) {
            console.log("Third Step --> " + arg1);
            callback(null, "final result");
        }
    ],
    function(err, result) {
        console.log("Main Callback --> " + result);
    }
);

console.log("Program End");
