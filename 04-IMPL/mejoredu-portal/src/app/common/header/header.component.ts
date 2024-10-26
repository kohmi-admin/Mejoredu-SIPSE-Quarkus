import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IHeaderNavigation } from './interfaces/navigation.interface';
import { FormGroup } from '@angular/forms';
import {
  faBell,
  faBook,
  faPenToSquare,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, forkJoin, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import * as moment from 'moment';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { NotificationService } from '@site/floating-window/nitification/notification.service';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { getCanEdit } from '@common/utils/Utils';
import packageJson from "../../../../package.json";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() moduleName: string = 'Módulo';
  @Input() actionLabel: string = '';
  @Input() icon: 'add' | 'filter' | 'calendar' = 'calendar';
  @Input() sticky: boolean = true;
  @Input() hideNotice: boolean = false;
  @Input() navigation: IHeaderNavigation[] = [];
  @Output() onAction: EventEmitter<void> = new EventEmitter();
  @Output() onFind: EventEmitter<string> = new EventEmitter();
  @Output() openSection: EventEmitter<string> = new EventEmitter();
  form!: FormGroup;
  routes: string[] = [];
  showFinder: boolean = false;
  yearNav: string = '';
  notifier = new Subject();
  user: IDatosUsuario;
  ls = new SecureLS({ encodingType: 'aes' });
  yearNavList: string[] = [];
  showUnidad: boolean = false;
  showVersion: boolean = false;

  icons = {
    bell: faBell,
    question: faQuestion,
    book: faBook,
    pen: faPenToSquare,
  };

  constructor(
    private _router: Router,
    public notificationsService: NotificationService,
    private catalogService: CatalogsService
  ) {
    this.user = this.ls.get('dUaStEaR');
    this.yearNavList = this.ls.get('yearNavList') ?? [];
    const yearNavStorage = this.ls.get('yearNav');
    if (yearNavStorage) {
      this.yearNav = yearNavStorage;
    } else {
      this.ls.set('yearNav', this.yearNav);
      this.yearNav = String(new Date().getFullYear());
    }
    this.getlistAnhios();
    this.setCanEdit();
    this.ls.set('yearNav', this.yearNav);
  }

  ngOnInit(): void {
    this.setRoute();
    this._router.events
      .pipe(
        takeUntil(this.notifier),
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe((ev: NavigationEnd) => {
        this.setRoute();
      });
  }

  setCanEdit() {
    this.ls.set('canEdit', getCanEdit(+this.yearNav));
  }

  setRoute(): void {
    let href = window.location.href;
    href = decodeURIComponent(href);
    const path: any[] = href.split('/');
    path.splice(0, 3);
    path.unshift('Inicio');
    this.routes = path;
  }

  navigate(index: number): void {
    if (index === 0) {
      this._router.navigate(['/']);
    } else {
      const final = this.routes.filter((r, i) => i !== 0 && i <= index);
      this._router.navigate(final);
    }
  }

  getlistAnhios() {
    if (!this.yearNavList.length) {
      forkJoin([
        this.catalogService.getCatalogById(
          environment.endpoints.catalogs['anhoPublicar']
        ),
      ])
        .pipe(takeUntil(this.notifier))
        .subscribe(([dataAnhio]) => {
          this.yearNavList = dataAnhio.catalogo.map((item) => item.cdOpcion);
          this.ls.set('yearNavList', this.yearNavList);
        });
    }
  }

  getDate(): string {
    return moment().format('DD/MM/YYYY');
  }

  triggerAction(): void {
    this.onAction.emit();
  }

  emmitFind(text: string): void {
    this.onFind.emit(text);
  }

  logout() {
    this.ls.clear();
    this._router.navigate(['/login']);
  }

  selectedYear(year: string) {
    if (this.yearNav !== year) {
      this.yearNav = year;
      this.ls.set('yearNav', year);
      window.location.reload();
    }
  }

  getNoSeenNotifications(): number | undefined {
    return (
      this.notificationsService.notifications.filter((n) => !n.seen)?.length ||
      undefined
    );
  }

  handleShowUnidad() {
    this.showUnidad = true;
    setTimeout(() => {
      this.showUnidad = false;
    }, 3000);
  }

  handleShowVersion() {
    this.showVersion = true;
    setTimeout(() => {
      this.showVersion = false;
    }, 3000);
  }

  getVersion() {
    return `v${packageJson.version}`;
  }

  getUnidadUser(): string {
    let nivelSupervisor =
      this.user.idTipoUsuario === 'SUPERVISOR'
        ? ` - N: ${this.user.perfilLaboral?.ixNivel}`
        : '';
    return `${this.user.perfilLaboral.cveUnidad}${nivelSupervisor}`;
  }
}
