var fs = require("fs");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var dataset_list = [];
var custom_variable = process.argv.slice(2);
var provincie;
var datum = new Date();

if (custom_variable.length == 0) {
    console.error("Geen parameters ingevoerd! Geef een provincie naam. Bijvoorbeeld: \n provinciegroningen \n zuid-holland \n \n \t node arcgis_services.js zuid-holland")
}
else if (custom_variable.length == 1) {
    provincie = custom_variable[0];
    doRequest();
};


// URL request per provincie
function doRequest() {
    var xhr = new XMLHttpRequest();
    var url = 'https://geoservices.'+ provincie + '.nl/arcgis/rest/services/?f=pjson';
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            // console.log('\n', myArr.folders, '\n');

            for (let i  = 0; i  < myArr.folders.length; i ++) {
                const element = myArr.folders[i];

                // Request per t THEME
                var xhr2 = new XMLHttpRequest();
                var url2 = 'https://geoservices.' + provincie + '.nl/arcgis/rest/services/'+ element +'?f=pjson';
                xhr2.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var myArr2 = JSON.parse(this.responseText); 
                        // console.log( element, '|', myArr2.services.length );
                        for (let j  = 0; j  < myArr2.services.length; j ++) {
                           const element2 = myArr2.services[j];
                            console.log(element2.name)

                            // request per SERVICE
                            var xhr3 = new XMLHttpRequest();
                            var url3 = 'https://geoservices.' + provincie + '.nl/arcgis/rest/services/' + element2.name + '/'+ element2.type +'?f=pjson';
                            xhr3.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    var myArr3 = JSON.parse(this.responseText); 
                                    if (myArr3.layers){
                                        // console.log(element2.name, '| ', myArr3.layers.length);

                                        for (let k = 0; k < myArr3.layers.length; k++) {
                                            const element3 = myArr3.layers[k];
                                            // console.log(element2.name + ', '+ element2.type + ', ' + element3.name );
                                            dataset_list.push(element+ ', ' + element2.name  + ', ' + element2.type + ', ' + element3.name );
                                        }
                                    } else{
                                        // console.log(element2.name, '| no layers!');
                                    }
                                    
                                }; 
                                export_file(dataset_list)

                            };
                            xhr3.open("GET", url3, true);
                            xhr3.send();

                        }
                    };
                };
                xhr2.open("GET", url2, true);
                xhr2.send();
            };
        };
    };
    xhr.open("GET", url, true);
    xhr.send();
};


function export_file(data){
    let csvContent = "";
    data.forEach(function (rowArray) {
        console.log(rowArray)
        // let row = rowArray.join(",");
        csvContent += rowArray + "\r\n";
    });
    // let data = JSON.stringify(geojson);
    var encodedUri = encodeURI(csvContent);
    // window.open(encodedUri);
    fs.writeFileSync(provincie + '_arcgis_services_'+ datum + '.csv', csvContent); 
};