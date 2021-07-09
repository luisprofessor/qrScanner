import { Component, OnInit } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  constructor(public dataLocal:DataLocalService) {}
  ngOnInit() {
  
    
  }

  enviarPorCorreo(){
    this.dataLocal.enviarCorreo();
  }
  abrirRegistro(registro:Registro){
    this.dataLocal.abrirRegistro(registro);
  }

}
