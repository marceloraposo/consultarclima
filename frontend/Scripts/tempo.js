function posicaoMapa() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(mostrarMapa, tratarErros);

    }
    else { console.log("Seu browser não suporta Geolocalização."); }
}

function tratarErros(error) {

    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("Usuário rejeitou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Localização indisponível.");
            break;
        case error.TIMEOUT:
            console.log("A requisição expirou.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("Algum erro desconhecido aconteceu.");
            break;
    }

}

function consumirTempo(lat, lon) {

    var tempo = '';

    $.ajax({
        url: "http://localhost:2019/tempo/ver/" + lat + "/" + lon,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        complete: function (result) {
            tempo = result.responseText;
        },
        error: function (errormessage) {
            tempo = '';
        }
    });

    return tempo;
}

function consultarEndereco(google_map_pos) {

    var google_maps_geocoder = new google.maps.Geocoder();

    google_maps_geocoder.geocode(
        { 'latLng': google_map_pos },
        function (results, status) {
            //console.log(results);
            return results;
        }
    );

}

function mostrarMapa(position) {

    var myLatlng = { lat: position.coords.latitude, lng: position.coords.longitude };
    var coordInfoWindow = new google.maps.InfoWindow();

    var map = new google.maps.Map($('#googleMap')[0], {
        zoom: 15,
        center: myLatlng
    });

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Selecione para ver mais'
    });

    map.addListener('click', function (evt) {

        myLatlng = { lat: evt.latLng.lat(), lng: evt.latLng.lng() };

        marker.setMap(null);

        marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Selecione para ver mais'
        });

        map.setCenter(myLatlng);
        map.panTo(marker.getPosition());

        coordInfoWindow.close();
        coordInfoWindow = new google.maps.InfoWindow();
        coordInfoWindow.setContent(createInfoWindowContent(myLatlng, 8, consumirTempo(myLatlng.lat, myLatlng.lng)));
        coordInfoWindow.setPosition(myLatlng);
        coordInfoWindow.open(map);

    });
}

function createInfoWindowContent(latLng, zoom, tempo) {

    var endereco = '';
    var proximidades = consultarEndereco(latLng);
    var retorno = JSON.parse(tempo);

    var tempolocal = '';
    for (var i = 0; i < retorno.weather.length; i++) {
        tempolocal = tempolocal + ' ' + retorno.weather[parseInt(i)].description;
    }

    if (proximidades != undefined && proximidades.length > 0) {
        endereo = proximidades[0];
    } else {
        endereco = retorno.name + ', ' + retorno.sys.country;
    }

    return [
        endereco,
        'Latitude: ' + latLng.lat.toFixed(3),
        'Longitude: ' + latLng.lng.toFixed(3),
        'Temperatura (min): ' + retorno.main.temp_min + '°C',
        'Temperatura (max): ' + retorno.main.temp_max + '°C',
        'Temperatura: ' + retorno.main.temp + '°C',
        'Nível do Mar: ' + (retorno.main.sea_level != null ? retorno.main.sea_level + ' hPa' : ' '),
        'Pressão: ' + retorno.main.pressure + ' hPa',
        'Umidade: ' + retorno.main.humidity + ' %',
        'Tempo: ' + tempolocal,
        'Vento (inclinação): ' + retorno.wind.deg + ' °',
        'Vento (velocidade): ' + retorno.wind.speed + ' m/s',
        'Nuvens: ' + retorno.clouds.all + ' %'
    ].join('<br>');
} 