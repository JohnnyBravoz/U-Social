import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import {Subject, Observable} from 'rxjs';
import {SignupService} from '../../services/signup.service'
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  //image option
  imgOption: any;
  isChecked: boolean = true;

  //webcam 
  public  webcamImage? : WebcamImage;

  //webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  base64? : string;
  imgPreview? : string | ArrayBuffer | null;
  ext?: string;
  file?: File  | any
  constructor(private router: Router ) {}

  ngOnInit(): void {
  }

  //webcam methods 
  triggerSnapshot(): void {
    this.trigger.next();
   }

  handleImage(webcamImage: WebcamImage): void {
  console.info('received webcam image', webcamImage);
  this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  onPhotoSelected(event: any): void{
    alert("hola");
  }

  selectFile(event: any):void{
    this.file = event.target.files[0];
    let name = event.target.files[0].name;
    let lastDot = name.lastIndexOf('.');
    let fileName = name.substring(0, lastDot);
    this.ext = "."+name.substring(lastDot + 1);

    const reader = new FileReader();
    reader.onload = e => this.imgPreview = reader.result;
    reader.onloadend = () => {
      const base64String = reader.result?.slice(22);
      this.base64 = base64String?.toString();
    };
    reader.readAsDataURL(this.file);
  }

  uploadImage(name:HTMLInputElement, lastname:HTMLInputElement, username: HTMLInputElement, email: HTMLInputElement, pass: HTMLInputElement, conf_pass: HTMLInputElement): boolean{
    if(this.imgPreview == null){
      alert("Ingrese una imagen");
    }else{
      if(this.ext ===".jpg" || this.ext ===".png"){
        if(pass.value === conf_pass.value){
          const encryptedPass= CryptoJS.SHA256(pass.value).toString();
          alert("Datos correctos");
          // this.signupService.addUser(username.value, email.value, encryptedPass, this.base64)
          // .subscribe((res:any)=> {
          //   alert(res.msj);
          //   this.router.navigate(['/']);
          // }, (err:any) => {
          //   alert(err);
          // });
        }else{
          alert("Las constraseñas no coinciden.")
        }
      }else{
        alert("Extension invalida, se requiere imagen con extension .jpg o .png");
      } 
    }
    return false;
  }

  

}
