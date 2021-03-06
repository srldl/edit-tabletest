var exports = module.exports = {};


const $  = require( 'jquery' );

const dt = require( 'datatables.net' )( window, $ );
require('datatables.net-select' )( window, $ );
require('datatables.net-autofill')( window, $ );
require('datatables.net-keytable')( window, $ );


exports.insertTable = function(obj, callback) {
  var currentFocus;

//Get the buttons
const markup = `
<button type="button" id="newBtn">New</button>
<button type="button" id="copyBtn">Copy</button>
Add rows:<input type="text" name="addRows" id="addRows" size=2 maxlength=2>
<button type="button" id="delBtn">Delete</button>
<button type="button" id="saveBtn">Save</button>
<table id="table1" class="display" width="100%"></table>`;

 document.getElementById("edit_table").innerHTML = markup;

let dataSet=[];
let rowArr;
//This counter holds max row_number
let index_count = 0;
function increment_index_count(){
    index_count++;
}

//Create select elements
var implement_select = (id,count,text) => {
  //Find the select options from the input object named obj
  let arr = obj.selectlist[id];
  if (arr != undefined) {
       let returnstring = '';

        for (let i in arr) {
            if (arr[i] === text) {
              returnstring += "<option value='" + arr[i] + "'selected>" + arr[i] + "</option>";
            } else {
              returnstring += "<option value='" + arr[i] + "'>" + arr[i] + "</option>";
            }
        }
    return '<td id ="'+ id +'_'+ count.toString()+'"><select id="'+ id +'_'+ count.toString()+'" class="target">' + returnstring + '</select></td>';
   }
}



//Return input or select element
var checkHtmlComponent = (text,k) => {
  let id = obj.headers[k];

  //if this is a select element, call implement_select to get the select component
  if (obj.selectlist.hasOwnProperty(k)) {
      return implement_select(k,index_count,text);
  } else
   if (obj.dateFields.includes(k)) {
      return '<td id="'+ k +'_'+(index_count).toString()+'"><input type="date" id="'+ k +'_'+(index_count).toString()+'" class="dateelement" name="'+ k +'_'+(index_count).toString() +'" value="'+ (text.substring(0, 10)) +'"></td>';
  } else if (obj.autocompletes.includes(k)){
      return '<td id="'+ k +'_'+(index_count).toString()+'"><div class="autocomplete"><input type="text" id="'+ k +'_'+(index_count).toString()+'" name="'+ k +'_'+(index_count).toString() +'" value="'+ text+'"></div></td>';
  } else {
      //This is an input element
      return '<td id="'+ k +'_'+(index_count).toString()+'"><input type="text" id="'+ k +'_'+(index_count).toString()+'" name="'+ k +'_'+(index_count).toString() +'" value="'+ text+'"></td>';
  }
}


//Read from input object and add to input rows
console.log(obj.dataRows);
for (let j of obj.dataRows) {
  rowArr = [""];
  for (let k of obj.headers) {
     let text = ((j[k] == '') || (j[k] == null)) ? '&nbsp;' : j[k];
       rowArr.push(checkHtmlComponent(text,k));
  }
  //Id is the last entry, push directly without editable or id
  rowArr[rowArr.length-1] = j['id'];
  dataSet.push(rowArr);
  increment_index_count();
}

    //Create table headings
  let columnsArr = [{ 'title': 'index' }];
  for (let value of obj.headers) {
    columnsArr.push({ 'title': value });
  }

    let table;
  $(document).ready(function() {
    $('#table1').on( 'init.dt', function () {
        table = $('#table1').DataTable();
        } ).DataTable( {

          stateSave: true,
          data: dataSet,
          columns: columnsArr,
          autoFill: {
          columns: ':not(:last-child)'
          },
          select:'single',
          keys: true,  //connected events key-blur
          "ordering": true
      } );

  //Provide index
  table.on( 'order.dt search.dt', function () {
         table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
             cell.innerHTML = i+1;
         } );
     } ).draw();



  //Add id to the <td> html element
  function add_id () {
    table.cells().nodes()[0]['id'] = "undefined_0";
    for  (let b=1;b<table.cells().nodes().length;b++){
        let temp_ = table.cells().nodes()[b]['_DT_CellIndex'];
        table.cells().nodes()[b]['id'] = obj.headers[temp_.column-1] + "_" + temp_.row.toString();
    }
    return false;
  }

  //Get the number of new or copied row we want
  //If null, return 1 for one row added
  var get_rows = () => {
           let num_input = document.getElementById('addRows').value;
           //Set value back to empty
           document.getElementById('addRows').value = '';
           let num_rows = num_input.match(/[0-9]+/);
           if (num_rows !== null){
             return num_rows[0];
           } else {
             return 1;
           }
  }

  //Fetch all values from the chosen column.
    //Used as selections in the autocomplete list for that column
    function  fetch_all_values(id_col) {
         let val;
         let arr = [];
         let data_col = table.columns(id_col).data()[0];
         for (let i=0;i<data_col.length;i++){
            val = data_col[i].split('value="')[1].split('"')[0];
            arr.push(val);
         };
         return [...new Set(arr)];
    }

      //Event key selected
      table.on( 'key', function ( e, datatable, key, cell, originalEvent ) {
              //Check if field use autocomplete
              let id_col = cell.index().column;
              let id = obj.headers[id_col-1] + "_" + cell.index().row;
              if ((obj.autocompletes).includes(obj.headers[id_col-1])){

                 // Get keycode: originalEvent.originalEvent.keyCode;
                 let input_field = document.getElementById(obj.headers[id_col-1]+"_"+cell.index().row);
                 var a, b, i, val = input_field.value;

                 let arr = fetch_all_values(id_col);
                 //close any already open lists of autocompleted values
                 closeAllLists(cell);

                  if (!val) { return false;}
                  currentFocus = -1;
                  //create a DIV element that will contain the items (values)
                  a = document.createElement("DIV");
                  a.setAttribute("id", input_field.id + "autocomplete-list");
                  a.setAttribute("class", "autocomplete-items");

                  //append the DIV element as a child of the autocomplete container
                  input_field.parentNode.appendChild(a);
                  //for each item in the array..
                  for (i = 0; i < arr.length; i++) {
                    //check if the item starts with the same letters as the text field value
                    if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                      //create a DIV element for each matching element
                      b = document.createElement("DIV");
                      //make the matching letters bold
                      b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                      b.innerHTML += arr[i].substr(val.length);
                      //insert a input field that will hold the current array item's value
                      b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                      //execute a function when someone clicks on the item value (DIV element)
                         b.addEventListener("click", function(e) {
                         //insert the value for the autocomplete text field
                         input_field.value = this.getElementsByTagName("input")[0].value;
                         //Close the list of autocompleted values,(or any other open lists)
                         closeAllLists(cell);
                     });
                     a.appendChild(b);
                   }
                 }

             }
      } );

      //Control the row selected , stay selected if same row focused,
      //move to another row if focus change
      table.on( 'user-select', function ( e, dt, type, cell, originalEvent ) {
          //Get row
          var row = dt.row( cell.index().row ).node();

          //Set focus again after blur update in key-blur
          let temp = obj.headers[parseInt(cell.index().column) - 1] + "_" + cell.index().row;
          document.getElementById(temp).focus();

          //Keep focus if row has not changed
          if ( $(row).hasClass('selected') ) {
                // deselect
                return false;
          }
      });

      //On leave - update data
     table.on( 'key-blur', function ( e, datatable, cell ) {
       //Close all open lists
       closeAllLists(cell);
       //Get column header (id_col)
       let id_col = parseInt(cell.index().column) -1;

       //if this is a select element, call implement_select to get the select component
       if (obj.selectlist.hasOwnProperty(obj.headers[id_col])) {
             //Get the element id index
             let id = obj.headers[id_col] + "_" + cell.index().row;
             let select_option_index = table.$('select#'+id)[0].selectedIndex;
             //Get selected element value
             let text = table.$('select#'+id)[0][select_option_index].value;
             //Insert into array
             let sel_row = table.row(cell.index().row).data();
             //Update cell with changed select menu
             sel_row[id_col+1] = implement_select(obj.headers[id_col],cell.index().row,text);
           //  let rowNode = table.row(cell.index().row).data(sel_row).draw(false);
       } else if (table.$('input')){

             //Get cell id
             let temp = obj.headers[parseInt(cell.index().column) - 1] + "_" + cell.index().row;
             let text = table.$('input#'+temp)[0].value;
             let input_type = table.$('input#'+temp)[0].type;
             //Get old row data from input
             let rowData = datatable.row( cell.index().row ).data();
             //Create new data and update table
             rowData[cell[0][0].column]='<td id="'+ temp +'"><input type="'+ input_type +'" id="'+ temp +'"value="'+ text+'"></td>';
             //If it is an autocomplete field, we need an additional div tag
             if (obj.autocompletes.includes(obj.headers[parseInt(cell.index().column) - 1])){
                rowData[cell[0][0].column]= '<div class="autocomplete">'  + rowData[cell[0][0].column] + '</div>';
             };
             let rowNode = table.row(cell.index().row).data(rowData).draw(false);

       }

     });


      $('#copyBtn').click( function() {

          //Get updated text
          if (!table.row({ selected: true }).node()) {
              alert("Please select at least one row");
          } else {
              //Get hold of the content
              let sel_row = table.row({ selected: true }).data();

              //Get number of selected column
              let num_rows = get_rows();
              let rowArr, rowNode;

              //Go through all selected rows to be copied
              for (let j=0;j<(num_rows);j++){
                rowArr = [""];

                for (let i=0;i<obj.headers.length;i++){
                   rowArr.push(sel_row[i+1].replace(/_[0-9]+\"/g, "_"+index_count+'"'));
                };
              //Id should not have id or be editable
               rowArr[rowArr.length-1] = obj.id + '-' + (parseInt(index_count) +1);
               rowNode = table.row.add( rowArr ).draw().node();
               rowNode.id = "row_"+index_count;
               increment_index_count();
              };
              add_id();

              }
              return false;
      } );


      $('#saveBtn').click( function() {
          //Deep hierarchy
          let nodes = table.nodes()[0].childNodes[1].childNodes;
          let saveJson = [];
          let saveRow;

         for (let i=0;i<nodes.length;i++){
            saveRow = {};
            for (let j=1;j<nodes[i].childNodes.length;j++){
               switch(nodes[i].childNodes[j].childNodes[0].nodeName){
                 case 'SELECT':
                    let ind = nodes[i].childNodes[j].childNodes[0].selectedIndex;
                    saveRow[obj.headers[j-1]] = nodes[i].childNodes[j].childNodes[0][ind].value;
                    break;
                 case 'INPUT':
                    //if date, change format to iso6801 before saving since html5 dates does not take care of it.
                    if (nodes[i].childNodes[j].childNodes[0].type == "date"){
                            //If no date set
                            if (nodes[i].childNodes[j].childNodes[0].value.length < 10){
                                 saveRow[obj.headers[j-1]] = null;
                            } else {  //Date set, add time
                                 saveRow[obj.headers[j-1]] = nodes[i].childNodes[j].childNodes[0].value + 'T12:00:00Z';
                            }
                      } else {   //string input -remove space chars before and after
                           saveRow[obj.headers[j-1]] =  nodes[i].childNodes[j].childNodes[0].value.trim();
                      }
                      break;
                 case 'DIV':
                    saveRow[obj.headers[j-1]] =  nodes[i].childNodes[j].childNodes[0].childNodes[0].value.trim();
                    break;
                 default: //#text:
                    saveRow[obj.headers[j-1]] =   nodes[i].childNodes[j].childNodes[0].data;
               }
               //Avoid the . needed to set the cursor to be stored
            //   console.log(saveRow[obj.headers[j-1]]);
            //   (saveRow[obj.headers[j-1]]).replace(/ /g,"");
               //(saveRow[obj.headers[j-1]]).replace(/\/ /g,"");
               //saveRow[obj.headers[j-1]] === " ") {saveRow[obj.headers[j-1]] = "" };
            }
            saveJson.push(saveRow);
         };

         obj.saveJson = saveJson;
         callback(saveJson);
      } );


      $('#newBtn').click( function() {
              let num_rows = get_rows();
              let rowArr;

              //Get number of rows
              for (let j=0;j<(num_rows);j++){
                rowArr = [""];

                (obj.headers).forEach(function (i){
                  rowArr.push(checkHtmlComponent('',i));
                });
              //Id should not be editable
               rowArr[rowArr.length-1] = obj.id + '-' +  (parseInt(index_count) +1);
               let rowNode = table.row.add( rowArr ).draw().node();
               //Add row id to TR element
               rowNode.id = "row_"+index_count;
               increment_index_count();
               add_id();
              };
              return false;
      });

      $('#delBtn').click( function() {
            let sel_row = table.row({ selected: true });
            //Check that a row has been selected
            if (sel_row[0].length === 0) {
                alert("Please select at least one row");
            } else {
             var rowNode = table.row('.selected').remove().draw();
            }
             return false;
          });

          function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
          }

          function removeActive(x) {
          /*A function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
           x[i].classList.remove("autocomplete-active");
          }
          }

          function closeAllLists(cell,elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          let input_field = document.getElementById(obj.headers[cell.index().column-1]+"_"+cell.index().row);
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
             if (elmnt != x[i] && elmnt != input_field) {
             x[i].parentNode.removeChild(x[i]);
           }
          }
          }

});


} // function
