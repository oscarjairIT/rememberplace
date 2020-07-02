import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadMap();
  }

  loadMap(){
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    /**
     * Position para pruebas en la WEB
     *
    {
      position: {
        lat: -33.014463241226736,
        lng: -71.55532252917327,
      },
      title: 'Frente Restaurant Tierra del Fuego'
    }
    */

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: {
        lat: -33.014463241226736,
        lng: -71.55532252917327,
      },
      zoom: 12
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.renderMarkers();
      mapEle.classList.add('show-map');
    });
  }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });
  }

  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }

}
