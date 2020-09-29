import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ServiceFireService {
    constructor(private firestore : AngularFirestore) { }

    public createData (data: Array<any>){
    return this.firestore.collection('data').add({data});
  }
}
