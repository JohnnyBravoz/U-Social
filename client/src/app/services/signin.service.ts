import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SigninService {
  URI = 'http://localhost:4000/users/signin';
  constructor(private http: HttpClient) { }
}
