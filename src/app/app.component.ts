import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
isChecked: any;



adRow() {
  const tableFields = document.getElementById('columnTable') as HTMLTableElement;
  const newTableRow = tableFields.insertRow();
  const cellCheckbox = newTableRow.insertCell(0);
  const checkboxField = document.createElement('input');
  checkboxField.type='checkbox';
  cellCheckbox.appendChild(checkboxField);

  const cellFieldName = newTableRow.insertCell(1);
  const inputFieldName = document.createElement('input');
  inputFieldName.type = 'text';
  inputFieldName.size=6;
  inputFieldName.placeholder="new field";
  cellFieldName.appendChild(inputFieldName);

  const cellFieldDataType = newTableRow.insertCell(2);
  const inputDataType = document.createElement('input');
  inputDataType.type= 'text';
  inputDataType.size=4;
  cellFieldDataType.appendChild(inputDataType);

}

getTableIndex(tabi: HTMLTableElement): number | null {

  let x:number | null=null;
  for (let i =0; i<tabi.rows.length; i++){
    const row=tabi.rows[i];
    row.addEventListener('click', function(event){
      const clickedRow = event.currentTarget as HTMLTableRowElement;
      x = clickedRow.rowIndex;
      console.log("rowindex ez: " + x)

    })
  }
return x;
  
}



rowIndex() {

  const tableFields = document.getElementById('columnTable') as HTMLTableElement;
  console.log(tableFields.rows[1].cells[3])
  for (let i =0; i<tableFields.rows.length; i++){
    const row=tableFields.rows[i];
    row.addEventListener('click', function(event){
      const clickedRow = event.currentTarget as HTMLTableRowElement;
      const rowIndex = clickedRow.rowIndex;
      console.log(`Kattintott sor indexe: ${rowIndex}`);
    })
  }
  }

deleteRow() {

  const tableFields = document.getElementById('columnTable') as HTMLTableElement;

 // const tableFields1 = document.getElementById('kutya') as HTMLInputElement;
  //console.log("mi van: "+tableFields1.checked);
  //console.log("mi ez "+tableFields.rows[1].cells[3].)
  for (let i =0; i<tableFields.rows.length; i++){
    const row=tableFields.rows[i];
    row.addEventListener('click', function(event){
      const clickedRow = event.currentTarget as HTMLTableRowElement;
      const rowIndex = clickedRow.rowIndex;
      console.log(`Kattintott sor indexe: ${rowIndex}`);
    })
  }

  }

  sqlQuery: string = '';
  columns: string[] = [];
  title = 'sql-query-executor';
  regexTable: RegExp = /(from|join)\s+(\w+)/g;
  regexColumn: RegExp = /SELECT\s+(.+?)\s+FROM/i;

  constructor() {

  }

  executeQuery() {
    // Parse the SQL query to extract column names
    this.columns = this.parseSqlQuery(this.sqlQuery);
    
    
   
  }

  getTableNames(sqlQuery: string): string[] | null {
    const matchTableName = sqlQuery.match(this.regexTable)?.map(e => e.split(' ')[1]);
    if (matchTableName == null) { return null }
    else { return matchTableName };

  }

  getColumnNames(sqlQuery: string): string[] | null {
    const matchColumnName = sqlQuery.match(this.regexColumn)?.map(e => e.split(' ')[1]);
    if (matchColumnName == null) { return null }
    else { return matchColumnName };

  }


  separate() {
    let sqlCommand = document.getElementById('sqlText') as HTMLInputElement;
    let sqlDetail = document.getElementById('detailText') as HTMLInputElement;
    let kacsa: string[] | null;
    kacsa = this.getColumnNames(sqlCommand.value);
    kacsa?.forEach((value, index) => {
      console.log(`Elem ${index + 1}: ${value}`);
    });
    console.log("tutykos regex2 tábla : " + this.getTableNames(sqlCommand.value));
    console.log("tutykos regex oszlop :  " + this.getColumnNames(sqlCommand.value));
    sqlDetail.value = sqlCommand.value;

  }
/*
  parseSqlQuery(sqlQuery: string): string[] {
    // Regular expression to match column aliases after "AS"
    const regex = /\bas\s+(\w+)/gi;

    // Match all occurrences of the regex in the SQL command
    const matches = sqlQuery.match(regex);

    // Extract and return the captured group values (column aliases)
    if (matches) {
      return matches.map(match => match.split(/\s+/)[1]);
    }

    return [];
  }*/

  private parseSqlQuery(sqlQuery: string): string[] {
    const selectIndex = sqlQuery.toUpperCase().indexOf('SELECT');
    const fromIndex = sqlQuery.toUpperCase().lastIndexOf('FROM');

    if (selectIndex !== -1 && fromIndex !== -1 && selectIndex < fromIndex) {
    const selectClause = sqlQuery.substring(selectIndex + 'SELECT'.length, fromIndex).trim();
        console.log("itt: "+selectClause);

        const extractColumns = (clause: string): string[] => {
            const columnParts = clause.split(',');

            return columnParts.flatMap((part: string): string[] => {
                const asIndex = part.toUpperCase().lastIndexOf(' AS ');

                if (asIndex !== -1) {
                    // Extract the alias as the column name
                    return [part.substring(asIndex + ' AS '.length).trim()];

                } else if (part.toUpperCase().includes('SELECT')) {
                    // Handle nested SELECT statement inside parentheses
                    const nestedSelectMatches = part.match(/\(([^)]+)\) AS (\w+)/);


                    if (nestedSelectMatches) {
                        // Extract the alias from the nested SELECT
                        return [nestedSelectMatches[2]];

                    }
                } else {
                    // Extract the column name
                    const dotIndex = part.lastIndexOf('.');
                    if (dotIndex !== -1) {
                        const aliasMatch = part.substring(0, dotIndex).match(/\sAS\s(\w+)$/i);
                        if (aliasMatch) {
                            return [aliasMatch[1]];
                        } else {
                            return [part.substring(dotIndex + 1).trim()];
                        }
                    } else {
                        return [part.trim()];
                    }
                }

                return [];
            });
        };

        // Extracting column names
        const columnNames: string[] = extractColumns(selectClause);


        return columnNames;
    } else {
        return ['Invalid SQL query'];
    }
}









}
