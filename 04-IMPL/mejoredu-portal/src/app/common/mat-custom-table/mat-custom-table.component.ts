import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { TableActionsI, TableConsts } from './consts/table';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-mat-custom-table',
  templateUrl: './mat-custom-table.component.html',
  styleUrls: ['./mat-custom-table.component.scss'],
})
export class MatCustomTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @Output() action: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>();
  @Output() activate: EventEmitter<any> = new EventEmitter<any>();
  @Output() update: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() columns!: Array<TableColumn>;
  @Input() dataset: Array<any> = [];
  @Input() multiSelect: boolean = false;
  @Output() onMultiSelect: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() multiSelectDelete: boolean = false;
  @Output() onMultiSelectDelete: EventEmitter<any[]> = new EventEmitter<
    any[]
  >();
  @Input() actions?: TableActionsI;
  @Input() separatedActions: boolean = false;
  @Input() customBtn: string = '';
  @Input() addAction!: string;
  @Input() actionString!: string;
  @Input() noPadding: boolean = false;
  @Input() actionsString: string = 'Opciones';
  @Input() minWidth?: number;
  @Input() maxWidthActions?: string;
  @Input() complementText?: string;
  @Input() hideFilter: boolean = false;
  @Input() hasScroll: boolean = true;
  @Input() actionsInStart: boolean = false;
  @Input() showActionIf!: (action: string, value: any) => boolean;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  finalActions: TableActionsI[] = [];
  actionsStrings: string[] = [];
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [];
  value!: string;
  @Input() activeId = 0;
  @Input() propId = '';
  constructor(private cp: CurrencyPipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataset']) {
      try {
        this.dataSource.data = this.dataset;
      } catch (error) { }
    }
  }

  ngOnInit() {
    if (this.multiSelect) {
      this.displayedColumns.push('select');
    }

    if (this.actionsInStart) {
      this.generateActions();
    }

    // set table columns
    this.displayedColumns = this.displayedColumns.concat(
      this.columns
        .filter((x) => x.display === undefined || x.display)
        .map((x) => x.columnDef)
    ); // pre-fix static

    if (!this.actionsInStart) {
      this.generateActions();
    }

    this.dataSource = new MatTableDataSource<any>(this.dataset);
    this.dataSource._updateChangeSubscription();

    // set pagination
    this.dataSource.paginator = this.paginator;
  }

  generateActions() {
    if (this.actions) {
      if (!this.separatedActions) {
        this.displayedColumns.push('action1');
        this.finalActions.push(this.actions);
        this.actionsStrings.push(this.getActionString(''));
      } else {
        let i = 1;
        for (const item in this.actions) {
          const prop = item as keyof TableActionsI;
          this.finalActions.push({ [prop]: this.actions[prop] });
          this.displayedColumns.push('action' + i);
          this.actionsStrings.push(this.getActionString(prop));
          i++;
        }
      }
    }
  }

  getActionString(action: string): string {
    switch (action) {
      case TableConsts.actionButton.view:
        return (
          'Visualizar' + (this.complementText ? ' ' + this.complementText : '')
        );
      case TableConsts.actionButton.edit:
        return (
          'Editar' + (this.complementText ? ' ' + this.complementText : '')
        );
      case TableConsts.actionButton.delete:
        return (
          'Eliminar' + (this.complementText ? ' ' + this.complementText : '')
        );
      default:
        return this.actionString || 'Opciones';
    }
  }

  setMinWidth() {
    if (this.minWidth) {
      return `min-width: ${this.minWidth}px !important`;
    }
    return '';
  }

  onTableAction(e: TableButtonAction): void {
    this.action.emit(e);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    this.onMultiSelect.emit(this.selection.selected);
  }

  checkBoxSelected(row: any) {
    this.selection.toggle(row);
    this.onMultiSelect.emit(this.selection.selected);
  }

  emitDelete() {
    this.onMultiSelectDelete.emit();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  toggleSelection(row: any) {
    if (this.propId === '') {
      return false;
    }
    return row[this.propId] == this.activeId;
  }

  isColorGreen(col: any) {
    return typeof col === 'string'
      ? col?.includes('Revisión') ||
      col == 'Validado' ||
      col === 'Cumplido' ||
      col === 'Revisado'
      : false;
  }

  isColorOrange(col: any) {
    return typeof col === 'string' ? col == 'Guardado' : false;
  }

  isColorGolden(col: any) {
    return typeof col === 'string'
      ? col == 'Enviado a Enlace' || col == 'Formalizado'
      : false;
  }

  isColorRed(col: any) {
    return typeof col === 'string'
      ? col == 'Por Revisar' ||
      col == 'Sin Validar' ||
      col == 'Por Validar' ||
      col === 'Cancelado' ||
      col === 'Sin Revisar'
      : false;
  }

  isColorPurple(col: any) {
    return typeof col === 'string' ? col == 'Validado' : false;
  }

  isColorBlue(col: any) {
    return typeof col === 'string'
      ? col == 'Registrado' || col == 'Validación Técnica'
      : false;
  }

  isColorGrey(col: any) {
    return typeof col === 'string' ? col == 'Pre-registro' : false;
  }

  isColorBrown(col: any) {
    return typeof col === 'string' ? col == 'Rechazado' : false;
  }

  isColorYellow(col: any) {
    return typeof col === 'string'
      ? col == 'En Revisión' || col?.includes('En Proceso')
      : false;
  }

  isColorWhite(col: any) {
    return typeof col === 'string' ? col == 'Aprobado' : false;
  }

  injectValue(column: TableColumn, value: any): any {
    if (typeof column.columnDef === 'string') {
      if (column.isCurrency) {
        return this.cp.transform(parseInt(value));
      }
    }
    return value;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  emmitUpdate(): void {
    this.update.emit(true);
  }

  emmitActivate(item: any): void {
    this.activate.emit(item);
  }
}
