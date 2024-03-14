import { Component, ElementRef, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, of } from 'rxjs';
import { Tutorial } from './models/model';
import { ServiceService } from './service.service';
import moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  @HostListener('window:resize', ['$event'])
  isSmallScreen: boolean = false;
  tutorial: Tutorial = new Tutorial();
  title = 'SOoorrY';
  answer= false;
  idNo=0;
  nosArray$: Observable<any> | null = null;
  nosArray=[
    {id: 1,text:'No'},
    {id: 2,text:'Andale porfavor'},
    {id: 3,text:'Te voy a dar chance una vez mas'},
    {id: 4,text:'estas segura?'},
    {id: 5,text:'estas completamente segura?'},
    {id: 6,text:'anane'},
    {id: 7,text:'pero segura segura?'},
    {id: 8,text:'por favor?'},
    {id: 9,text:'por favor por favor?'},
    {id: 10,text:'andale perdoname'},
    {id: 11,text:'deja de darle click aqui!'},
    {id: 12,text:'YA PERDONAME'},
    {id: 13,text:'no puedes decir que no'},
    {id: 14,text:'añañe'},
    {id: 15,text:'segura?'},
    {id: 16,text:'una ultima oportunidad'},
    {id: 17,text:'esta si es la ultima'},
    {id: 18,text:'ultima de a deberas'},
    {id: 19,text:'ultima ultima'},
    {id: 20,text:'segura que no?'},
  ]
  existsATrue:boolean=false;
  firstLoad: boolean=false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private tutorialService: ServiceService,
    private elementRef: ElementRef,
    ){
    this.nosArray$ = of(this.nosArray);
  }
  
  ngOnInit() {
    this.checkScreenSize();
    this.executeOnFirsRun();
  }
   executeOnFirsRun(){
    if(!this.firstLoad){
      console.log('entre')
      this.firstLoad = true;
      this.tutorialService.getAll().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(res => {
        this.existsATrue = res.some(x=> x.answer);
      });
    }
  }

  onResize(event) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
  }
  incrementNo(){
    if (this.answer ==true){
      return;
    }
    if (this.idNo < 19) {
      const ref = this.elementRef.nativeElement.querySelector('.container-button-yes');
      if(ref){
        this.idNo= this.idNo+1;
        const ref2 = this.elementRef.nativeElement.querySelector('.container-button-no');
        const randomX = Math.floor(Math.random() * window.innerWidth);
        const randomY = Math.floor(Math.random() * window.innerHeight);
        ref2.style.position = 'absolute';
        ref2.style.left = `${randomX}px`;
        ref2.style.top= `${randomY}px`
        const actualheight = ref.offsetHeight;
        const actualWidth = ref.offsetWidth;
        const newHeight = actualheight *1.3;
        const newWidth = actualWidth*1.3;
        ref.style.height = `${newHeight}px`
        ref.style.width  = `${newWidth}px`
      }
      this.uploadAnswer();
    }
    if(this.idNo == 19 ){
      const confirmation = confirm('Esta si es la ultima pregunta, quieres salir de esta pagina ??'); 
      if(confirmation){
        window.open('facebook.com', "_blank")
      }
    }
  }
  onYes(){
    this.answer =true;
      
    this.uploadAnswer();
  }
  onWeddingYes(){
    this.tutorialService.sendEmailsSequentially({answer:'¡ ¡ ¡ DIJO QUE SI ! ! ! !'});
  }
  onWeddingNo(){
    this.tutorialService.sendEmail({answer:'chale :C'});
  }

  uploadAnswer(){
    this.tutorial = new Tutorial();
    this.tutorial.answer = this.answer;
    this.tutorial.dateBTW = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');
    this.tutorialService.create(this.tutorial).then((x) => {
      console.log('Created new item successfully!',x);
    });
  }
}
