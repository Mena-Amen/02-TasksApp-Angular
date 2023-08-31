import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  lang: any = 'en';

  constructor(private translate: TranslateService) {
    this.lang = this.translate.currentLang;
    console.log(this.lang);
  }

  ngOnInit(): void {}

  changelang() {
    if (this.lang == 'ar') {
      localStorage.setItem('lang', 'en');
    } else {
      localStorage.setItem('lang', 'ar');
    }
    window.location.reload();
  }

  logout() {
    localStorage.removeItem('token');
  }
}
