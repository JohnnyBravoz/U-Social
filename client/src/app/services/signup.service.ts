import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})

export class SignupService {

  //URI = 'http://localhost:4000/user/prueba';
  URI = 'http://localhost'
  constructor(private http: HttpClient) { }
  
  addUser(username: string, email: string, pass: string, img: string | any){
    console.log(username);
    console.log(email);
    console.log(pass);
    console.log(img);

    const fd = {
      "username": username,
      "email": email,
      "pass": pass,
      "img": img
    };
    return this.http.post(this.URI,fd);
    
  }
}
