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
        url: "https://consultarclima-consultarclima.7e14.starter-us-west-2.openshiftapps.com/tempo/ver/" + lat + "/" + lon,
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

function consumirForecast(lat, lon) {

    var tempo = '';

    $.ajax({
        url: "http://localhost:8080/tempo/forecast/" + lat + "/" + lon,
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

        var forecastConsumo = ConsultarForecast(consumirForecast(myLatlng.lat, myLatlng.lng));

        $("#forecast").html(ComporForescat(forecastConsumo));
        //console.log(ComporForescat(forecastConsumo));

        var google_maps_geocoder = new google.maps.Geocoder();

        google_maps_geocoder.geocode(
            { 'latLng': myLatlng },
            function (results, status) {
                coordInfoWindow.close();
                coordInfoWindow = new google.maps.InfoWindow();
                coordInfoWindow.setContent(createInfoWindowContent(myLatlng, 8, consumirTempo(myLatlng.lat, myLatlng.lng), results));
                coordInfoWindow.setPosition(myLatlng);
                coordInfoWindow.open(map);
            }
        );

        $("#forecast").owlCarousel(			   {
             loop:false,
             nav:true,
             responsive:{
                 0:{
                     items:1
                 },
                 600:{
                     items:3
                 },
                 1000:{
                     items:5
                 }
             }
        });

    });
}

function createInfoWindowContent(latLng, zoom, tempo, proximidades) {

    var endereco = '';
    var retornoTempo = JSON.parse(tempo);

    var tempolocal = '';
    for (var i = 0; i < retornoTempo.weather.length; i++) {
        tempolocal = tempolocal + ' ' + retornoTempo.weather[parseInt(i)].description;
    }

    if (proximidades != undefined && proximidades.length > 0) {
        // for (var i = 0; i < proximidades[0].address_components.length; i++) {
        //    console.log(proximidades[0].address_components[i]);
        // }
        endereco = proximidades[0].formatted_address;
    } else {
        endereco = retornoTempo.name + ', ' + retornoTempo.sys.country;
    }

    return [
        endereco,
        'Latitude: ' + latLng.lat.toFixed(3),
        'Longitude: ' + latLng.lng.toFixed(3),
        'Temperatura (min): ' + retornoTempo.main.temp_min + '°C',
        'Temperatura (max): ' + retornoTempo.main.temp_max + '°C',
        'Temperatura: ' + retornoTempo.main.temp + '°C',
        'Nível do Mar: ' + (retornoTempo.main.sea_level != null ? retornoTempo.main.sea_level + ' hPa' : ' '),
        'Pressão: ' + retornoTempo.main.pressure + ' hPa',
        'Umidade: ' + retornoTempo.main.humidity + ' %',
        'Tempo: ' + tempolocal,
        'Vento (inclinação): ' + retornoTempo.wind.deg + ' °',
        'Vento (velocidade): ' + retornoTempo.wind.speed + ' m/s',
        'Nuvens: ' + retornoTempo.clouds.all + ' %'
    ].join('<br>');
} 

function ConsultarForecast(forecast){
    var retornoForecast = JSON.parse(forecast);

    var forecastlocal = [];
    for (var i = 0; i < retornoForecast.list.length; i++) {

        for(var j = 0; j < retornoForecast.list[i].weather.length; j++) {
            var date = new Date(retornoForecast.list[i].dt * 1000); 
            forecastlocal.push({ "hora": date.toLocaleString(),
                                 "min": retornoForecast.list[i].main.temp_min + '°C',
                                 "max": retornoForecast.list[i].main.temp_max + '°C',  
                                 "temp":  retornoForecast.list[i].main.temp + '°C',
                                 "nivelDoMar": (retornoForecast.list[i].main.sea_level != null ? retornoForecast.list[i].main.sea_level + ' hPa' : ' '),
                                 "pressao" : retornoForecast.list[i].main.pressure + ' hPa',
                                 "unidade" : retornoForecast.list[i].main.humidity + ' %',
                                 "vento_inclinacao" : retornoForecast.list[i].wind.deg + ' °',
                                 "vento_velocidade" : retornoForecast.list[i].wind.speed + ' m/s',
                                 "descricao": retornoForecast.list[i].weather[parseInt(j)].description});
        }
    }

    return forecastlocal;
}

function ComporForescat(forecastResultado){
    var retorno = '';
    for (var i = 0; i < forecastResultado.length; i++) {
        //retorno.push("<div id='carousel"+i+"'>"+forecastResultado[i].hora+"<br/>"+forecastResultado[i].temp+"</div>");
        retorno = retorno + "<div class='item'>"+forecastResultado[i].hora+"<br/>"+forecastResultado[i].temp+"<br/>"+forecastResultado[i].descricao+"</div>";
    }
    return retorno;
}