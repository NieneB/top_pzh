// Read Synchrously
var fs = require("fs");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var dataset_list = [];
var custom_variable = process.argv.slice(2);
var provincies;
var datum = new Date();

if (custom_variable.length == 0) {
    console.error("Geen parameters ingevoerd! Geef een provincie naam. Een van:     \n provincie-drenthe   \n provincie-gelderland   \n provincie-groningen   \n provincie-noord-brabant   \n provincie-overijssel   \n provincie-utrecht   \n provincie-zuid-holland   \n flevoland-slimmer   \n fries-open-data-platform   \n vereniging-van-zeeuwse-gemeente \n \n \t node dataplatform.nl.js provincie-zuid-holland")
}
else if (custom_variable.length == 1) {
    provincies = [custom_variable[0]];
    // Loop door provincies heen
    for (let i = 0; i < provincies.length; i++) {
        const provincie = provincies[i];
        doRequest(provincie);
    }
};


// var provincies = [

// var organizations = [
//     "binnenlandse-zaken",
//     "cbsderden",
//     "centraal-bureau-voor-de-statistiek",
//     "data-overheid-nl",
//     "dataplatform",
//     "dece",
//     "dien",
//     "geme",
//     "gemeente-arnhem",
//     "gemeente-breda",
//     "nationaal-georegister",
//     "rdw-opendata-rdw-nl",
//     "socialezaken",
//     "twee"
// ]

var themas=[
"bestuur",
"cultuur-en",
"Cultuur en recreatie",
"economie",
"financien",
"huisvesting",
"landbouw",
"migratie-en-integratie",
"natuur-en-milieu",
"Natuur en milieu",
"onderwijs-en-wetenschap",
"openbare",
"recht",
"ruimte-en-infrastructuur",
"Ruimte en infrastructuur",
"sociale-zekerheid",
"verkeer",
"werk",
"zorg-en-gezondheid"
]
// var provincies = ["Drenthe"];


// URL request per provincie
function doRequest(provincie){
    var xhr = new XMLHttpRequest();
    var url = ' https://ckan.dataplatform.nl/api/3/action/package_search?q=organization:' + provincie + '&rows=1000';
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log('\n', provincie , '\n');
            // console.log( myArr)
            dataCrunch(myArr)
        }
        export_file(dataset_list)
    };
    xhr.open("GET", url, true);
    xhr.send();
};

function dataCrunch(data){
    // console.log(data.result.results)
    let datasets = data.result.results;
    for (let i = 0; i < datasets.length; i++) {
        const element = datasets[i];
        // console.log(element)

        dataset_list.push({
            "provincie": element.publisher_uri,
            "theme": element.theme,
            "titel": element.title, 
            "metadata_created": element.metadata_created,
            "meta_modified": element.metadata_modified,
            "metadata_created_date": new Date(element.metadata_created),
            "meta_modified_date": new Date(element.metadata_modified),
            "request_date": new Date()
        });

    };
};



function export_file(data) {
    let csvContent = toCSV(data);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(csvContent);
    var encodedUri = encodeURI(csvContent);
    fs.writeFileSync(provincies + '_data_platform_' + datum + '.csv', csvContent); 
};


function toCSV(json) {
    var csv = "";
    var keys = (json[0] && Object.keys(json[0])) || [];
    var data = Object.values(json);
    csv += keys.join(';') + "\r\n";
    for (var item in json) {
        csv += Object.values(json[item]).join(";") + "\r\n";
    }
    return csv;
}



// function countThemas(jsonContent){
//     var total = 0;
//     var geojson = [];

//     for (let j = 0; j < themas.length; j++) {
//         var summary = [];
//         // console.log(themas[j])
//         summary.push(themas[j]);
//         var count = 0;
//         var count_undefined = 0;
//         for (let i = 0; i < jsonContent.result.results.length; i++) {
//             const dataset = jsonContent.result.results[i];
//             // console.log("title: ", dataset.theme);

//             if (dataset.theme == themas[j]){

//                 ++count;
//             } 
//             else if (dataset.theme == null){
//                 ++count_undefined;
//                 console.log(dataset.theme)
//             };
//         }
//         total += count;
//         summary.push(count);
//         // console.log(summary);
//         geojson.push(summary);
//     }

//     // for (let k  = 0; k  < organizations.length; k ++) {
//     //     const dataset = organizations[k];
//     //     var summary = [];
//     //     // console.log(themas[j])
//     //     summary.push(organizations[k]);
//     //     var count = 0;
//     //     for (let i = 0; i < jsonContent.result.results.length; i++) {
//     //         const dataset = jsonContent.result.results[i];
//     //         if (dataset.organization.name == organizations[k]) {
//     //             ++count;
//     //         }
//     //     }
//     //     summary.push(count);
//     //     console.log(summary);
//     //     geojson.push(summary);
        
//     // }
    
//     console.log('Your query count: ' + jsonContent.result.count);
//     console.log("total themes: ", total);
//     // console.log("total themes undefined: ", count_undefined);
//     // console.log("total: ", count_undefined + total);
//     return geojson;
// }


// // function count(obj , prop){
// //     var count = 0;
// //     for (var prop in obj){
// //         if (obj.hasOwnProperty(prop)){
// //             ++count;
// //         }
// //     }
// //     return count;
// // }

// // // Console log data van de datsets per provincie
// // function myFunction(jsonContent){
// //     console.log('Your query count: ' + jsonContent.result.count);
// //     for (let i = 0; i < jsonContent.result.results.length; i++) {
// //         const element = jsonContent.result.results[i];
// //         console.log("\n");
// //         console.log("DATASET ", i , "\n");
// //         console.log("title: ", element.title);
// //         console.log("maintainer: ", element.maintainer);
// //         console.log("theme_displayname: ", element.theme_displayname);
// //         console.log("dataset_quality: ", element.dataset_quality);
// //         console.log("name: ", element.name);
// //         console.log("Bron: ", element.organization.name);
// //     }
// // };

// // console.log("\n *EXIT* \n");
