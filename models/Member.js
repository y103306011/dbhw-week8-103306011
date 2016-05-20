//這是一個Member Model
var db = require('../libs/db'); //引入我們的sql builder
var GeneralErrors = require('../errors/GeneralErrors');



var Member = function(options) {

  this.id = options.id;
  this.name = options.name;
  this.password = options.password;
  this.account = options.account;

};


//Class Function
Member.get = function(memberId, cb) {


  db.select()
    .from('member')
    .where({
      id : memberId
    })
    .map(function(row) {
   

      return new Member(row);
    })
    .then(function(memberList) {
      if(memberList.length) {
        cb(null, memberList[0]);
      } else {

        cb(new GeneralErrors.NotFound());
      }
    })
    .catch(function(err) {
      cb(err);
    })
}



Member.prototype.save = function (cb) {

  if (this.id) {

    db("member")
      .where({
        id : this.id
      })
      .update({
        name : this.name,
        account : this.account,
        password : this.password
      })
      .then(function() {
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log("MEMBER UPDATED", err);
        cb(new GeneralErrors.Database());
      });
  } else {

    db("member")
      .insert({
        name: this.name,
        account: this.account,
        password: this.password
      })
      .then(function(result) {
        var insertedId = result[0];
        this.id = insertedId;
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log("MEMBER INSERT", err);
        cb(new GeneralErrors.Database());
      });
  }
};


Member.prototype.check = function (cb) {

    db("member")
      .where({
        account : this.account,
        password : this.password 
      }).map(function(row) {

          this.name = row.name;
          console.log('row'+row.name);
          console.log('this'+this.name);
          return this.name;

      })
      .then(function(result) {


        console.log('re'+result);
        var name = result;
        console.log('name'+name);
        this.name = name;
        console.log(this.name);
        cb(null, this);

      }.bind(this))
      .catch(function(err) {
        console.log("MEMBER UPDATED", err);
        cb(new GeneralErrors.Database());
      });
//}
};


module.exports = Member;
