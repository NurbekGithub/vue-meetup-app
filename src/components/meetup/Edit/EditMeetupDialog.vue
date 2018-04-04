<template>
  <v-dialog width="450px" persistent v-model='showDialog'>
    <v-btn fab accent slot="activator">
      <v-icon>edit</v-icon>
    </v-btn>
    <v-card>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card-title>Edit Meetup</v-card-title>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card-text>
            <v-text-field
              name='title'
              label='Title'
              id='title'
              v-model='editedTitle'
              required
            >
            </v-text-field>
            <v-text-field
              name='description'
              label='Description'
              id='description'
              v-model="editedDescription"
              required
              multi-line
            >
            </v-text-field>
          </v-card-text>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat class='blue--text darken-1' @click="onSaveChanges">Save</v-btn>
            <v-btn flat class='red--text darken-1' @click='showDialog = false'>Close</v-btn>
          </v-card-actions>
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
      editedTitle: this.meetup.title,
      editedDescription: this.meetup.description,
      showDialog: false
    }
  },
  methods: {
    onSaveChanges () {
      if (this.editedTitle.trim() === '' || this.editedDescription.trim() === '') {
        return
      }
      this.$store.dispatch('updateMeetupData', { title: this.editedTitle.trim(), description: this.editedDescription.trim(), id: this.meetup.id })
      this.showDialog = false
    }
  }
}
</script>
