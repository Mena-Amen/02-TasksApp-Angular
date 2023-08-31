import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  lang: any = 'en';

  constructor(private translate: TranslateService, private router: Router) {
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
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }
}
