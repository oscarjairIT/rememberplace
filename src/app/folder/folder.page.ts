import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LocalStorageService } from '../services/local-storage.service';
import { LocationService } from '../services/location.service';
import { Geoposition } from '@ionic-native/geolocation/ngx';


/**
 * Para manejo de Google Maps API
 */
declare var google;

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  map = null
  newMarker;
  infoWindows: any = [];

  /**
   * Variables de prueba
   */
  markers: Marker[] = [
    {
      position: {
        lat: -33.0090524845652,
        lng: -71.54860754016043,
      },
      title: 'Esquina Mall Marina'
    },
    {
      position: {
        lat: -33.014463241226736,
        lng: -71.55532252917327,
      },
      title: 'Frente Restaurant Tierra del Fuego'
    }
  ];

  
  constructor(
    private alertController: AlertController,
    private localStorageService: LocalStorageService,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    this.locationService.getUserPosition().then(
      currentPosition =>{

        this.localStorageService.getMyPlaces().then(
          myPlaces =>{
            
            if (myPlaces == null) {
              this.markers = [];
              this.loadMap(currentPosition);
            } else {
              this.markers = myPlaces;
              this.loadMap(currentPosition);
            }

          }
        );

      }
    );

    
  }

  /**
   * Carga mapa y sus propiedades
   */
  loadMap(currentPos: Geoposition){
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: {
        lat: currentPos.coords.latitude,
        lng: currentPos.coords.longitude,
      },
      zoom: 15
    });
    // Carga marcadores
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.renderMarkers();
      mapEle.classList.add('show-map');
    });
    // LLama newMarkerWindow() al escuchar un 'click'
    google.maps.event.addListener(this.map, 'click', (mapsMouseEvent) => {
      console.log("LAT: ",mapsMouseEvent.latLng.lat());
      console.log("LNG: ",mapsMouseEvent.latLng.lng());

      this.newMarkerWindow(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng());
    });
  }

  /**
   * Crea marcador y sus propiedades
   */
  addMarker(marker: Marker) {
    let newMarker = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });

    let infoWindowContent = '<div id="content">' +
                              '<h4 style="text-align: center" id="firstHeading" class"firstHeading">' + marker.title + '</h4>' +
                            '</div>';

    let infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent
    });

    newMarker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, newMarker);
    });
    this.infoWindows.push(infoWindow);

    return newMarker
  }

  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }

  /**
   * Crea dialogo para confirmar la 
   * creacion de un marcador
   */
  async newMarkerWindow(lat: number, lng: number){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Nuevo Lugar',
      // subHeader: 'Subtitle',
      // message: 'This is an alert message.',
      inputs: [
        {
          name: 'titulo',
          type: 'text',
          id: 'title',
          // value: 'hello',
          placeholder: 'ej: Plaza con equipo para entrenar'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancela creacion');
          }
        }, {
          text: 'Crear',
          handler: (data) => {
            console.log('Confirma creacion');

            this.markers.push(
              {
                position: {
                  lat: lat,
                  lng: lng,
                },
                title: data.titulo
              }
            );
            this.renderMarkers();
            this.localStorageService.saveMyPlaces(this.markers);
          }
        }
      ]
    });

    await alert.present();
  }

  closeAllInfoWindows() {
    for(let window of this.infoWindows) {
      window.close();
    }
  }

}
