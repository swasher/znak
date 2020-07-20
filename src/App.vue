<template>
  <div>
    <b-navbar type="light" variant="warning">
      <router-link class="navbar-brand float-left" to="/">Znak DB</router-link>

      <div>
        <b-nav>
          <router-link class="nav-link pr-2" to="/">All</router-link>
          <router-link class="nav-link pr-2" to="/upload">Upload</router-link>
          <router-link class="nav-link pr-2" to="/test">Test</router-link>
          <div class="pl-4 pt-2">
            <b-form-checkbox v-model="IsBigCard" name="check-button" @click="store.dispatch('changeCardSize', {cardState: IsBigCard})" >
              <b>{{ IsBigCard }}</b> Big card, state: {{ card_state_from_store }}
            </b-form-checkbox>
          </div>
        </b-nav>
      </div>

      <b-navbar-nav class="ml-auto">
        <div v-if="user.loggedIn">
          <b-nav>
            <b-nav-item active disabled>{{ user.data.email }} are logged in.</b-nav-item>
            <b-nav-item href="#" @click="signOut()">Logout</b-nav-item>
          </b-nav>
        </div>

        <div v-else>
          <b-nav>
            <router-link class="nav-link pr-3" to="/login">Login</router-link>
          </b-nav>
        </div>
      </b-navbar-nav>

    </b-navbar>

    <div class="container mt-3">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
// import { mapState } from 'vuex';
import { auth } from './firebase'

export default {
  name: 'App',
  data() {
    return {
      IsBigCard: true
    }
  },
  computed: {
    // ...mapState(['user']),
    ...mapGetters({
      user: "user"
    }),
    card_state_from_store() {
      return this.$store.state.bigCard
    }
  },
  methods: {
    signOut() {
      console.log('Start signout')
      auth
        .signOut()
        .then(() => {
          this.$store.dispatch('logoutUser');
          if (this.$route.name !== 'znaki') this.$router.push({name: "znaki"}).catch(() => {});
        });
    }
  }
}

</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
