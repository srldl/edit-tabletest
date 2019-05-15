// mymodule.js
module.exports = {
   createNode: function() {
     var node = document.createElement("LI");
     var textnode = document.createTextNode("Water");
     node.appendChild(textnode);
     return node;
   }
}
