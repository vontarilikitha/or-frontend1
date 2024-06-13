import { Component } from '@angular/core';
import { DataService } from '../Services/data.service';
import { Router, RouterModule } from '@angular/router';
import { AuthGuardService } from '../Services/auth-guard.service';
import { HttpClient } from '@angular/common/http';
import { GraduateDetailsService } from '../Services/graduate-details.service';
import { EmployersDetailsService } from '../Services/employers-details.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  showLogInSignup:boolean = true;
  dataService:any;


  constructor(public dataServices:DataService , private router:Router,private authService:AuthGuardService,private http:HttpClient,
    private graduateDetailsService:GraduateDetailsService , private employerDetailsService:EmployersDetailsService
  ){
    this.dataService = dataServices;
    if(this.dataService.showLogIn == false){
      this.showLogInSignup = false;
    }
  }

  goToAddJob(){
    if(this.dataService.userLoggedIn == false){
      this.router.navigateByUrl("/login");
    }
    else{  
      console.log(this.dataService.userData.role.roleTitle);
      if( this.dataService.userData.role.roleTitle == "employer" ){
        this.router.navigateByUrl("/add-job");
      }
      else
        alert("You are not a employer to add job");
    }
  }

  goToJobs(){
    if(this.dataService.userLoggedIn == false){
      this.router.navigateByUrl("/login");
    }
    else
      this.router.navigateByUrl("/jobs");
  }

  logOut(){
    this.dataService.isAdmin = false;
    this.dataService.userData = {};
    this.dataService.jobData = {};
    this.dataService.jobPosterData = {};
    this.dataService.userLoggedIn = false;
    this.dataService.showLogIn = true;

    localStorage.clear();
    sessionStorage.clear();

    this.authService.logout();
    this.router.navigateByUrl("/welcome");
  }
  
  openAccepted(){
    if( this.dataService.userData.role.roleTitle == "employer" ){
      this.router.navigateByUrl("/accepted-appointments");
    }
    else
      alert("You are not a employer to add job");
  
  }

  openPending(){
    if( this.dataService.userData.role.roleTitle == "employer" ){
      this.router.navigateByUrl("/pending-appointments");
    }
    else
      alert("You are not a employer to add job");
  }

  openInbox(){
    this.router.navigateByUrl("/inbox");
  }

  openOutbox(){
    this.router.navigateByUrl("/outbox");
  }


  async openProfile(){
    
    if(this.dataService.userData.role.roleTitle == "employer"){
      this.employerDetailsService.getEmployerDetails();
    }
    else{
      this.graduateDetailsService.getGraduateDetails();
    }

  }

}
