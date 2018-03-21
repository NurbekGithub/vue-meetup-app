<template>
  <v-container>
    <v-layout flex wrap>
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card>
          <v-card-title>
            <h4 class="primary--text display-1">{{ meetup.title }}</h4>
          </v-card-title>
          <v-card-media
            :src="meetup.imageURL"
            height='400px'
          >
          </v-card-media>
          <v-card-text>
            <div class="info--text">{{ meetup.date | date }} - {{ meetup.location }}</div>
            {{ meetup.description }}
          </v-card-text>
          <v-card-actions class='justify-end'>
            <v-btn class="primary">Register</v-btn>
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
    }
  }
}
</script>

