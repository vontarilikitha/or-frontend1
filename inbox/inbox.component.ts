import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MessagesService } from '../Services/messages.service';
import { Router } from '@angular/router';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class InboxComponent {

  constructor(private messagesService:MessagesService,private renderer:Renderer2,private router:Router,private dataService:DataService){}

  @ViewChild('messages', { static: true }) table!: ElementRef;
  @ViewChild('roleId') roleId!: ElementRef;
  @ViewChild('message') message!: ElementRef;

  roleId2:string = "";
  roleId3:string = "";

  messages:any;
  showModal:boolean = false;
  async ngOnInit(){
    try{
      this.messages = await this.messagesService.getInBox();
      console.log(2);
      console.log(this.messages);
      this.generateOutBox();  
    }
    catch(error){
      console.log('error fetching messages',error);
    }
    
  }

  generateOutBox(){
    console.log(3);
    if(Object.keys(this.messages).length == 0){
      let p = this.renderer.createElement('p');
      p.innerHTML = "No Messages Sent";
      
      this.renderer.appendChild(this.table.nativeElement,p);
      return;
    }
    

    for(let i=Object.keys(this.messages).length -1 ; i>=0 ; i--){

      //console.log(this.messages[i]);
      let task = this.renderer.createElement('div');
      this.renderer.addClass(task,'task');

      if(this.dataService.isAdmin){
        let btndiv = this.renderer.createElement('div');
        this.renderer.addClass(btndiv,"btn-area2");

        let to = this.renderer.createElement('div');
        this.renderer.addClass(to,'to');

        let h31 = this.renderer.createElement('h3');
        h31.innerHTML = "From : ";

        let h41 = this.renderer.createElement('h4');
        h41.innerHTML = this.messages[i].from.roleId;
        
        this.renderer.appendChild(to,h31);
        this.renderer.appendChild(to,h41);

        let btn = this.renderer.createElement('button');
        btn.innerHTML = "Reply";
        this.renderer.listen(btn,'click',(event) => {

          this.roleId3 = this.messages[i].from.roleId;
          this.showModal = true;
          
        } );

        this.renderer.appendChild(btndiv,to);
        this.renderer.appendChild(btndiv,btn);
        this.renderer.appendChild(task,btndiv);

      }
      else{
        let to = this.renderer.createElement('div');
        this.renderer.addClass(to,'to');

        let h31 = this.renderer.createElement('h3');
        h31.innerHTML = "From : ";

        let h41 = this.renderer.createElement('h4');
        h41.innerHTML = this.messages[i].from.roleId;
        
        this.renderer.appendChild(to,h31);
        this.renderer.appendChild(to,h41);
        this.renderer.appendChild(task,to);
      }

      let hr = this.renderer.createElement('hr');

      this.renderer.appendChild(task,hr);
      
      let msg = this.renderer.createElement('div');
      this.renderer.addClass(msg,'msg');

      let h32 = this.renderer.createElement('h3');
      h32.innerHTML = "Message : "

      let h42 = this.renderer.createElement('h4');
      h42.innerHTML = this.messages[i].message;

      this.renderer.appendChild(msg,h32);
      this.renderer.appendChild(msg,h42);

      this.renderer.appendChild(task,msg);

      this.renderer.appendChild(this.table.nativeElement,task);
    }
  }

  addMessage(){
    this.messagesService.addMessage(this.roleId?.nativeElement.value,this.message?.nativeElement.value);
    this.router.navigateByUrl("/outbox");
  }

  compose(){
    this.showModal = !this.showModal;
  }

}
