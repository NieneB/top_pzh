// Read Synchrously
var fs = require("fs");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var d3 = require("d3");
var dataset_list = [];
var count = 1;
var provincies;
var custom_variable = process.argv.slice(2);
var datum = new Date();

if (custom_variable.length == 0 ){
    console.error("Geen parameters ingevoerd!")
    console.log("\nDraai het script met een Provincie naam en een Attribuut. \n\n \tnode data.overheid.nl_samenvatting.js [provincie] [attribuut]\n\n Wil je alle provincies of alle attributen voer dan in : \n  \n\tnode data.overheid.nl_samenvatting.js all all\n");
} 
else if (custom_variable.length == 1){
    console.error("Twee parameters nodig!")
    console.log("\nDraai het script met een Provincie naam en een Attribuut. \n\n \tnode data.overheid.nl_samenvatting.js [provincie] [attribuut]\n\n Wil je alle provincies of alle attributen voer dan in : \n  \n\tnode data.overheid.nl_samenvatting.js all all\n");
}
else if (custom_variable.length ==  3 && custom_variable[2] == 'export'){
    console.error("export")
    if (custom_variable[0] == 'all') {
        provincies = ["Noord-Brabant", "Zuid-Holland", "Provincie_Groningen", "Provincie_Utrecht", "Gelderland", "Noord-Holland", "Flevoland", "Drenthe", "Fryslan", "Limburg", "Zeeland", "Overijssel"];
        perProvince(provincies);
    }
    else {
        provincies = [custom_variable[0]]
        perProvince(provincies);
    }
} 
else if (custom_variable.length >= 3) {
    console.error("Teveel parameters ingevoerd!")
    console.log("\nDraai het script met een Provincie naam en een Attribuut. \n\n \tnode data.overheid.nl_samenvatting.js [provincie] [attribuut]\n\n Wil je alle provincies of alle attributen voer dan in : \n  \n\tnode data.overheid.nl_samenvatting.js all all\n");
} 


function perProvince(provincies) {
    provincies.forEach((provincie) => {
        doRequest(provincie);
    });
}

// URL request per provincie
function doRequest(provincie) {
    var xhr = new XMLHttpRequest();
    var url = 'https://data.overheid.nl/data/api/3/action/package_search?q=maintainer:' + provincie + '&rows=1000';
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            if (myArr.result.count == 0){
                console.log("Dit is geen provincie")
            }
            else{ 
                ProvinceDataset(myArr, provincie);
                count++;
            }
        } 
    };
    xhr.open("GET", url, true);
    xhr.send();
};

// Make dataset list from all provinces
function ProvinceDataset(arr, provincie) {
    var datasets = arr.result.results;
    console.log("informatie " + provincie + " wordt opgehaald...");
    // console.log(count)
    // Per provincie, per dataset data ophalen
    for (let i = 0; i < datasets.length; i++) {
        const element = datasets[i];
        dataset_list.push({
            "provincie": provincie, "theme_url": element.theme, "theme": element.theme_displayname, "name": element.name, "titel": element.title, "source": element.source,
            "dataset_quality": element.dataset_quality,
            "metadata_created": element.metadata_created,
            "meta_modified": element.metadata_modified,
            "modified": element.modified,
            "metadata_created_date": new Date(element.metadata_created),
            "meta_modified_date": new Date(element.metadata_modified),
            "modified_date": new Date(element.modified),
            "request_date": new Date()
        });
    }
    // Fire next function when done with all provincies
    if (count == provincies.length) {
        export_file(dataset_list);

        if( custom_variable[1]== 'all'){
            getTotalOverview();
            getThemaOverview();

        }
        else if (custom_variable[1] == 'total' ){
            getTotalOverview();
        }
        else if (custom_variable[1] == 'thema'){
            getThemaOverview();

        }
        
    };
};

function getTotalOverview(){
    var datasetsPerProvince = d3.nest()
        .key(function (d) { return d.provincie; })
        .rollup(function (leaves) { return leaves.length })
        .entries(dataset_list)
        .sort(function (a, b) {
            return new Date(b.metadata_created_date) - new Date(a.metadata_created_date);
        });
    console.log('\n Totaal aantal datsets: \n', datasetsPerProvince);
};

