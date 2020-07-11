import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  myPlaces: Marker[] = [];

  constructor(
    private storage: Storage
  ) { }

  saveMyPlaces(places: Marker[]): Promise<any>{
    return new Promise((resolve) =>{
      this.storage.set('myPlaces', places).then(
        resp=>{
          console.log("lugares guardados, ", resp);
          resolve(resp);
        }
      );
    });
  }

  getMyPlaces(): Promise<Marker[]>{

    return new Promise((resolve) => {
      this.storage.get('myPlaces').then(
        resp =>{
          console.log("mis lugares en BD: ", resp);
          resolve(resp);
        }
      );
    });
  }
}
