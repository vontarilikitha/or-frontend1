import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DataService } from '../Services/data.service';
import { GraduateDetailsService } from '../Services/graduate-details.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-accepted-appointments',
  templateUrl: './accepted-appointments.component.html',
  styleUrl: './accepted-appointments.component.css'
})
export class AcceptedAppointmentsComponent implements OnInit {

  constructor(private http:HttpClient,private dataService:DataService,private renderer:Renderer2,private graduateDetailsService:GraduateDetailsService
  ){}

  @ViewChild('table1', { static: true }) table1!: ElementRef;
  jobs:any = {};
  file:any = {};

  async ngOnInit(){
      try{
        this.jobs = await this.graduateDetailsService.getAcceptedApplications();
        console.log(this.jobs);
        this.generateAcceptedTable();
      } catch(error){
        console.log(error);
      }
  }

  generateAcceptedTable(){
    
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

      let td10 = this.renderer.createElement('td');
      let btn = this.renderer.createElement('button');
      this.renderer.addClass(btn,"download");
      btn.innerHTML = `<i class="fa-solid fa-download dd"></i>Resume`;
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

      this.renderer.appendChild(td10,btn);
      this.renderer.appendChild(tr1,td10);

      this.renderer.appendChild(this.table1?.nativeElement,tr1);
    }
  }
  

}
