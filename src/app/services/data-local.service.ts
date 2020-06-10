import { Injectable } from '@angular/core';
import { Register } from '../models/register.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  stored: Register[] = [];

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private inAppBrowser: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer
  ) {
    this.getRegisters();
  }

  async saveRegister( format: string, text: string ) {
    await this.getRegisters();

    const newRegister = new Register( format, text );
    this.stored.unshift( newRegister );
    this.storage.set( 'Registros', this.stored );

    this.openRegister( newRegister );
  }

  async getRegisters() {
    this.stored = (await this.storage.get( 'Registros' )) || [];
  }

  openRegister( register: Register ) {
    this.navCtrl.navigateForward('/tabs/tab2');

    switch ( register.type ) {
      case 'http':
        const browser = this.inAppBrowser.create( register.text, '_system' );
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${ register.text }`);
        break;
      default:
        break;
    }
  }

  sendMail() {
    const tempArray = [];
    const titles = 'Type, Format, Created on, Text\n';
    tempArray.push( titles );

    this.stored.forEach( register => {
      const line = `${ register.type }, ${ register.format }, ${ register.created }, ${ register.text.replace(',', ' ') }\n`;
      tempArray.push( line );
    });

    this.createFisicFile( tempArray.join(' ') );
  }

  private createFisicFile( text: string ) {
    this.file.checkFile( this.file.dataDirectory, 'registers.csv' )
        .then( exists => {
          return this.writeOnFile( text );
        })
        .catch( error => {
          return this.file.createFile( this.file.dataDirectory, 'registers.csv', false )
                          .then( created => this.writeOnFile( text ) )
                          .catch( error => {
                            console.log('The file was not created', error);
                          });
        });
  }

  private async writeOnFile( text: string) {
    await this.file.writeExistingFile( this.file.dataDirectory, 'registers.csv', text );

    const file = `${ this.file.dataDirectory }registers.csv`;
    const email = {
      to: 'hildebrandt.m.i@gmail.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        file
      ],
      subject: 'Backup Scans',
      body: 'This is a backup scans of QRScan App.',
      isHtml: true
    };

    this.emailComposer.open(email);
  }

}
