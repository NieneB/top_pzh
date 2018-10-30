var fs = require("fs");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var dataset_list = [];
var custom_variable = process.argv.slice(2);
var provincies;
var datum = new Date();


if (custom_variable.length == 0) {
    console.error("Geen parameters ingevoerd! Geef een provincie naam. Bijvoorbeeld: \n provinciegroningen \n zuid-holland \n \n \t node arcgis_services.js zuid-holland")
}
else if (custom_variable.length == 1 && custom_variable[0] == "all") {
    provincies = ["Noord-Brabant", "Zuid-Holland", "Groningen", "Utrecht", "Gelderland", "Noord-Holland", "Flevoland", "Drenthe", "Frysl%C3%A2n", "Limburg", "Zeeland", "Overijssel"];
    perProvince(provincies);
}
else if (custom_variable.length == 1){
    provincies = [custom_variable[0]];
    perProvince(provincies);
}
else {
    console.log("wrong")
};

function perProvince(provincies) {
    provincies.forEach((provincie) => {
        console.log(provincie + ' wordt opgehaald... ')
        doRequest(provincie);
    });
}

// URL request per provincie
function doRequest(provincie) {
    var xhr = new XMLHttpRequest();
    var url = 'https://nationaalgeoregister.nl/geonetwork/srv/dut/q?_content_type=json&bucket=s101&facet.q=&fast=index&from=1&to=1000&isChild=%27false%27&orgName=Provincie%20'+ provincie +'&resultType=details&sortBy=relevance';
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(provincie)
            var myArr = JSON.parse(this.responseText);
            if (myArr) {
                dataCrunch(myArr)

            } else {
                console.log( provincie + "  is geen provincie")

                // console.log(provincie + '\n' + myArr.metadata + ' aantal datasets' )
            }

        };
        export_file(dataset_list);
    };
    xhr.open("GET", url, true);
    xhr.send();
};


function dataCrunch(data) {
    // console.log(data.result.results)
    let datasets = data.metadata;
    for (let i = 0; i < datasets.length; i++) {
        const element = datasets[i];

        var thema = element.topicCat;
        if (Array.isArray(thema)) {
            thema = thema[0]
        };
        var party1 = element.responsibleParty;
        var party2;
        if (Array.isArray(party1)) {
            party2 = party1[1]
            party1 = party1[0]
        };
        party1 = party1.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        party2 = party2.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

        if(Array.isArray(element.link)){
            for (let j = 0; j < element.link.length; j++) {
                const url = element.link[j];
                dataset_list.push({
                    "provincie": element.geoDescCode,
                    "theme": thema.replace(/,/g, '') || "null",
                    "titel": element.title.replace(/,/g, '') || "null",
                    "responsible1": party1 || "null",
                    "responsible2": party2 || "null",
                    "metadata_created": element.creationDate || "null",
                    "url": url.replace(/,/g, '') || "null"
                });
                
            }
        } else {
            var url = toString(element.link);
            console.log(url)
            dataset_list.push({
                "provincie": element.geoDescCode,
                "theme": thema.replace(/,/g, '') || "null",
                "titel": element.title.replace(/,/g, '') || "null",
                "responsible1": party1 || "null",
                "responsible2": party2 || "null",
                "metadata_created": element.creationDate || "null",
                "url": url.replace(/,/g, '') || "null"
            });
        }
    };
};

function export_file(data) {
    let csvContent = toCSV(data);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(csvContent);
    var encodedUri = encodeURI(csvContent);
    fs.writeFileSync(custom_variable[0] + '_NGR_' + datum + '.csv', csvContent);
};


function toCSV(json) {
    var csv = "";
    var keys = (json[0] && Object.keys(json[0])) || [];
    var data = Object.values(json);
    csv += keys.join(',') + "\r\n";
    for (var item in json) {
        csv += Object.values(json[item]).join(",") + "\r\n";
    }
    return csv;
}