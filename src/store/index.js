import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.includes(id)) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.mrKeys[id] = payload.mrKey
    },
    unregisterUserFromMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      if (registeredMeetups.includes(payload)) {
        registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup === payload), 1)
      }
      Reflect.deleteProperty(state.user.mrKeys, payload)
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup (state, payload) {
      const meetup = state.loadedMeetups.find(meetup => meetup.id === payload.id)
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      }
    },
    setUser (state, newUser) {
      state.user = newUser
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    }
  },
  actions: {
    loadMeetups ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
        .then(data => {
          const obj = data.val()
          const meetups = []
          for (let key in obj) {
            meetups.push({
              id: key,
              ...obj[key]
            })
          }
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)
        }).catch(
          err => {
            commit('setLoading', false)
            commit('setError', err)
          }
        )
    },
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.getUser.id
      }
      let imageURL, key
      firebase.database().ref('meetups').push(meetup)
        .then(data => {
          key = data.key
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref(`meetups/${key}.${ext}`).put(payload.image)
        })
        .then(fileData => {
          imageURL = fileData.metadata.downloadURLs[0]
          return firebase.database().ref('meetups').child(key).update({imageURL})
        })
        .then(() => {
          commit('createMeetup', {
            ...meetup,
            imageURL,
            id: key
          })
        }).catch(err => {
          firebase.database().ref('meetups').child(key).remove()
          console.log(err)
        })
    },
    signUserup ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: [],
              mrKeys: {}
            }
            commit('setUser', newUser)
          }
        ).catch(
          err => {
            commit('setLoading', false)
            commit('setError', err)
          }
        )
    },
    signUserin ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: [],
              mrKeys: {}
            }
            commit('setUser', newUser)
          }
        ).catch(
          err => {
            commit('setLoading', false)
            commit('setError', err)
          }
        )
    },
    autoSignin ({commit}, payload) {
      commit('setUser',
        {
          id: payload.uid,
          registeredMeetups: [],
          mrKeys: {}
        })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    clearError ({commit}) {
      commit('clearError')
    },
    updateMeetupData ({commit}, payload) {
      commit('setLoading')
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
        .then(meetup => {
          commit('setLoading', false)
          commit('updateMeetup', payload)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const currUser = getters.getUser
      firebase.database().ref(`/users/${currUser.id}`).child('/registrations/')
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', {id: payload, mrKey: data.key})
        })
        .catch(err => {
          console.log(err)
          commit('setError', err)
          commit('setLoading', false)
        })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.getUser
      if (!user.mrKeys) {
        return
      }
      const mrKey = user.mrKeys[payload]
      firebase.database().ref(`/users/${user.id}/registrations/`).child(mrKey)
        .remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserFromMeetup', payload)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
        })
    },
    fetchUserRegistraions ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref(`/users/${getters.getUser.id}/registrations`).once('value')
        .then(data => {
          const dataPairs = data.val()
          let registeredMeetups = []
          let mrKeys = {}
          for (let [mrKey, meetupId] of Object.entries(dataPairs)) {
            mrKeys[meetupId] = mrKey
            registeredMeetups.push(meetupId)
          }
          let updatedUser = {
            ...getters.getUser,
            registeredMeetups,
            mrKeys
          }
          commit('setUser', updatedUser)
          commit('setLoading', false)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((a, b) => a > b)
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => state.loadedMeetups.find(meetup => meetup.id === meetupId)
    },
    getUser (state) {
      return state.user
    },
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    }
  }
})
