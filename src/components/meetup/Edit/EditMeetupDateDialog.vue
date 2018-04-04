<template>
  <v-dialog width="450px" v-model='showDialog'>
    <v-btn accent slot="activator" class="blue lighten-1 white--text">
      Edit Date
    </v-btn>
    <v-card>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card-title>Edit Meetup Date</v-card-title>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <v-flex xs12>
          <v-date-picker v-model="editableDate" full-width>
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
          </v-date-picker>
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
      editableDate: null
    }
  },
  methods: {
    onSaveChanges () {
      const newDate = new Date(this.meetup.date)
      const newDay = new Date(this.editableDate).getUTCDate()
      const newMonth = new Date(this.editableDate).getUTCMonth()
      const newYear = new Date(this.editableDate).getUTCFullYear()
      newDate.setUTCDate(newDay)
      newDate.setUTCMonth(newMonth)
      newDate.setUTCFullYear(newYear)
      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newDate
      })
      this.showDialog = false
    }
  },
  created () {
    const date = new Date(this.meetup.date)
    const day = date.getUTCDay()
    const month = date.getUTCMonth()
    const year = date.getUTCFullYear()

    this.editableDate = year + '-' + month + '-' + day
  }
}
</script>
