<template>
  <v-dialog width="450px" v-model='showDialog'>
    <v-btn accent slot="activator" class="blue lighten-1 white--text">
      Edit Time
    </v-btn>
    <v-card>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card-title>Edit Meetup Time</v-card-title>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <v-flex xs12>
          <v-time-picker v-model="editableTime" full-width actions>
            <template>
              <v-spacer />
              <v-btn class="blue--text darken-1" 
                flat 
                @click="onSaveChanges"
              >Save</v-btn>
              <v-btn class="red--text darken-1" 
                flat 
                @click="showDialog = false"
              >Close</v-btn>
            </template>
          </v-time-picker>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['meetup'],
  data () {
    return {
      showDialog: false,
      editableTime: null
    }
  },
  methods: {
    onSaveChanges () {
      const newDate = new Date(this.meetup.date)
      const hours = this.editableTime.match(/^(\d+)/)[1]
      const minutes = this.editableTime.match(/:(\d+)/)[1]
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newDate
      })
      this.showDialog = false
    }
  },
  created () {
    const date = new Date(this.meetup.date)
    const hour = date.getHours()
    const minute = date.getMinutes()

    this.editableTime = hour + ':' + minute
  }
}
</script>
