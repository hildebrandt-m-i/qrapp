import { Component } from '@angular/core';
import { DataLocalService } from 'src/app/services/data-local.service';
import { Register } from '../../models/register.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor( public dataLocal: DataLocalService ) {}

  sendMail() {
    this.dataLocal.sendMail();
  }

  openRegister( register: Register ) {
    this.dataLocal.openRegister( register );
  }

}
