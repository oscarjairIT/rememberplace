import { Injectable } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  options : GeolocationOptions;
  currentPos : Geoposition;

  constructor(
    private geolocation : Geolocation,
    private toastService: ToastService
  ) { }

  getUserPosition(): Promise<Geoposition>{
    return new Promise((resolve) =>{
      this.options = {
        enableHighAccuracy : true
      };

    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
        this.currentPos = pos;      
        console.log(pos);
        resolve(pos);
    },(err : PositionError)=>{
        console.log("error : " + err.message);
        this.toastService.presentToast("Error al obtener posicion actual");
    });
    });
  }
}
