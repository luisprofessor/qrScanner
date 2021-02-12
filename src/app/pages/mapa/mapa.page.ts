import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl:any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
 

  constructor(private activeRoute:ActivatedRoute) { }
  latitud:number;
  longitud:number;
  ngAfterViewInit() {

    const lng=this.longitud;
    const lat=this.latitud; 
    mapboxgl.accessToken = 'pk.eyJ1IjoibHVpczE5NzMiLCJhIjoiY2tsMWg2OTV6MDMyMjMybXJlcXhyOTY1MyJ9.YN_7kOCUnfTsbUbInFTUgQ';
    const map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v10',
    center: [this.longitud, this.latitud],
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map',
    antialias: true
    });


    console.log('latitud y long ',lng+' '+lat);
    map.on('load', function () {
      // Insert the layer beneath any symbol layer.
      map.resize();
      

      //Marker
      const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map);



      const layers = map.getStyle().layers;
      
       
      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                    labelLayerId = layers[i].id;
                    break;
        }
      }
       
      map.addLayer(
      {
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                      'fill-extrusion-color': '#aaa',
       
      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
                      'fill-extrusion-height': [
                                    'interpolate',
                                    ['linear'],
                                    ['zoom'],
                                    15,
                                    0,
                                    15.05,
                                    ['get', 'height']
                               ],
                      'fill-extrusion-base': [
                                    'interpolate',
                                    ['linear'],
                                    ['zoom'],
                                    15,
                                    0,
                                    15.05,
                                    ['get', 'min_height']
                                ],
                        'fill-extrusion-opacity': 0.6
        }
      },
      labelLayerId
      );
      });
    
  }




  ngOnInit() {
    let geo:any =this.activeRoute.snapshot.paramMap.get('geo');
    geo= geo.substr(4);
    geo=geo.split(',');
    this.latitud=Number(geo[0]);
    this.longitud=Number(geo[1]);
    


  }

}
