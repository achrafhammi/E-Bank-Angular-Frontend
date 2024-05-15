import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean = false;
  roles : any;
  username: any;
  accessToken!: any;

  constructor(private http:HttpClient,
    private router: Router) { }

  public login(username: string, password: string){
    let options = {
      headers : new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }
    return this.http.post('http://localhost:8085/auth/login', {username, password}, options);
  }

  loadProfile(data: any){
    this.isAuthenticated = true;
    let jwtToken = data['access_token'];
    this.accessToken = jwtToken;
    let jwtDecoder = jwtDecode(jwtToken);
    this.username = jwtDecoder.sub;
    this.roles = jwtDecoder.scope;
    window.localStorage.setItem('accessToken', jwtToken);
  }

  logout(){
    this.isAuthenticated = false;
    this.accessToken = undefined;
    this.roles= undefined;
    this.username = undefined;
    window.localStorage.removeItem('accessToken');
    this.router.navigateByUrl("/login");
    

  }

  loadJwtTokenFromStorage(){
    let token = window.localStorage.getItem('accessToken');
    if(token){
      this.loadProfile({access_token: token})
      this.router.navigateByUrl("/admin/customers");
    }
  }
}
