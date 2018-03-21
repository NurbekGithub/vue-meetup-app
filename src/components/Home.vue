<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to='/meetups' class="primary">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large router to='/meetup/new' class="primary">Orgonize Meetups</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular 
        indeterminate 
        class="primary--text"
        v-if="loading"
      ></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout 
      row 
      wrap  
      class="my-2" 
      justify-center
      v-if="!loading"
    >
      <v-flex xs12 sm10>
        <v-carousel>
          <v-carousel-item 
            v-for="(meetup, i) in meetups" 
            :src="meetup.imageURL" 
            :key="i"
            :to="'/meetup/' + meetup.id"
          >
            <div class="title">{{ meetup.title }}</div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center">
        <h3>Join our awesome meetups!</h3>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    computed: {
      meetups () {
        return this.$store.getters.featuredMeetups
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadMeetup (id) {
        this.$router.push('/meetups/' + id)
      }
    }
  }
</script>

<style lang="stylus">
  #example-custom-transition
    .fade
      &-enter-active, &-leave-active, &-leave-to
        transition: .3s ease-out
        position: absolute
        top: 0
        left: 0

      &-enter, &-leave, &-leave-to
        opacity: 0
  .title
    color: #fff;
    background-color: rgba(0,0,0,0.5)
    font-size: 24px
    position: absolute
    bottom: 50px
    padding: 20px
    margin: 0 auto
    left: 50%;
    transform: translateX(-50%);
</style>