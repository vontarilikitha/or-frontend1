import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EmployersDetailsService } from '../Services/employers-details.service';
import { GraduateDetailsService } from '../Services/graduate-details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-graduates-list',
  templateUrl: './graduates-list.component.html',
  styleUrl: './graduates-list.component.css'
})
export class GraduatesListComponent implements OnInit {

  graduates: any[] = [];
  @ViewChild('table') table: ElementRef | undefined;

  constructor(private renderer: Renderer2, private graduateDetailsService: GraduateDetailsService,private router:Router) {}

  async ngOnInit() {
    try {
      this.graduates = await this.graduateDetailsService.getAllGraduates();
      
      this.generateTable();
    } catch (error) {
      console.error('Error fetching graduates:', error);
    }
  }

  generateTable() {
    // Clear existing table rows
    const tableElement = this.table?.nativeElement;
    while (tableElement.firstChild) {
      this.renderer.removeChild(tableElement, tableElement.firstChild);
    }

    for (let i = 0; i < this.graduates.length; i++) {
      
      let tr = this.renderer.createElement('tr');

      let td1 = this.renderer.createElement('td');
      let anchor = this.renderer.createElement('a');
      anchor.innerHTML = this.graduates[i].userName;
      
      
      this.renderer.setAttribute(anchor, "routerLink", "/graduate-profile"); 
      this.renderer.setAttribute(anchor,"href" ,"#");

      this.renderer.listen(anchor, 'click', (event) => {
        event.preventDefault();

        this.graduateDetailsService.graduateData = this.graduates[i];
        console.log('Anchor clicked');
        this.router.navigate(['/graduate-profile']);
         
      });

      this.renderer.appendChild(td1,anchor);
      this.renderer.appendChild(tr, td1);


      let td2 = this.renderer.createElement('td');
      td2.innerHTML = this.graduates[i].roleId;
      this.renderer.appendChild(tr, td2);

      let td3 = this.renderer.createElement('td');
      td3.innerHTML = this.graduates[i].email;
      this.renderer.appendChild(tr, td3);

      let td4 = this.renderer.createElement('td');
      td4.innerHTML = this.graduates[i].phoneNo;
      this.renderer.appendChild(tr, td4);

      let td5 = this.renderer.createElement('td');
      td5.innerHTML = this.graduates[i].college;
      this.renderer.appendChild(tr, td5);



      
      this.renderer.appendChild(this.table?.nativeElement, tr);
    }
  }

}
