import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppareilService {
  
  appareilsSubject = new Subject<any[]>();

  private appareils;

  constructor(private httpClient: HttpClient){}

  emitAppareilSubject() {
    this.appareilsSubject.next(this.appareils.slice());
  }

  addAppareil(name: string, status: string) {
    const appareilObject = {
      id: 0,
      name: '',
      status: ''
    };
    appareilObject.name = name;
    appareilObject.status = status;
    appareilObject.id = this.appareils[(this.appareils.length - 1)].id + 1;
    this.appareils.push(appareilObject);
    this.saveAppareilsToServer();
    this.emitAppareilSubject();
  }

  switchOnAll() {
    for(let appareil of this.appareils) {
      appareil.status = 'allumé';
    }
    this.saveAppareilsToServer();
    this.emitAppareilSubject();
  }

  switchOffAll() {
      for(let appareil of this.appareils) {
        appareil.status = 'éteint';
        this.saveAppareilsToServer();
        this.emitAppareilSubject();
      }
  }

  switchOnOne(i: number) {
      this.appareils[i].status = 'allumé';
      this.saveAppareilsToServer();
      this.emitAppareilSubject();
  }

  switchOffOne(i: number) {
      this.appareils[i].status = 'éteint';
      this.saveAppareilsToServer();
      this.emitAppareilSubject();
  }

  getAppareilById(id: number) {
    const appareil = this.appareils.find(
      (s) => {
        return s.id === id;
      }
    );
    return appareil;
  }

  getAppareilsFromServer() {
    this.httpClient
      .get<any[]>('https://ocr-ngsix.firebaseio.com/appareils.json')
      .subscribe(
        (response) => {
          this.appareils = response;
          this.emitAppareilSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

  saveAppareilsToServer() {
    this.httpClient
      .put('https://ocr-ngsix.firebaseio.com/appareils.json', this.appareils)
      .subscribe(
        () => {
          console.log('Enregistrement terminé !');
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

}
  