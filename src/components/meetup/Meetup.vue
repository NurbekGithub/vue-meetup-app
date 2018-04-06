<template>
  <v-container>
    <v-layout row wrap v-if='loading'>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular 
        indeterminate 
        class="primary--text"
        v-if="loading"
      ></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout flex wrap v-if='!loading'>
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card>
          <v-card-title>
            <h4 class="primary--text display-1">{{ meetup.title }}</h4>
            <template v-if="userIsCreater">
              <v-spacer></v-spacer>
              <meetup-edit-dialog :meetup='meetup'></meetup-edit-dialog>
            </template>
          </v-card-title>
          <v-card-media
            :src="meetup.imageURL"
            height='400px'
          >
          </v-card-media>
          <v-card-text>
            <div class="info--text">{{ meetup.date | date }} - {{ meetup.location }}</div>
            <div>
              <meetup-date-edit-dialog :meetup="meetup" v-if="userIsCreater"></meetup-date-edit-dialog>
              <meetup-time-edit-dialog :meetup="meetup" v-if="userIsCreater"></meetup-time-edit-dialog>
            </div>
            {{ meetup.description }}
          </v-card-text>
          <v-card-actions class='justify-end'>
            <confirm-registration-dialog :meetupId="meetup.id" v-if="userIsAuthentocated && !userIsCreater"/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['id'],
  computed: {
    meetup () {
      return this.$store.getters.loadedMeetup(this.id)
    },
    userIsAuthentocated () {
      return this.$store.getters.getUser !== null && this.$store.getters.getUser !== undefined
    },
    userIsCreater () {
      if (!this.userIsAuthentocated) {
        return false
      }
      return this.$store.getters.getUser.id === this.meetup.creatorId
    },
    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>

