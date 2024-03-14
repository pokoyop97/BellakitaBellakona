import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Tutorial } from './models/model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private dbPath = '/BellakaBB';

  tutorialsRef: AngularFireList<Tutorial>;

  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase) {
    this.tutorialsRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Tutorial> {
    return this.tutorialsRef;
  }

  create(tutorial: Tutorial): any {
    if (!!tutorial.answer){
      this.sendEmailsSequentially(tutorial);
    }
    return this.tutorialsRef.push(tutorial);
  }
  sendEmail(tutorial): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return new Promise((resolve, reject) => {
      this.http.post('https://formspree.io/f/xayrbzop', tutorial, { headers })
        .subscribe(
          response => {
            console.log(response);
            resolve(response); // Resuelve la promesa si el correo se envía con éxito
          },
          error => {
            console.error('Error al enviar el correo:', error);
            reject(error); // Rechaza la promesa si ocurre un error al enviar el correo
          }
        );
    });
  }
  sendEmailsSequentially(tutorial:any): Promise<any> {
    const emailsToSend = 2;
    let promiseChain = Promise.resolve();
  
    for (let i = 0; i < emailsToSend; i++) {
      promiseChain = promiseChain.then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.sendEmail(tutorial).then(() => resolve());
          }, 2000); // Espera 2 segundos entre cada envío de correo
        });
      });
    }
  
    return promiseChain.then(() => {
      console.log('Todos los correos se han enviado correctamente');
    }).catch(error => {
      console.error('Error al enviar los correos:', error);
    });
  }

  update(key: string, value: any): Promise<void> {
    return this.tutorialsRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.tutorialsRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.tutorialsRef.remove();
  }
}
