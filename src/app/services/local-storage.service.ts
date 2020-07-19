import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastService } from './toast.service';

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

  constructor(
    private storage: Storage,
    private toastService: ToastService
  ) { }

  saveMyPlaces(places: Marker[]): Promise<any>{
    return new Promise((resolve) =>{
      this.storage.set('myPlaces', places).then(
        resp=>{
          console.log("lugares guardados, ", resp);
          resolve(resp);
        },
        err =>{
          console.log("Error: ", err);
          this.toastService.presentToast("Error al guardar tus lugares");
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
        },
        err=>{
          console.log("Error: ", err);
          this.toastService.presentToast("Error al obtener tus lugares");
        }
      );
    });
  }
}
