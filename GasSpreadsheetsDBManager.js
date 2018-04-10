/**
 * This method is used to set a FormatDate.
 * @param {string} timezone  time zone
 * @param {string} format
 */
function setFormatDate(timeZone,format){
  throw new Error("this method should not call direct, please call create method.");
}

/**
 * This method is used to get a DB.
 * @return {Object} 
 */
function getDb(){
  throw new Error("this method should not call direct, please call create method.");
}

/**
 * This method is used to get a SpreadSheet.
 * @return {Spreadsheet} 
 */
function getSpreadSheet(){
  throw new Error("this method should not call direct, please call create method.");
}
  
/**
 * This method is used to get a sheet.
 * @return {Sheet} 
 */
function getSheet(){
  throw new Error("this method should not call direct, please call create method.");
}

/**
 * This method is convert sheet to json.
 * @param {sheet} sheet taeget sheet
 * @return {Object} convert result
 */
function convertSheetToJson(sheet){
  throw new Error("this method should not call direct, please call create method.");
}

/**
 * This method is get SpreadSheet beyond the Internet.
 * @param {string} url  taeget url
 * @param {string} sheet_name  taeget sheet name
 * @return {Spreadsheet}
 */
function fetchSpreadSheet(url,sheet_name) {
  throw new Error("this method should not call direct, please call create method.");
}
  
/**
 * This method is get DB beyond the Internet.
 * @param {string} url  taeget url
 * @param {string} sheet_name  taeget sheet name
 * @return {Object}
 */
function fetchDb(url,sheet_name) {
  throw new Error("this method should not call direct, please call create method.");
}

/**
 * This method is get Last ID in DB.
 * @return {int}
 */
function getLastId(){
  throw new Error("this method should not call direct, please call create method.");
}

/**
 * This method is find record by ID.
 * @param {int} id  taeget id
 * @return {Object} record found record 
 */
function findById(id){
  throw new Error("this method should not call direct, please call create method.");
}

/**
 * This method is find record by any column.
 * @param {string} column  column name
 * @param {any} query query option
 * @param {int} order several from the top
 * @return {Object} record found record 
 */
function find(column,query,order){
  throw new Error("this method should not call direct, please call create method.");
}
 
/**
 * This method is create new record.
 * @return {Object} record created record 
 */
function create(){
  throw new Error("this method should not call direct, please call create method.");
}

/**
 * This method is destroy record by id.
 * @param {int} id ID to be erased
 * @return {Object} record destroyed record 
 */
function destroy(id){
  throw new Error("this method should not call direct, please call create method.");
}

/**
 * This method is save db to spreadsheet.
 */
function save(){
  throw new Error("this method should not call direct, please call create method.");
}

/**
 * This method is apply changes to DB.
 * @param {Object} record changed record
 */
function update(record){
  throw new Error("this method should not call direct, please call create method.");
}

function SpreadsheetsDBManager(url,sheet_name){
  this.url = url;
  this.sheet_name = sheet_name;
  this.db = this.fetchDb(url,sheet_name);
  this.timeZone = 'Asia/Tokyo';
  this.format = 'yyyy/MM/dd HH:mm:ss';
};

SpreadsheetsDBManager.prototype = {
  setFormatDate : function(timeZone,format){
    this.timeZone = timeZone;
    this.format = format;
  },
  
  getDb: function(){
    return JSON.parse(JSON.stringify(this.db));
  },
  
  getSpreadSheet: function(){
    return this.spreadsheet;
  },
  
  getSheet: function(){
    return this.sheet;
  },
  
  convertSheetToJson: function(sheet){
    var rowIndex = 1;
    var colStartIndex = 1;
    var rowNum = 1;
    var keys = sheet.getSheetValues(rowIndex, colStartIndex, rowNum, sheet.getLastColumn())[0];
    var data = sheet.getRange(rowIndex + 1, colStartIndex, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  
    var list = [];
  
    data.forEach(function(elm,index){
      var template = indexBy(keys);
      var member = generate(elm,template);
      if(member.id){
        list[index] = member;
      }
    });  
    if(list.length == 0){
      item = generateGenesisItem(keys);
      list.push(item);
    }
    return list;
  
    function generate(elm,obj){
      var i = 0;
      for(var key in obj){
        obj[key] = elm[i];
        i++;
      }
      return obj;
    }
  
    function generateGenesisItem(ary){
      var obj = {};
        for(var i = 0, len = ary.length; i < len; i++){
        var key = ary[i];
          obj[key] = '';
        }
      return obj;
    }
  
    function indexBy(ary){
      var obj = {};
      for(var i = 0, len = ary.length; i < len; i++){
        var key = ary[i];
        obj[key] = key;
      }
      return obj;
    }
  },
  
  fetchSpreadSheet: function(url,sheet_name) {
    this.spreadsheet = SpreadsheetApp.openByUrl(url);
    this.sheet = this.spreadsheet.getSheetByName(sheet_name);
    return this.sheet;
  },
  
  fetchDb: function(url,sheet_name) {
    var sheet = this.fetchSpreadSheet(url,sheet_name);
    return this.convertSheetToJson(sheet);
  },

  getLastId: function(){
    id = Math.max.apply(null,this.db.map(function(o){return o.id;}));
    if(id == -Infinity){
      id = 0;
    }
    return id;
  },

  findById: function(id){
    for(var i in this.db){
      if(this.db[i].id == id){
        return this.db[i];
      }
    }
    return null;
  },

  find:function(column,query,order){
    if(order == null || order < 1){
      order = 1;  
    }
    
    var counter = 1;
    for(var i in this.db){
      if(this.db[i][column] == query){
        if(counter == order){
          return this.db[i];
        }else{
          counter++;
        }
      }
    }
    return null;
  },
  
  create: function(){
    var lastId = this.getLastId(this.db);
    newRecordId = lastId + 1;
    var record = {};
    for (key in this.db[0]){
      if(key === 'id'){
        record[key] = newRecordId;
        continue;
      }
      if(key === 'datetime'){
        record[key] = Utilities.formatDate(new Date() , this.timeZone ,this.format);
        continue;
      }
      record[key] = '';
    }
    return record;
  },

  destroy: function(id){
    var deleted_record = null;
    for(var i in this.db){
      if(this.db[i].id == id){
        deleted_record = this.db[i];
        this.db.splice(i, 1);
      }
    }
    return deleted_record;
  },
  
  save: function(){
    var table = [];
    var key_list = [];
    for (key in this.db[0]){
      key_list.push(key);
    }
    table.push(key_list);
    for(i in this.db){
      var item_list = [];
      for(key in this.db[i]){
        item_list.push(this.db[i][key]);
      }
      table.push(item_list);
    }
    var rows = table.length;
    var cols = table[0].length;
  
    this.sheet.getRange(1,1,rows,cols).setValues(table);
  },

  update: function(record){
    if(this.db[0].id == ''){
      this.db[0] = record;
      return;
    }
  
    for(var i in this.db){
      if(this.db[i].id == record.id){
        this.db[i] = record;
        return;
      }
    }
    this.db.push(record);
  }
};