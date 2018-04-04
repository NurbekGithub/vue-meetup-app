<template>
  <v-dialog v-model='registerDialog' width="450px">
    <v-btn accent slot='activator' secondary>
      {{ userIsRegistred ? 'Unregister' : 'Register' }}
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title v-if="userIsRegistred">Unregister from Meetup?</v-card-title>
            <v-card-title v-else>Register for Meetup?</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>You can always change your decision later</v-card-text>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn class="primary--text" flat @click="onRegister">Confirm</v-btn>
              <v-btn class="red--text darken-1" flat @click="registerDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['meetupId'],
  data () {
    return {
      registerDialog: false
    }
  },
  computed: {
    userIsRegistred () {
      return this.$store.getters.getUser.registeredMeetups.findIndex(meetupId => {
        return meetupId === this.meetupId
      }) > -1
    }
  },
  methods: {
    onRegister () {

    }
  }
}
</script>
