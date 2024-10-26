import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonStructure } from '@common/classes/common-structure.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { FormModalComponent } from './form-modal/form-modal.component';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { FromModalI } from './form-modal/interfaces/form-modal.interface';
import { CatalogsService } from '@common/services/catalogs.service';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.scss', '../configuration.component.scss'],
})
export class CatalogosComponent extends CommonStructure {
  editable: boolean = true;
  override columns: TableColumn[] = [
    { columnDef: 'id', header: 'Clave', width: '80px' },
    { columnDef: 'value', header: 'Descripción', alignLeft: true },
  ];
  catalogsPadre!: IItemCatalogoResponse[];
  catalogPadreSelect!: IItemCatalogoResponse;
  initForm!: FromModalI;

  constructor(
    private _formBuilder: QuestionControlService,
    private _dialog: MatDialog,
    public alertService: AlertService,
    private catalogosService: CatalogsService
  ) {
    super(alertService);
    this.buildForm();
    this.getCatalogosPadres();
  }

  buildForm() {
    this.questions = [
      new DropdownQuestion({
        filter: true,
        nane: 'catalog',
        label: 'Seleccionar Catálogo',
        options: [],
        validators: [],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.get('catalog')?.valueChanges.subscribe((value) => {
      this.catalogPadreSelect = this.catalogsPadre.filter(
        (item) => item.idCatalogo === value
      )[0];
      this.getDataCatalogosHijos(value);
    });
  }

  getCatalogosPadres() {
    this.catalogosService.consultarCatalogosPadre().subscribe({
      next: (value) => {
        this.questions[0].options = value.catalogo.map((item) => ({
          id: item.idCatalogo,
          value: item.cdOpcion,
        }));
        this.catalogsPadre = value.catalogo;
      },
    });
  }

  getDataCatalogosHijos(idCatalogoPadre: number) {
    this.catalogosService.consultarCatalogosHijos(idCatalogoPadre).subscribe({
      next: (value) => {
        this.data = (value.catalogo[0].registros || []).map((item) => ({
          id: item.ccExterna,
          value: item.cdOpcion,
          ...item,
        }));
      },
    });
  }

  openModal(data: FromModalI) {
    const dialogRef = this._dialog.open(FormModalComponent, {
      width: '500px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDataCatalogosHijos(this.catalogPadreSelect.idCatalogo);
      }
    });
  }

  override async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.openModal({
          catalogHijo: event.value,
          ...event.value,
          onlyView: true,
        });
        break;
      case TableConsts.actionButton.edit:
        this.openModal({
          catalogHijo: event.value,
          ...event.value,
        });
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this.alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Registro?',
          });
          if (confirm) {
            let catalogHijo: IItemCatalogoResponse = event.value;
            this.catalogosService
              .eliminarCatalogo(catalogHijo.idCatalogo)
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo == '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getDataCatalogosHijos(
                      this.catalogPadreSelect.idCatalogo
                    );
                  }
                },
              });
          }
        }
        break;
    }
  }

  refreshTable() {
    this.data = [];
    const { catalog } = this.form.getRawValue();
    this.getDataCatalogosHijos(catalog);
  }
}
