import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { getBase64Image } from '@common/utils/Utils';
import { IReporteAcceso } from '@common/interfaces/excel/reporte-acceso.interface';
//import  * as libre from  'libreoffice-convert';

@Injectable({
  providedIn: 'root',
})
export class ExcelJsService {
  async createExcelReporteAcceso({
    reportType,
    data,
  }: {
    reportType: string;
    data: IReporteAcceso[];
  }) {
    const title = `Reporte de ${reportType === 'alta' ? 'alta' : 'cancelación'
      } de acceso al Sistema de Planeación, Seguimiento y Evaluación`;

    // Crear un nuevo libro de trabajo
    let workbook = new Workbook();
    // Crear una nueva hoja de trabajo
    let worksheet = workbook.addWorksheet(
      `${reportType === 'alta' ? 'Alta' : 'Cancelación'}`
    );

    worksheet.addRow([]);
    worksheet.mergeCells('A1:C5');
    try {
      const image = await getBase64Image('assets/full-icon.png');
      // Agregar la imagen
      let logo = workbook.addImage({
        base64: image,
        extension: 'png',
      });

      worksheet.addImage(logo, {
        tl: { col: 0, row: 0 },
        ext: { width: 400, height: 90 },
      });
    } catch (error) { }

    worksheet.getCell('E2').value = title;
    worksheet.mergeCells('E2:G3');

    const cellFecha = worksheet.getCell('F4');
    cellFecha.value = 'Fecha:';
    cellFecha.alignment = { horizontal: 'right' };
    cellFecha.font = { bold: true };

    const cellFechaValue = worksheet.getCell('G4');
    cellFechaValue.value = `${moment().format('DD/MM/YYYY')}`;

    const cellHora = worksheet.getCell('F5');
    cellHora.value = 'Hora:';
    cellHora.alignment = { horizontal: 'right' };
    cellHora.font = { bold: true };

    const cellHoraValue = worksheet.getCell('G5');
    cellHoraValue.value = `${moment().format('HH:mm')}`;

    worksheet.addRow([]);
    worksheet.mergeCells('A6:G6');

    // Agregar datos a la hoja de trabajo
    worksheet.columns = [
      { header: '', key: 'no', width: 5 },
      { header: '', key: 'numeroEmpleado', width: 23 },
      { header: '', key: 'nombreCompleto', width: 33 },
      { header: '', key: 'rolAsignado', width: 15 },
      { header: '', key: 'motivoAcceso', width: 35 },
      {
        header: '',
        key: 'fechaHoraAsignacion',
        width: 25,
        font: { bold: true },
      },
      {
        header: '',
        key: 'fechaHoraAcceso',
        width: 35,
        font: { bold: true },
      },
    ];

    worksheet.addRow({
      no: 'No.',
      numeroEmpleado: 'Número de empleado',
      nombreCompleto: 'Nombre completo',
      rolAsignado: 'Rol asignado',
      motivoAcceso: `Motivo de ${reportType === 'alta' ? 'alta' : 'cancelación'
        } de acceso`,
      fechaHoraAsignacion: 'Fecha y hora de asignación',
      fechaHoraAcceso: `Fecha y hora de ${reportType === 'alta' ? 'alta' : 'cancelación'
        } de acceso`,
    });

    worksheet.getCell('A7').font = { bold: true };
    worksheet.getCell('B7').font = { bold: true };
    worksheet.getCell('C7').font = { bold: true };
    worksheet.getCell('D7').font = { bold: true };
    worksheet.getCell('E7').font = { bold: true };
    worksheet.getCell('F7').font = { bold: true };
    worksheet.getCell('G7').font = { bold: true };

    worksheet.addRows(data);

    // Guardar el libro de trabajo en un archivo
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(
        blob,
        `Reporte-de-${reportType === 'alta' ? 'alta' : 'cancelación'
        }-de-acceso-${moment().format('DDMMYYYY')}.xlsx`
      );
    });
  }

  async createExcelReporteProyectoAnual({
    data,
    dataVistaGeneral,
  }: {
    data: any[];
    dataVistaGeneral: any;
  }) {
    // Crear un nuevo libro de trabajo
    let workbook = new Workbook();
    // Crear una nueva hoja de trabajo
    let worksheet = workbook.addWorksheet(
      `${dataVistaGeneral.cveProyectoFull}`
    );

    worksheet.addRow([]);
    worksheet.mergeCells('A2:C8');
    try {
      const image = await getBase64Image('assets/full-icon.png');
      // Agregar la imagen
      let logo = workbook.addImage({
        base64: image,
        extension: 'png',
      });

      worksheet.addImage(logo, {
        tl: { col: 0, row: 1 },
        ext: { width: 400, height: 90 },
      });
    } catch (error) { }

    const cell0 = worksheet.getCell('D2');
    cell0.value = 'SISTEMA DE PLANEACIÓN, SEGUIMIENTO Y EVALUACIÓN (SIPSE)';
    cell0.font = { bold: true };
    worksheet.mergeCells('D2:G2');

    const cell1 = worksheet.getCell('D3');
    cell1.value = 'Planeación a corto plazo';
    cell1.font = { bold: true };

    const cell2 = worksheet.getCell('D4');
    cell2.value = 'Reporte de formulación de proyecto PAA';

    const cell3 = worksheet.getCell('D5');
    cell3.value = `Proyecto Anual ${dataVistaGeneral.anhio}`;

    const cell4 = worksheet.getCell('D6');
    cell4.value = dataVistaGeneral.nombreUnidad;

    const cell5 = worksheet.getCell('D7');
    cell5.value = 'Clave y nombre del proyecto:';
    cell5.font = { bold: true };

    const cell5Value = worksheet.getCell('E7');
    cell5Value.value = `${dataVistaGeneral.cveProyectoFull}. ${dataVistaGeneral.nombreProyecto}`;

    const cell6 = worksheet.getCell('D8');
    cell6.value = 'Objetivo:';
    cell6.font = { bold: true };

    const cell6Value = worksheet.getCell('E8');
    cell6Value.value = dataVistaGeneral.objetivo;

    const cellFecha = worksheet.getCell('F3');
    cellFecha.value = 'Fecha:';
    cellFecha.alignment = { horizontal: 'right' };
    cellFecha.font = { bold: true };

    const cellFechaValue = worksheet.getCell('G3');
    cellFechaValue.value = `${moment().format('DD/MM/YYYY')}`;

    worksheet.addRow([]);
    worksheet.mergeCells('A9:AM9');

    // Programa institucional
    const cellProgramaInstitucional = worksheet.getCell('A10');
    worksheet.mergeCells('A10:A11');
    cellProgramaInstitucional.value = 'Programa Institucional';
    cellProgramaInstitucional.font = { bold: true };
    cellProgramaInstitucional.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cellProgramaInstitucional.alignment = { vertical: 'middle' };

    // Actividades
    const cellActividades = worksheet.getCell('B10');
    worksheet.mergeCells('B10:D10');
    cellActividades.value = 'Actividades';
    cellActividades.font = { bold: true };
    cellActividades.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellActividadesClave = worksheet.getCell('B11');
    cellActividadesClave.value = 'Clave';
    cellActividadesClave.font = { bold: true };
    cellActividadesClave.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellActividadesNombre = worksheet.getCell('C11');
    cellActividadesNombre.value = 'Nombre';
    cellActividadesNombre.font = { bold: true };
    cellActividadesNombre.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellActividadesAgenda = worksheet.getCell('D11');
    cellActividadesAgenda.value = 'Agenda de autoridades';
    cellActividadesAgenda.font = { bold: true };
    cellActividadesAgenda.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Productos
    const cellProductos = worksheet.getCell('E10');
    worksheet.mergeCells('E10:W10');
    cellProductos.value = 'Productos';
    cellProductos.font = { bold: true };
    cellProductos.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosNo = worksheet.getCell('E11');
    cellProductosNo.value = 'No.';
    cellProductosNo.font = { bold: true };
    cellProductosNo.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosClave = worksheet.getCell('F11');
    cellProductosClave.value = 'Clave Completa';
    cellProductosClave.font = { bold: true };
    cellProductosClave.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosNombre = worksheet.getCell('G11');
    cellProductosNombre.value = 'Nombre';
    cellProductosNombre.font = { bold: true };
    cellProductosNombre.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosCategoria = worksheet.getCell('H11');
    cellProductosCategoria.value = 'Categoria';
    cellProductosCategoria.font = { bold: true };
    cellProductosCategoria.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosTipo = worksheet.getCell('I11');
    cellProductosTipo.value = 'Tipo';
    cellProductosTipo.font = { bold: true };
    cellProductosTipo.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosIndicadorMir = worksheet.getCell('J11');
    cellProductosIndicadorMir.value = 'Indicador MIR';
    cellProductosIndicadorMir.font = { bold: true };
    cellProductosIndicadorMir.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosEne = worksheet.getCell('K11');
    cellProductosEne.value = 'E';
    cellProductosEne.font = { bold: true };
    cellProductosEne.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosFeb = worksheet.getCell('L11');
    cellProductosFeb.value = 'F';
    cellProductosFeb.font = { bold: true };
    cellProductosFeb.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosMar = worksheet.getCell('M11');
    cellProductosMar.value = 'M';
    cellProductosMar.font = { bold: true };
    cellProductosMar.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosAbr = worksheet.getCell('N11');
    cellProductosAbr.value = 'A';
    cellProductosAbr.font = { bold: true };
    cellProductosAbr.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosMay = worksheet.getCell('O11');
    cellProductosMay.value = 'M';
    cellProductosMay.font = { bold: true };
    cellProductosMay.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosJun = worksheet.getCell('P11');
    cellProductosJun.value = 'J';
    cellProductosJun.font = { bold: true };
    cellProductosJun.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosJul = worksheet.getCell('Q11');
    cellProductosJul.value = 'J';
    cellProductosJul.font = { bold: true };
    cellProductosJul.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosAgo = worksheet.getCell('R11');
    cellProductosAgo.value = 'A';
    cellProductosAgo.font = { bold: true };
    cellProductosAgo.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosSep = worksheet.getCell('S11');
    cellProductosSep.value = 'S';
    cellProductosSep.font = { bold: true };
    cellProductosSep.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosOct = worksheet.getCell('T11');
    cellProductosOct.value = 'O';
    cellProductosOct.font = { bold: true };
    cellProductosOct.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosNov = worksheet.getCell('U11');
    cellProductosNov.value = 'N';
    cellProductosNov.font = { bold: true };
    cellProductosNov.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosDic = worksheet.getCell('V11');
    cellProductosDic.value = 'D';
    cellProductosDic.font = { bold: true };
    cellProductosDic.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellProductosPotic = worksheet.getCell('W11');
    cellProductosPotic.value = 'POTIC';
    cellProductosPotic.font = { bold: true };
    cellProductosPotic.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Acciones
    const cellAcciones = worksheet.getCell('X10');
    worksheet.mergeCells('X10:AM10');
    cellAcciones.value = 'Acciones';
    cellAcciones.font = { bold: true };
    cellAcciones.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesClave = worksheet.getCell('X11');
    cellAccionesClave.value = 'Clave';
    cellAccionesClave.font = { bold: true };
    cellAccionesClave.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesNombre = worksheet.getCell('Y11');
    cellAccionesNombre.value = 'Nombre';
    cellAccionesNombre.font = { bold: true };
    cellAccionesNombre.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesPArtidaGasto = worksheet.getCell('Z11');
    cellAccionesPArtidaGasto.value = 'Partida de Gasto';
    cellAccionesPArtidaGasto.font = { bold: true };
    cellAccionesPArtidaGasto.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesAnual = worksheet.getCell('AA11');
    cellAccionesAnual.value = 'Anual';
    cellAccionesAnual.font = { bold: true };
    cellAccionesAnual.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesEne = worksheet.getCell('AB11');
    cellAccionesEne.value = 'ENE';
    cellAccionesEne.font = { bold: true };
    cellAccionesEne.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesFeb = worksheet.getCell('AC11');
    cellAccionesFeb.value = 'FEB';
    cellAccionesFeb.font = { bold: true };
    cellAccionesFeb.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesMar = worksheet.getCell('AD11');
    cellAccionesMar.value = 'MAR';
    cellAccionesMar.font = { bold: true };
    cellAccionesMar.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesabr = worksheet.getCell('AE11');
    cellAccionesabr.value = 'ABR';
    cellAccionesabr.font = { bold: true };
    cellAccionesabr.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesMay = worksheet.getCell('AF11');
    cellAccionesMay.value = 'MAY';
    cellAccionesMay.font = { bold: true };
    cellAccionesMay.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesJun = worksheet.getCell('AG11');
    cellAccionesJun.value = 'JUN';
    cellAccionesJun.font = { bold: true };
    cellAccionesJun.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesJul = worksheet.getCell('AH11');
    cellAccionesJul.value = 'JUL';
    cellAccionesJul.font = { bold: true };
    cellAccionesJul.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesAgo = worksheet.getCell('AI11');
    cellAccionesAgo.value = 'AGO';
    cellAccionesAgo.font = { bold: true };
    cellAccionesAgo.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesSep = worksheet.getCell('AJ11');
    cellAccionesSep.value = 'SEP';
    cellAccionesSep.font = { bold: true };
    cellAccionesSep.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesOct = worksheet.getCell('AK11');
    cellAccionesOct.value = 'OCT';
    cellAccionesOct.font = { bold: true };
    cellAccionesOct.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesNov = worksheet.getCell('AL11');
    cellAccionesNov.value = 'NOV';
    cellAccionesNov.font = { bold: true };
    cellAccionesNov.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    const cellAccionesDic = worksheet.getCell('AM11');
    cellAccionesDic.value = 'DIC';
    cellAccionesDic.font = { bold: true };
    cellAccionesDic.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Agregar datos a la hoja de trabajo
    worksheet.columns = [
      { header: '', key: 'programaInstitucional', width: 25 },
      { header: '', key: 'ActividadesClave', width: 9 },
      { header: '', key: 'ActividadesNombre', width: 50 },
      { header: '', key: 'ActividadesAgenda', width: 28 },
      { header: '', key: 'productosNo', width: 6 },
      { header: '', key: 'productosClave', width: 20 },
      { header: '', key: 'productosNombre', width: 20 },
      { header: '', key: 'productosCategoria', width: 20 },
      { header: '', key: 'productosTipo', width: 20 },
      { header: '', key: 'productosIndicadorMir', width: 15 },
      { header: '', key: 'productosEne', width: 3 },
      { header: '', key: 'productosFeb', width: 3 },
      { header: '', key: 'productosMar', width: 3 },
      { header: '', key: 'productosAbr', width: 3 },
      { header: '', key: 'productosMay', width: 3 },
      { header: '', key: 'productosJun', width: 3 },
      { header: '', key: 'productosJul', width: 3 },
      { header: '', key: 'productosAgo', width: 3 },
      { header: '', key: 'productosSep', width: 3 },
      { header: '', key: 'productosOct', width: 3 },
      { header: '', key: 'productosNom', width: 3 },
      { header: '', key: 'productosDic', width: 3 },
      { header: '', key: 'productosPotic', width: 20 },
      { header: '', key: 'accionesClave', width: 6 },
      { header: '', key: 'accionesNombre', width: 60 },
      { header: '', key: 'accionesPartida', width: 50 },
      { header: '', key: 'accionesAnual', width: 10 },
      { header: '', key: 'accionesEne', width: 10 },
      { header: '', key: 'accionesFeb', width: 10 },
      { header: '', key: 'accionesMar', width: 10 },
      { header: '', key: 'accionesAbr', width: 10 },
      { header: '', key: 'accionesMay', width: 10 },
      { header: '', key: 'accionesJun', width: 10 },
      { header: '', key: 'accionesJul', width: 10 },
      { header: '', key: 'accionesAgo', width: 10 },
      { header: '', key: 'accionesSep', width: 10 },
      { header: '', key: 'accionesOct', width: 10 },
      { header: '', key: 'accionesNov', width: 10 },
      { header: '', key: 'accionesDic', width: 10 },
    ];

    const currentRowIdx = worksheet.rowCount;

    worksheet.addRows(data);

    let posProgramas = currentRowIdx;
    let posActividades = currentRowIdx;
    let posProductos = 0;
    let posAcciones = 0;
    for (const programa of dataVistaGeneral.programas) {
      posProductos = posProgramas;
      posAcciones = posProgramas;
      const rowSpan = this.getRowSpanProyecto(programa);
      if (rowSpan > 1) {
        worksheet.mergeCells(`A${posProgramas + 1}:A${posProgramas + rowSpan}`);
        worksheet.getCell(`A${posProgramas + 1}`).alignment = {
          vertical: 'middle',
        };
        posProgramas += rowSpan;
      } else {
        posProgramas++;
      }

      if (programa.actividades.length) {
        for (const actividad of programa.actividades) {
          const rowSpanActividad = this.getRowSpanActividad(actividad);
          if (rowSpanActividad > 1) {
            worksheet.mergeCells(
              `B${posActividades + 1}:B${posActividades + rowSpanActividad}`
            );
            worksheet.getCell(`B${posActividades + 1}`).alignment = {
              vertical: 'middle',
            };
            worksheet.mergeCells(
              `C${posActividades + 1}:C${posActividades + rowSpanActividad}`
            );
            worksheet.getCell(`C${posActividades + 1}`).alignment = {
              vertical: 'middle',
            };
            worksheet.mergeCells(
              `D${posActividades + 1}:D${posActividades + rowSpanActividad}`
            );
            worksheet.getCell(`D${posActividades + 1}`).alignment = {
              vertical: 'middle',
            };
            posActividades += rowSpanActividad;
          } else {
            posActividades++;
          }

          if (actividad.productos.length) {
            for (const producto of actividad.productos) {
              const rowSpanProductos = this.getRowSpanProducto(producto);

              if (rowSpanProductos > 1) {
                worksheet.mergeCells(
                  `E${posProductos + 1}:E${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`E${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `F${posProductos + 1}:F${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`F${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `G${posProductos + 1}:G${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`G${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `H${posProductos + 1}:H${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`H${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `I${posProductos + 1}:I${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`I${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `J${posProductos + 1}:J${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`J${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `K${posProductos + 1}:K${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`K${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `L${posProductos + 1}:L${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`L${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `M${posProductos + 1}:M${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`M${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `N${posProductos + 1}:N${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`N${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `O${posProductos + 1}:O${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`O${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `P${posProductos + 1}:P${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`P${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `Q${posProductos + 1}:Q${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`Q${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `R${posProductos + 1}:R${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`R${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `S${posProductos + 1}:S${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`S${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `T${posProductos + 1}:T${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`T${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `U${posProductos + 1}:U${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`U${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `V${posProductos + 1}:V${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`V${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                worksheet.mergeCells(
                  `W${posProductos + 1}:W${posProductos + rowSpanProductos}`
                );
                worksheet.getCell(`W${posProductos + 1}`).alignment = {
                  vertical: 'middle',
                };
                posProductos += rowSpanProductos;
              } else {
                posProductos++;
              }
              if (producto.acciones?.length) {
                for (const accion of producto.acciones) {
                  const rowSpanAcciones = this.getRowSpanAccion(accion);
                  if (rowSpanAcciones > 1) {
                    worksheet.mergeCells(
                      `X${posAcciones + 1}:X${posAcciones + rowSpanAcciones}`
                    );
                    worksheet.getCell(`X${posAcciones + 1}`).alignment = {
                      vertical: 'middle',
                    };
                    worksheet.mergeCells(
                      `Y${posAcciones + 1}:Y${posAcciones + rowSpanAcciones}`
                    );
                    worksheet.getCell(`Y${posAcciones + 1}`).alignment = {
                      vertical: 'middle',
                    };
                    posAcciones += rowSpanAcciones;
                  } else {
                    posAcciones++;
                  }
                }
              }
            }
          }
        }
      }
    }

    // Guardar el libro de trabajo en un archivo
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `Proyecto-anual-${moment().format('DDMMYYYY')}.xlsx`);
    });
  }

  async createExcelSolicitudesAdecuaciones(data: any[]) {
    let workbook = new Workbook();
    let output_path = '/'
    
    // Crear una nueva hoja de trabajo
    const title = 'Reporte general de solicitudes de adecuaciones';

    // Crear un nuevo libro de trabajo
    // Crear una nueva hoja de trabajo



    let worksheet = workbook.addWorksheet('reporte general');
    worksheet.addRow([]);
    worksheet.mergeCells('A1:B5');
    try {
      const image = await getBase64Image('assets/full-icon.png');
      // Agregar la imagen
      let logo = workbook.addImage({
        base64: image,
        extension: 'png',
      });

      worksheet.addImage(logo, {
        tl: { col: 0, row: 0 },
        ext: { width: 400, height: 90 },
      });
    } catch (error) { }

    const cellSistema = worksheet.getCell('C2');
    cellSistema.value = 'SISTEMA DE PLANEACIÓN, SEGUIMIENTO Y EVALUACIÓN (SIPSE)';
    cellSistema.font = { bold: true }
    worksheet.mergeCells('C2:E2');

    worksheet.getCell('C3').value = title;
    worksheet.getCell('C3').font = { bold: true }
    worksheet.mergeCells('C3:F4');


    const cellFecha = worksheet.getCell('C5');
    cellFecha.value = 'Fecha:';
    cellFecha.alignment = { horizontal: 'right' };
    cellFecha.font = { bold: true };

    const cellFechaValue = worksheet.getCell('D5');
    cellFechaValue.value = `${moment().format('DD/MM/YYYY')}`;

    const cellHora = worksheet.getCell('C6');
    cellHora.value = 'Hora:';
    cellHora.alignment = { horizontal: 'right' };
    cellHora.font = { bold: true };

    const cellHoraValue = worksheet.getCell('D6');
    cellHoraValue.value = `${moment().format('HH:mm')}`;

    worksheet.addRow([]);
    worksheet.mergeCells('A7:G7');

    //worksheet.addRow([]);

    worksheet.columns = [
      /* { header: '', key: '', width: 10 }, */
      { header: '', key: 'folioSolicitud', width: 30 },
      { header: '', key: 'fSolicitud', width: 30 },
      { header: '', key: 'fAutorizacion', width: 15 },
      { header: '', key: 'unidad', width: 30 },
      { header: '', key: 'anhioId', width: 15 },
      { header: '', key: 'tipoAdecuacion', width: 30 },
      { header: '', key: 'tipoModificacion', width: 15 },
      { header: '', key: 'montoAplicacion', width: 15 },
      { header: '', key: 'status', width: 15 },
    ];
    worksheet.addRow({
      folioSolicitud: 'Folio de Solicitud',
      fSolicitud: 'Fecha de Solicitud',
      fAutorizacion: 'Fecha de Autorización',
      unidad: 'Unidad',
      anhioId: 'Año',
      tipoAdecuacion: 'Tipo de Adecuación',
      tipoModificacion: 'Tipo de Modificación',
      montoAplicacion: 'Monto de Aplicación',
      status: 'Estatus',

    });
    worksheet.addRows(data);


    workbook.xlsx.writeBuffer().then((data: any) => {

      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `reporte general.xlsx`);
      /* const done = (err, pdf) => {
        if (err) {
        }
        fs.writeFileSync(output_path, pdf);
      };
      libre.convert(data, '.pdf', undefined, done); */
    });
    
  }

  async createExcelReporteGeneralAvancesProgramaticos(data: any[]) {
    let workbook = new Workbook();
    // Crear una nueva hoja de trabajo
    const title = 'Reporte general de avances programaticos';

    // Crear un nuevo libro de trabajo
    // Crear una nueva hoja de trabajo



    let worksheet = workbook.addWorksheet('reporte general');
    worksheet.addRow([]);
    worksheet.mergeCells('A1:A5');
    try {
      const image = await getBase64Image('assets/full-icon.png');
      // Agregar la imagen
      let logo = workbook.addImage({
        base64: image,
        extension: 'png',
      });

      worksheet.addImage(logo, {
        tl: { col: 0, row: 0 },
        ext: { width: 400, height: 90 },
      });
    } catch (error) { }

    const cellSistema = worksheet.getCell('B2');
    cellSistema.value = 'SISTEMA DE PLANEACIÓN, SEGUIMIENTO Y EVALUACIÓN (SIPSE)';
    cellSistema.font = { bold: true }
    worksheet.mergeCells('B2:C2');

    worksheet.getCell('B3').value = title;
    worksheet.getCell('B3').font = { bold: true }
    worksheet.mergeCells('B3:E4');


    const cellFecha = worksheet.getCell('B5');
    cellFecha.value = 'Fecha:';
    cellFecha.alignment = { horizontal: 'right' };
    cellFecha.font = { bold: true };

    const cellFechaValue = worksheet.getCell('C5');
    cellFechaValue.value = `${moment().format('DD/MM/YYYY')}`;

    const cellHora = worksheet.getCell('B6');
    cellHora.value = 'Hora:';
    cellHora.alignment = { horizontal: 'right' };
    cellHora.font = { bold: true };

    const cellHoraValue = worksheet.getCell('C6');
    cellHoraValue.value = `${moment().format('HH:mm')}`;

    worksheet.addRow([]);
    worksheet.mergeCells('A7:G7');

    //worksheet.addRow([]);

    worksheet.columns = [
      /* { header: '', key: '', width: 10 }, */
      { header: '', key: 'cveProyecto', width: 60 },
      { header: '', key: 'cveActividad', width: 60 },
      { header: '', key: 'cveProducto', width: 60 },
      { header: '', key: 'mesStr', width: 15 },
    ];
    worksheet.addRow({
      cveProyecto: 'Clave y Nombre del Proyecto',
      cveActividad: 'Clave y Nombre de las Actividades',
      cveProducto: 'Clave y Nombre de los Productos',
      mesStr: 'Mes Programado',
    });
    worksheet.addRows(data);


    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `reporte general.xlsx`);
    });
  }

  getRowSpanProyecto(itemProyecto: any): number {
    let totalLength = 0;
    if (itemProyecto.actividades.length) {
      for (const itemActivities of itemProyecto.actividades) {
        if (itemActivities.productos.length) {
          for (const itemProducto of itemActivities.productos) {
            if (itemProducto.acciones.length) {
              for (const itemAccion of itemProducto.acciones) {
                if (itemAccion.partidasGasto.length) {
                  totalLength += itemAccion.partidasGasto.length;
                } else totalLength++;
              }
            } else totalLength++;
          }
        } else totalLength++;
      }
    } else totalLength++;
    return totalLength;
  }

  getRowSpanActividad(itemActividad: any): number {
    let totalLength = 0;
    if (itemActividad.productos.length) {
      for (const itemProducto of itemActividad.productos) {
        if (itemProducto.acciones.length) {
          for (const itemAccion of itemProducto.acciones) {
            if (itemAccion.partidasGasto.length) {
              totalLength += itemAccion.partidasGasto.length;
            } else totalLength++;
          }
        } else totalLength++;
      }
    } else totalLength++;
    return totalLength;
  }

  getRowSpanProducto(itemProducto: any) {
    let totalLength = 0;
    if (itemProducto.acciones.length) {
      for (const itemAccion of itemProducto.acciones) {
        if (itemAccion.partidasGasto.length) {
          totalLength += itemAccion.partidasGasto.length;
        } else totalLength++;
      }
    } else totalLength++;
    return totalLength;
  }

  getRowSpanAccion(itemAccion: any) {
    let totalLength = 0;
    if (itemAccion.partidasGasto.length) {
      totalLength += itemAccion.partidasGasto.length;
    } else totalLength++;
    return totalLength;
  }
}
