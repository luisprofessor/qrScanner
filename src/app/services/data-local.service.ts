import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Registro } from '../models/registro.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  guardados:Registro[]=[];

  constructor(private storage:Storage,
    private navCtrl:NavController,
    private inAppBrowser:InAppBrowser,
    private file:File,
    private emailComposer:EmailComposer) { 
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

  enviarCorreo(){
    const arregloTemp=[];
    const titulos='Tipo, Formato, Creado en, Texto\n';

    arregloTemp.push(titulos);
    this.guardados.forEach(reg=>{
      const fila=reg.type+', '+reg.format+', '+reg.created+', '+reg.text.replace(',',' ')+'\n';
      arregloTemp.push(fila);
    });
    this.crearArchivoFisico(arregloTemp.join(' '));
  }

  crearArchivoFisico(text:string){
    this.file.createFile
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
    .then(existe => {console.log('Directory exists');
        this.escribirEnArchivo(text);
       }
    )
    .catch(err =>
      console.log('Creando el archivo'));
      return this.file.createFile(this.file.dataDirectory,'registro.csv',true)
      .then(creado=>{
        console.log('Archivo creado con extito');
        this.escribirEnArchivo(text);
      })
      .catch(err2=>console.log("Error al crear el archivo"));
    
  }

  async escribirEnArchivo(texto:string){
    
    await this.file.writeExistingFile(this.file.dataDirectory,'registro.csv',texto);
    const archivo=this.file.dataDirectory+'registro.csv';
    const email = {
      to: 'luisprofessor@gmail.com',
      //cc: 'erika@mustermann.de',
      //bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backup de Scann',
      body: 'Envío copia de seguridad desde <strong>QRScanner</strong>',
      isHtml: true
    }
    
    // Send a text message using default options
    this.emailComposer.open(email);
    console.log('archivo ',archivo);


  }

}
