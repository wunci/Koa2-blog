var expect = require('chai').expect;
var apiModel = require('../lib/mysql.js')

describe('add User', function() {
	// 创建一个用户
	before((done) => {
		apiModel.insertData(['wclimb','123456','avator','time']).then(()=>{
			done()
		});
	});
	// 删除一个用户
	after((done) => {
		apiModel.deleteUserData('wclimb').then(()=>{
			done()
		});
	})
	// 查找用户
	it('should return an Array contain {} when find by name="wclimb"', (done) => {
		apiModel.findUserData('wclimb').then((user) => {
		  	var data = JSON.parse(JSON.stringify(user));
		  	console.log(data)
		  	expect(data).to.have.lengthOf(1);
		  	done();
		}).catch((err)=>{
			if (err) {
		       return done(err);
		    }
		})
	});
});
