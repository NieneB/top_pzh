# API request voor metadat overzichts

Draai de scripts met Node. Bijvoorbeeld:

    node data.overheid.nl_samenvatting.js [provincie] all
    node arcgis_services.js  [provincie]
    node dataplatform.nl.js provincie-zuid-holland

De output is een csv bestand met een record per metadata record. 

## data.overheid.nl 

Overzicht records van alle provincies van Nederland:
[/data.overheid.nl_samenvatting.js](/data.overheid.nl_samenvatting.js)

Gebruikt de API van CKAN voor het opvragen van dataset informatie in JSON.

## dataplatform.nl

[/dataplatfrom.nl.js](/dataplatfrom.nl.js)

De Dataplatform API maakt gebruik van de standaard van CKAN. Lees de volledige CKAN API documentatie voor nadere details. Hieronder staan enkele voorbeelden die afkomstig zijn uit de brondocumentatie.

De API van CKAN toont de belangrijkste mogelijkheden aan API-clients. 

Een overzicht van alle datasets: https://ckan.dataplatform.nl/api/3/action/package_list

Bekijk een dataset: https://ckan.dataplatform.nl/api/3/action/package_show?id=afvalcontainers-schiedam

Zoek naar datasets met het woord "boom": https://ckan.dataplatform.nl/api/3/action/package_search?q=boom

Zoek naar bestanden met het woord "strooiroute": https://ckan.dataplatform.nl/api/3/action/resource_search?query=description:strooiroute


## nationaalgeoregister.nl

[/nationaal_geo_register.js](/nationaal_geo_register.js)

Het Nationaal Georegister is gebouwd op basis van GeoNetwork software. Raadpleeg de API documentatie van GeoNetwork 3.0 op de GeoNetwork API pagina.

## Esri geoservices Provincie Zuid-Holland

[/arcgis_services.js](/arcgis_services.js)

ArcGIS rest server. 