import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DataService } from '../Services/data.service';
import { saveAs } from 'file-saver';
import { GraduateDetailsService } from '../Services/graduate-details.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {

  constructor(private http:HttpClient,private dataService:DataService,private renderer:Renderer2,private graduateDetailsService:GraduateDetailsService
  ){}

  jobs:any = {};
  file:any = {};

  showAcceptedTable:boolean = false;
  showRejectedTable: boolean = false;
  showPendingTable: boolean = true;
  
  @ViewChild('table1') table1: ElementRef | undefined;
/*
  ngAfterViewInit() {
    this.showAccepted();
  }
*/
  async showAccepted() {

    try {
      this.jobs  = await  this.graduateDetailsService.getPendingApplications();
      console.log(this.jobs);
      this.generateAcceptedTable();
    } catch (error) {
      console.error('Error fetching employers:', error);
    } 
  }

  async showRejected() {
    let a = await this.http.get(`http://localhost:8080/getPendingAppointmentsById/${this.dataService.userData.role.roleId}`).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  

  generateAcceptedTable(){
    if(this.table1?.nativeElement == null)
      return;
    if(Object.keys(this.jobs).length == 0){
      let tr1 = this.renderer.createElement('tr');
      let p = this.renderer.createElement('p');
      p.innerHTML = "No Appointments";
      this.renderer.addClass(p,'no-jobs');
      
      this.renderer.appendChild(tr1,p);
      this.renderer.appendChild(this.table1?.nativeElement,tr1);
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
          }
        );

         
      });
      this.renderer.appendChild(tr1,btn);

      this.renderer.appendChild(this.table1?.nativeElement,tr1);
    }
  }
  

}