function getThemaOverview(){
    var datasetsPerProvincieThema = d3.nest()
        .key(function (d) { return d.provincie; })
        .key(function (d) { return d.theme; })
        .rollup(function (leaves) { return leaves.length })
        .entries(dataset_list)
        .sort(function (a, b) { return d3.descending(a.values.length, b.values.length); });

    for (let i = 0; i < datasetsPerProvincieThema.length; i++) {
        const element = datasetsPerProvincieThema[i];
        console.log("\n");
        console.log("Provincie: ", element.key);
        console.log("themas: \n", element.values);
    };

};




// URL request per provincie
// function doRequest(provincie){
//     var xhr = new XMLHttpRequest();
//     var url = 'https://data.overheid.nl/data/api/3/action/package_search?q=maintainer:' + provincie + '&rows=1000';
//     xhr.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             var myArr = JSON.parse(this.responseText);
//             console.log('\n', provincie , '\n');

//             var datasets = myArr.result.results;
//             // Per provincie, per dataset data ophalen
//             var dataset_list = [];
//             dataset_list.push(["Provincie", "Theme","Theme2","Name","Titel","Source", "High_Value_dataset","Created", "Modified", "APIrequest"])
//             for (let i = 0; i < datasets.length; i ++) {
//                 const element = datasets[i];
//                 dataset_list.push([provincie, element.theme, element.theme_displayname, element.name, element.title, element.source, element.high_value_dataset, element.metadata_created, element.metadata_modified, new Date()]);
//             }
       
//     //    console.log(dataset_list);

//         let csvContent = "";
//         dataset_list.forEach(function (rowArray) {
//             let row = rowArray.join(";");
//             csvContent += row + "\r\n";
//         });
//         // let data = JSON.stringify(geojson);
//         var encodedUri = encodeURI(csvContent);
//         // window.open(encodedUri);
//         fs.writeFileSync('data/dataset_lijst'+ provincie+ '.csv', csvContent); 
//         }
//     };
//     xhr.open("GET", url, true);
//     xhr.send();
// };


// function countThemas(jsonContent){
//     var total = 0;
//     var geojson = [];

    // for (let j = 0; j < themas.length; j++) {
    //     var summary = [];
    //     // console.log(themas[j])
    //     summary.push(themas[j]);
    //     var count = 0;
    //     var count_undefined = 0;
    //     for (let i = 0; i < jsonContent.result.results.length; i++) {
    //         const dataset = jsonContent.result.results[i];
    //         if (dataset.theme == "http://standaarden.overheid.nl/owms/terms/"+themas[j]){
    //             ++count;
    //         } 
    //         else if (dataset.theme == null){
    //             ++count_undefined;
    //             // console.log(dataset.theme)
    //         };
    //         // console.log("title: ", dataset.title);
    //     }
    //     total += count;
    //     summary.push(count);
    //     // console.log(summary);
    //     geojson.push(summary);
    // }

//     for (let k  = 0; k  < organizations.length; k ++) {
//         const dataset = organizations[k];
//         var summary = [];
//         // console.log(themas[j])
//         summary.push(organizations[k]);
//         var count = 0;
//         for (let i = 0; i < jsonContent.result.results.length; i++) {
//             const dataset = jsonContent.result.results[i];
//             if (dataset.organization.name == organizations[k]) {
//                 ++count;
//             }
//         }
//         summary.push(count);
//         console.log(summary);
//         geojson.push(summary);
        
//     }
    
//     console.log('Your query count: ' + jsonContent.result.count);
//     console.log("total themes: ", total);
//     // console.log("total themes undefined: ", count_undefined);
//     // console.log("total: ", count_undefined + total);
//     return geojson;
// }


// function count(obj , prop){
//     var count = 0;
//     for (var prop in obj){
//         if (obj.hasOwnProperty(prop)){
//             ++count;
//         }
//     }
//     return count;
// }

// // Console log data van de datsets per provincie
// function myFunction(jsonContent){
//     console.log('Your query count: ' + jsonContent.result.count);
//     for (let i = 0; i < jsonContent.result.results.length; i++) {
//         const element = jsonContent.result.results[i];
//         console.log("\n");
//         console.log("DATASET ", i , "\n");
//         console.log("title: ", element.title);
//         console.log("maintainer: ", element.maintainer);
//         console.log("theme_displayname: ", element.theme_displayname);
//         console.log("dataset_quality: ", element.dataset_quality);
//         console.log("name: ", element.name);
//         console.log("Bron: ", element.organization.name);
//     }
// };

function export_file(data) {
    let csvContent = toCSV(data);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(csvContent);
    var encodedUri = encodeURI(csvContent);
    fs.writeFileSync(provincies + '_data.overheid.nl_' + datum + '.csv', csvContent);
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
