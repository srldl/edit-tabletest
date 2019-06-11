# edit-tabletest
Create a package for a database version of an excel sheet. This code uses DataTables modules which again depends on jquery. It is a tweaked version of editor datatable.

For DataTables see https://datatables.net/

Note: This is a first version and not tested very well at the moment. 


## Install

Download and install:

```
npm install github.com/srldl/edit-tabletest
```

## Use

In your javascript file:

```
//Return json object where one array is one row
function saveToDb(jsonObj){
    console.log(jsonObj);
}

//Create object with input parameters
let obj =  {  "dataRows": dataRows,
              "headers": headers,
              "selectlist": {"project":["ABC","DEF"]},
              "autocompletes": autocompletesInternal,
              "dateFields":dateFields,
              "saveJson":[],
              "id": id
          };

 //Call edit-tabletest with callback handled in saveDB
 tb.insertTable( obj, saveToDb);
  
```
  where
  - dataRows: The rows from the database to display (previously saved rows)
  - headers: Column headers
  - selectlist: Column header names where there should be a selectlist and the alternatives of the select list.
  - autocompletes: Column header names where 
  - dataFields: Column header names which should be interpreted as a date field.
  - saveJson: The return object.
  - id: table id name. Each row id will be called <table id>-<num> where num is a running number starting from 1,
    f.ex. "table-1". 
  
  
 
 In your html file:
  
  ```
  <head>
  ....
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.18/datatables.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/autofill/2.3.3/css/autoFill.dataTables.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/keytable/2.5.0/css/keyTable.dataTables.min.css">
	<link rel="stylesheet" type="text/css" href="style.css">
  </head>
  
  <body>
     <div id="edit_table" style="width: 100%; overflow:auto;"></div>
  </body>
  
  ```
  
  
  
 


