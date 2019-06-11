# edit-tabletest
Create a package for dataTable testing


## Install

Download and install:

```
npm install github.com/srldl/edit-tabletest
```

## Use

Code example on how to call the library:

In your javascript file:

```
//Return json object where one array is one row
function saveDb(jsonObj){
    console.log(jsonObj);
}

let obj =
                          { "dataRows":fieldwork,
                            "headers":header,
                            "selectlist": {"project":["ABC","DEF"]},
                            "autocompletes": autocompletesInternal,
                            "dateFields":dateFields,
                            "saveJson":[],
                            "id": id
                          };

  tb.insertTable(objbj,saveDb);
  
  ```
  
  In your html file:
  
  ```
  <div id="edit_table" style="width: 100%; overflow:auto;"></div>
  
  ```
  
  
  
 


