const http = require('../js/http.js')

let getData = function() {
  let path = 'http://localhost:8000/get'
  let params = {
    get: 'get'
  }
  http.get(path, params).then((res) => {
    console.log(res.data)
  }, (err) => {
    console.log(err)
  })
}

let postData = function() {
  let path = 'http://localhost:8000/post'
  let params = {
    post: 'post'
  }
  http.post(path, params).then((res) => {
    console.log(res.data)
  }, (err) => {
    console.log(err)
  })
}

let deleteData = function() {
  let path = 'http://localhost:8000/delete'
  let params = {
    delete: 'delete'
  }
  http.del(path, params).then((res) => {
    console.log(res.data)
  }, (err) => {
    console.log(err)
  })
}

let putData = function() {
  let path = 'http://localhost:8000/put'
  let params = {
    put: 'put'
  }
  http.put(path, params).then((res) => {
    console.log(res.data)
  }, (err) => {
    console.log(err)
  })
}
getData()
postData()
deleteData()
putData()
