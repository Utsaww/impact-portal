import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
    providedIn: 'root'
  })
export class ExcelService {
constructor() { }
public exportAsExcelFile(json: any[], excelFileName: string): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

  worksheet.A1 = "";
  worksheet.B1 = "";
  worksheet.C1 = "";
  worksheet.D1 = "";
  worksheet.E1 = "";
  worksheet.F1 = "";
  worksheet.G1 = "";
  worksheet.H1 = "";
  worksheet.I1 = "";
  worksheet.J1 = "";
  worksheet.K1 = "";
  worksheet.L1 = "";
  worksheet.M1 = "";
  // var headersArray: Array<any> = ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2', 'J2', 'K2'];
  // const header = headersArray;
  // let headerRow = worksheet.addRow(header);
  // // Cell Style : Fill and Border
  // headerRow.eachCell((cell, number) => {
  //   cell.fill = {
  //     type: 'pattern',
  //     pattern: 'solid',
  //     fgColor: { argb: 'FFFFFF00' },
  //     bgColor: { argb: 'FF0000FF' }
  //   }
  //   cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  // })
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
}
private saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
   FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
}
}