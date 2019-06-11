# edit-tabletest
Create a package for dataTable testing


## Install

Download and install:

```
npm install github.com/srldl/edit-tabletest
```

## Use

In your javascript file:

```
//Return json object where one array is one row
function saveDb(jsonObj){
    console.log(jsonObj);
}

//Create object with input parameters
let obj =
                          { "dataRows": dataRows,
                            "headers": headers,
                            "selectlist": {"project":["ABC","DEF"]},
                            "autocompletes": autocompletesInternal,
                            "dateFields":dateFields,
                            "saveJson":[],
                            "id": id
                          };

 //Call edit-tabletest with callback handled in saveDB
 tb.insertTable( obj, saveDb);
  
  ```
  where
  - dataRows: The rows from the database to display (previously saved rows)
  - headers: Column headers
  selectlist: Column header names where there should be a selectlist and the alternatives of the select list.
  autocompletes: Column header names where 
  dataFields: Column header names which should be interpreted as a date field.
  saveJson: The return object.
  id: table id name. Each row id will be called <id>-<num> where num is a running number starting from 1,
    f.ex. "exceltable-1".
  
  
 
  In your html file:
  
  ```
  <div id="edit_table" style="width: 100%; overflow:auto;"></div>
  
  ```
  
  
  
 


