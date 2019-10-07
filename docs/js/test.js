// 普通的单例模式
// const SingleTon = function (username, password) {
//   this.username = username
//   this.password = password
//   this.instance = null
// }

// SingleTon.prototype.getUsername = function () {
//   alert(this.username)
// }

// SingleTon.getInstance = function (username) {
//   if (!this.instance) {
//     this.instance = new SingleTon(username)
//   }
//   return this.instance
// }

// const user1 = SingleTon.getInstance('zhangsan')
// const user2 = SingleTon.getInstance('lisi')

// console.log( user1 === user2 )


// 透明的单例模式
const CreateDiv = (function () {

  let instance 

  const CreateDiv = function (name) {
    if ( instance ) {
      return instance
    }
    this.name = name
    this.init()
    return instance = this
  }

  CreateDiv.prototype.init = function () {
    const div = document.createElement('div')
    document.body.appendChild(div)
  }

  return CreateDiv

})()

const a = new CreateDiv('userA')
const b = new CreateDiv('userB')

console.log( a === b )