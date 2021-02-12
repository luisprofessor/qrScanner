import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Registro } from '../models/registro.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  guardados:Registro[]=[];

  constructor(private storage:Storage,
    private navCtrl:NavController,
    private inAppBrowser:InAppBrowser) { 
      this.leerStorage();
        
  }

  async leerStorage(){
    this.guardados= (await this.storage.get('registros')) ||[];
  }
  async guardarRegistro(format:string,text:string){
    await this.leerStorage();
    const nuevoRegistro=new Registro(format,text);
    this.guardados.unshift(nuevoRegistro);
    this.storage.set('registros',this.guardados);
    this.navCtrl.navigateForward('/tabs/tab2');
    this.abrirRegistro(nuevoRegistro);
    
  }

  abrirRegistro(registro:Registro){
    this.navCtrl.navigateForward('/tabs/tab2');
    switch(registro.type){
      case 'http':{
               const browser= this.inAppBrowser.create(registro.text,'_system');
               
               break;

      }
      case 'geo':{
        this.navCtrl.navigateForward('/tabs/tab2/mapa/'+registro.text);
        break;
      }
      default:{
        //Mostrar
      }
    }
  }

}
