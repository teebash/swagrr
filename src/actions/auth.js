import * as actionTypes from '../constants/ActionTypes'
import { API_ROOT } from '../constants/Config'
import { AsyncStorage } from 'react-native';

function requestSignIn(creds) {
  return {
    type: actionTypes.SIGN_IN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

function receiveSignIn(user) {
  return {
    type: actionTypes.SIGN_IN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    access_token: user.access_token
  }
}

function signInError(message) {
  return {
    type: actionTypes.SIGN_IN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

export function signInUser(creds) {

  let dataBody = JSON.stringify({ 'email': creds.email, 'password': creds.password })

  let config = {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: dataBody
  }

  return dispatch => {
    dispatch(requestSignIn(creds))
    return fetch(API_ROOT + 'auth/sign_in', config)
      .then(response =>
        response.json().then(user => ({ user, response }))
      ).then(({ user, response }) =>  {
        if (!response.ok) {
          dispatch(signInError(user.message))
          return Promise.reject(user)
        }
        else {
          // Adds all login headers to AsyncStorage
          AsyncStorage.setItem('access_token', response.headers.get('access-token '));
          Asyncstorage.setItem('uid', response.headers.get('uid'));
          Asyncstorage.setItem('client', response.headers.get('client'));
          Asyncstorage.setItem('expiry', response.headers.get('expiry'));

          dispatch(receiveSignIn(user))
        }
      }).catch(err => console.log("Error: ", err))
  }
}

function requestSignOut() {
  return {
    type: actionTypes.SIGN_OUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  }
}

function receiveSignOut() {
  return {
    type: actionTypes.SIGN_OUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  }
}

function signOutError(message) {
  return {
    type: actionTypes.SIGN_OUT_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

export function signOutUser() {
  let token = localStorage.getItem('access_token') || null
  let config = {}

  if(token) {
    config = {
      method: 'DELETE',
      headers: { 'Content-Type':'application/json',
                 'Authorization': `Bearer ${token}`
      }
    }
  }

  return dispatch => {
    dispatch(requestSignOut())
    return fetch(API_ROOT + 'auth/sign_out', config)
      .then(response =>
        response.json().then(json => ({ json, response }))
      ).then(({ json, response }) => {
        if (!response.ok) {
          dispatch(signOutError(json.error))
          dispatch(receiveSignOut())
          return Promise.reject(json)
        }
        AsyncStorage.removeItem('access_token')
        AsyncStorage.removeItem('uid')
        AsyncStorage.removeItem('client')
        AsyncStorage.removeItem('expiry')
        dispatch(receiveSignOut())
      }).catch(err => console.log("Error: ", err))
  }
}
