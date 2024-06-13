import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { GraduateDetailsService } from '../Services/graduate-details.service';
import emailjs from '@emailjs/browser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { DataService } from '../Services/data.service';
import { AuthGuardService } from '../Services/auth-guard.service';

@Component({
  selector: 'app-graduate-profile',
  templateUrl: './graduate-profile.component.html',
  styleUrl: './graduate-profile.component.css'
})
export class GraduateProfileComponent {

  jobs:any = {};
  @ViewChild('table') table: ElementRef | undefined;
  
  showModal: any;

  userName: any;
  roleId: any;
  userMail: any;
  password:any;
  phoneNo: any;
  gender: any;
  dateOfBirth: any;
  address: any;
  nationality: any;
  college: any;
  collegeAddress: any;
  skills: any;
  project: any;

  
  @ViewChild('phoneNo1') phoneNo1:ElementRef | undefined;
  @ViewChild('sector1') sector1: ElementRef | undefined;
  @ViewChild('male') male: ElementRef | undefined;
  @ViewChild('dateOfBirth1') dateOfBirth1: ElementRef | undefined;
  @ViewChild('address1') address1: ElementRef | undefined;
  @ViewChild('nationality1') nationality1: ElementRef | undefined;
  @ViewChild('college1') college1: ElementRef | undefined;
  @ViewChild('collegeAddress1') collegeAddress1: ElementRef | undefined;
  @ViewChild('skills1') skills1: ElementRef | undefined;
  @ViewChild('project1') project1: ElementRef | undefined;
  file !: Blob;
  
  
  constructor(private graduateDetailsService:GraduateDetailsService,private renderer:Renderer2,private http:HttpClient , private router:Router,public dataService:DataService , public authService:AuthGuardService){}

  async ngOnInit() {
    try {
      this.jobs  = await  this.graduateDetailsService.getAppointmentsByroleId();
      console.log(this.jobs);
      this.generateTable();
    } catch (error) {
      console.error('Error fetching employers:', error);
    }
  }

  generateTable(){
    
    this.userName = this.graduateDetailsService.graduateData.userName;
    this.roleId = this.graduateDetailsService.graduateData.roleId;
    this.userMail = this.graduateDetailsService.graduateData.email;
    this.password = this.graduateDetailsService.graduateData.password;
    this.phoneNo = this.graduateDetailsService.graduateData.phoneNo;
    this.gender = this.graduateDetailsService.graduateData.gender;
    this.dateOfBirth = this.graduateDetailsService.graduateData.DOB;
    this.address = this.graduateDetailsService.graduateData.address;
    this.nationality = this.graduateDetailsService.graduateData.nationality;
    this.college = this.graduateDetailsService.graduateData.college;
    this.collegeAddress = this.graduateDetailsService.graduateData.collegeAddress;
    this.skills = this.graduateDetailsService.graduateData.skills;
    this.project = this.graduateDetailsService.graduateData.project;
    

    if(Object.keys(this.jobs).length == 0){
      let tr1 = this.renderer.createElement('tr');
      let p = this.renderer.createElement('p');
      p.innerHTML = "No Appointments";
      this.renderer.addClass(p,'no-jobs');
      
      this.renderer.appendChild(tr1,p);
      this.renderer.appendChild(this.table?.nativeElement,tr1);
      return;
    }
    for(let i=0;i<Object.keys(this.jobs).length;i++){
      
      let tr1 = this.renderer.createElement('tr');
      
      let td1 = this.renderer.createElement('td');
      td1.innerHTML = this.jobs[i].fullName;
      this.renderer.appendChild(tr1,td1);

      let td2 = this.renderer.createElement('td');
      td2.innerHTML = this.jobs[i].email;
      this.renderer.appendChild(tr1,td2);

      let td3 = this.renderer.createElement('td');
      td3.innerHTML = this.jobs[i].phoneNo;
      this.renderer.appendChild(tr1,td3);

      let td4 = this.renderer.createElement('td');
      td4.innerHTML = this.jobs[i].college;
      this.renderer.appendChild(tr1,td4);

      let td5 = this.renderer.createElement('td');
      td5.innerHTML = this.jobs[i].collegeAddress;
      this.renderer.appendChild(tr1,td5);

      let td6 = this.renderer.createElement('td');
      td6.innerHTML = this.jobs[i].yearOfPassing;
      this.renderer.appendChild(tr1,td6);

      let td7 = this.renderer.createElement('td');
      td7.innerHTML = this.jobs[i].skills;
      this.renderer.appendChild(tr1,td7);

      let td9 = this.renderer.createElement('td');
      td9.innerHTML = this.jobs[i].skills;
      this.renderer.appendChild(tr1,td9);

      let td8 = this.renderer.createElement('td');
      td8.innerHTML = this.jobs[i].project;
      this.renderer.appendChild(tr1,td8);

      let btn = this.renderer.createElement('button');
      this.renderer.addClass(btn,"download");
      btn.innerHTML = `<i class="fa-solid fa-download dd"></i> Resume`;
      this.renderer.listen(btn, 'click', (event) => {
        
        this.http.get(`http://localhost:8080/getResumeByAppointmentId/${this.jobs[i].id}`, { responseType: 'blob' })
        .subscribe(
          response => {
            console.log('Response:', response);
            this.file = response;
            const blob = new Blob([this.file], { type: 'application/octet-stream' });
            let fileName = this.jobs[i].fullName + "_Resume.pdf";
            saveAs(blob, fileName);
          },
          error => {
            console.error('Error downloading file:', error);
            // Handle error
          }
        );

         
      });
      this.renderer.appendChild(tr1,btn);

      this.renderer.appendChild(this.table?.nativeElement,tr1);
    }
  }

