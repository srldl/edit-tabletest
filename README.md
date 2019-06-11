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
  

In your javascript file:

```
//Return json object where one array is one row
function saveToDb(jsonObj){
    console.log(jsonObj);
}


//Create object with input parameters
let obj =  {  "dataRows": [{"project":"A","subproject":"AA","event_date":"2019-06-14T12:00:00Z"},
			   {"project":"B","subproject":"BB", event_date":"2019-06-14T12:00:00Z"}],
              "headers": ["project", "subproject", "event_date"],
              "selectlist": {"project":["A","B","C"]},
              "autocompletes": ["subproject"],
              "dateFields":["event_date"],
              "id": "exceltable"
          };

 //Call edit-tabletest with callback handled in saveToDB
 tb.insertTable( obj, saveToDb);
  
```
  where
  - dataRows: The rows from the database to display (previously saved rows)
  - headers: Column headers
  - selectlist: 1) Column headers where selectlist should be created and 2) the select list alternatives.
  - autocompletes: Column headers where autocomplete should be offered. Options for autocomplete is the unique names previously written in the same column.
  - dataFields: Column headers to be interpreted as a date field.
  - id: table id name. Each row id will be called <table id>-<num> where num is a running number starting from 1,
    f.ex. "exceltable-1". 
  
 
## Functionality
  * Multiple rows can be created and copied. Use "Add rows" to add multiple new or copied rows.
  * Only one row can be deleted at a time.
  * Dates must be in the format of ISO6801, but since the html 5 <input type="date">, the time is always set to 12 noon f.ex.   "2019-06-14T12:00:00Z"
  
  
  
  
  
 


