import { USER_LOGIN, USER_LOGOUT } from './constants'

const initialState = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : { user: null, token: null, role: null }

export default function authReducer(state = initialState, { type, payload }) {
  switch (type) {
    case USER_LOGIN:
      return { user: payload.user, token: payload.token, role: payload.role }
    case USER_LOGOUT:
      return { user: null, token: null, role: null }
    default:
      return state
  }
}