  deleteGraduate() {
    this.http.delete(`http://localhost:8080/deleteUserByRoleId/${this.roleId}`).subscribe(
      async response => {
        console.log('Response from backend:', response);

        emailjs.init('4rF1y6IRYUNj2kI-3');
        let body = `Hello User
          \n
          We are very sorry to inform you , that the Admin has deleted your Account.
          \n
          Best wishes,
          \nJobSeekho team`;

        try {
          let response = await emailjs.send( "service_ga6bnio","template_cqgom6d" , {
            from_name: "JobSeekho",
            body : body,
            reply_to : this.userMail
          });

          console.log("Email sent:", response);
          alert("Email sent");
        } catch (error) {
          console.error("Email sending failed:", error);
          alert("Failed to send email. Please try again.");
        }

        this.router.navigateByUrl('/graduates-list');
      },
      error => {
        console.error('Error sending data to backend:', error);
        // Handle error as needed
      }
    );
  }

  
  editGraduate() {
    this.showModal = !this.showModal;    
  }

  edit(){
    let user = {
      userName : this.userName,
      userEmail:this.userMail,
      password:this.password,

      nationality : this.nationality1?.nativeElement.value,
      phoneNo:this.phoneNo1?.nativeElement.value,
      role:{
        roleId:this.roleId,
        roleTitle:'employer',
        roleDesc:'emp'
      }
    }

    let graduate = {
      collegeName:this.college1?.nativeElement.value,
      collegeAddress:this.collegeAddress1?.nativeElement.value,
      gender:this.male?.nativeElement.checked ? 'Male' : 'Female',
      dateOfBirth : this.dateOfBirth1?.nativeElement.value ,
      address:this.address1?.nativeElement.value,
      skills:this.skills1?.nativeElement.value,
      project:this.project1?.nativeElement.value,
      role:{
        roleId:this.roleId,
        roleTitle:'graduate',
        roleDesc:'grd'
      }
    }


    this.http.post<any>("http://localhost:8080/updateUserByRoleId" , user).subscribe(
      response => {
        console.log('Response from backend:', response);
        
        this.http.post<any>("http://localhost:8080/updateGraduate" , graduate).subscribe(
          async response => {
            console.log('Response from backend:', response);
            
            emailjs.init('4rF1y6IRYUNj2kI-3');
            let body = `Hello User
              \n
              Admin has updated your information.
              \n
              Your Info : 
              \nuserName : ${this.userName},
              \nuserEmail:${this.userMail},
              \npassword:${this.password},

              \nnationality : ${this.nationality1?.nativeElement.value},
              \nphoneNo:${this.phoneNo1?.nativeElement.value},
              \ncollegeName:${this.college1?.nativeElement.value},
              \ncollegeAddress:${this.collegeAddress1?.nativeElement.value},
              \ngender:${this.male?.nativeElement.checked ? 'Male' : 'Female'},
              \ndateOfBirth : ${this.dateOfBirth1?.nativeElement.value} ,
              \naddress:${this.address1?.nativeElement.value},
              \nskills:${this.skills1?.nativeElement.value},
              \nproject:${this.project1?.nativeElement.value},
              \n
              Best wishes,
              \nJobSeekho team`;

            try {
              let response = await emailjs.send( "service_ga6bnio","template_cqgom6d" , {
                from_name: "JobSeekho",
                body : body,
                reply_to : this.userMail
              });

              console.log("Email sent:", response);
              alert("Email sent");
            } catch (error) {
              console.error("Email sending failed:", error);
              alert("Failed to send email. Please try again.");
            }

            this.router.navigateByUrl('/graduates-list');
          },
          error => {
            console.error('Error sending data to backend:', error);
            
          }
        );
      },
      error => {
        console.error('Error sending data to backend:', error);
        
      }
    );
    
  }

  
}
