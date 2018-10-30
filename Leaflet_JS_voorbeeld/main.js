window.addEventListener("DOMContentLoaded", function () {
    
    // DEFINE RD NEW
    var RD = new L.Proj.CRS('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs',
        {
            resolutions: [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210],
            bounds: L.bounds([-285401.92, 22598.08], [595401.9199999999, 903401.9199999999]),
            origin: [-285401.92, 22598.08]
        }
    );

    // INIT MAP
    var map = L.map("map", {
        center: [52.07, 4.306],
        zoom: 8,
        hash: true,
        crs: RD
    });

    //https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartgrijs@EPSG:28992@png8/5/12/13.png

    // ADD TILE LAYER
    new L.TileLayer('https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartgrijs@EPSG:28992@png8/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 13,
        tms: true,
        attribution: 'Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
    }).addTo(map);


    // ADD WMS as tile layer
    var maps = {
            cbs_cars : L.tileLayer.wms('http://geodata.nationaalgeoregister.nl/wijkenbuurten2014/wms', {
            'layers': 'cbs_buurten_2014',
            'styles': 'wijkenbuurten_thema_buurten_gemeentewijkbuurt_gemiddeld_aantal_autos_per_huishouden',
            'format': 'image/png',
            'transparent': true,
            'opacity': 0.5,
            'srs': 'EPSG:28992',
            'attribution': '<a href="http://www.cbs.nl/">Centraal Bureau voor de Statistiek</a>',
        }),
        cultuur: L.tileLayer.wms('https://geoservices.zuid-holland.nl/arcgis/services/Cultuur/Cultuurhistorie_Beeldbepalend_Erfgoed/MapServer/WmsServer?', {
            'version':  '1.3.0',
            'styles': 'default',
            'layers': 'Historische orientatiepunten.',
            'format': 'image/png',
            'transparent': true,
            'srs': 'EPSG:28992',
            'attribution': '<a href="">Geoservices PZH</a>'
        }),
            bakken_groningen: L.tileLayer.wms('http://geoservices.provinciegroningen.nl/arcgis/services/OpenData_OBJ/MapServer/WmsServer?', {
            'version': '1.3.0',
            'styles': 'default',
            'layers': 'Afvalbakken',
            'format': 'image/png',
            'transparent': true,
            'srs': 'EPSG:28992',
            'attribution': '<a href="">Geoservices PZH</a>'
        })
    };

    L.control.layers(maps).addTo(map);
        
    
});