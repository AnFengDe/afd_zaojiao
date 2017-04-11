const axios = require('axios')
const qs = require('qs')

axios.defaults.timeout = 30000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export const get = (path, params = {}) => {
  const promise = new Promise((resolve, reject) => {
    axios.get(path, {
        params
      })
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
  return promise
}

export const post = (path, params = {}) => {
  const promise = new Promise((resolve, reject) => {
    axios.post(path, qs.stringify(params))
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
  return promise
}

export const del = (path, params = {}) => {
  const promise = new Promise((resolve, reject) => {
    axios.delete(path, {
        params
      })
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
  return promise
}

export const put = (path, params = {}) => {
  const promise = new Promise((resolve, reject) => {
    axios.put(path, qs.stringify(params))
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err)
      })
  })
  return promise
}
