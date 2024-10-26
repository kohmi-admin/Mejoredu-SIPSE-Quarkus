import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { CatalogsService } from '@common/services/catalogs.service';
import { forkJoin, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent implements OnInit {
  @Input() editable: boolean = true;
  @Input() form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  @Output() emmitStep = new EventEmitter<number>();

  constructor(
    private _formBuilder: QuestionControlService,

    private catalogService: CatalogsService,
  ) {
    this.questions = [
      new TextboxQuestion({
        nane: 'valor',
        label: 'Valor de Línea Base',
        validators: [Validators.required],
      }),

      new DropdownQuestion({
        nane: 'anhio',
        label: 'Año',
        value: 2023,
        options: [
          {
            id: 2018,
            value: '2018'
          },
          {
            id: 2019,
            value: '2019'
          },
          {
            id: 2020,
            value: '2020'
          },
          {
            id: 2021,
            value: '2021'
          },
          {
            id: 2022,
            value: '2022'
          },
          {
            id: 2023,
            value: '2023'
          },
          {
            id: 2024,
            value: '2024'
          }
        ],
        validators: [Validators.required],
      }),
      new TextboxQuestion({
        nane: 'notasSobreLineaBase',
        label: 'Notas Sobre la Línea Base',
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      new TextboxQuestion({
        nane: 'meta',
        label: 'Meta',
        validators: [Validators.required],
      }),
      new TextareaQuestion({
        nane: 'notasSobreMeta',
        label: 'Nota Sobre la Meta',
        validators: [Validators.required],
      }),
    ];

    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  ngOnInit(): void {
    if (!this.editable) {
      this.form.disable();
    }
  }

  /* getCatalogs(){
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['nivelDesagregacion']
      ),
    ])
      .pipe(take(1))
      .subscribe(
        ([
          dataNivelDesagregacion,
        ]) => {
          this.questions[3].options = mapCatalogData({data: dataNivelDesagregacion})
        }
      );
  } */

  changeStep(add: number) {
    this.emmitStep.emit(add);
  }

  submit(): void {
  }

}
