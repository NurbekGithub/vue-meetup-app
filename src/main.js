import Vue from 'vue'
import App from './App'
import router from './router'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  Vcarousel,
  VCard,
  VTextField,
  VDatePicker,
  VTimePicker,
  VAlert,
  VProgressCircular,
  VDialog,
  VDivider
} from 'vuetify'
import * as firebase from 'firebase'
import '../node_modules/vuetify/src/stylus/app.styl'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/shared/Alert.vue'
import MeetupEditDialog from './components/meetup/Edit/EditMeetupDialog.vue'
import MeetupDateEditDialog from './components/meetup/Edit/EditMeetupDateDialog.vue'
import MeetupTimeEditDialog from './components/meetup/Edit/EditMeetupTimeDialog.vue'
import ConfirmRegistrationDialog from './components/meetup/Registrate/ConfirmRegistrationDialog'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    Vcarousel,
    VCard,
    VTextField,
    VDatePicker,
    VTimePicker,
    VAlert,
    VProgressCircular,
    VDialog,
    VDivider
  },
  theme: {
    primary: '#4caf50',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c',
    info: '#4fc3f7'
  }
})

Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('error-alert', AlertCmp)
Vue.component('meetup-edit-dialog', MeetupEditDialog)
Vue.component('meetup-date-edit-dialog', MeetupDateEditDialog)
Vue.component('meetup-time-edit-dialog', MeetupTimeEditDialog)
Vue.component('confirm-registration-dialog', ConfirmRegistrationDialog)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyAy-AphaBLVvDSLo-5XOtDaBQ4f-Oa6fuc',
      authDomain: 'meetups-78cdc.firebaseapp.com',
      databaseURL: 'https://meetups-78cdc.firebaseio.com',
      projectId: 'meetups-78cdc',
      storageBucket: 'meetups-78cdc.appspot.com'
    })
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoSignin', user)
      }
    })
    this.$store.dispatch('loadMeetups')
  }
})
