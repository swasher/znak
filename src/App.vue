<template>
    <div>
        <b-navbar type="light" variant="warning">
            <b-navbar-brand href="#">
                <img v-if="node_env === 'production'" src="./assets/navbar2.png">
                <img v-if="node_env === 'development'" src="./assets/navbar2dev.png">
            </b-navbar-brand>

            <router-link class="navbar-brand float-left" to="/" ><b>ZnakDB</b></router-link>

            <b-nav>
                <!--          <router-link class="nav-link pr-2 pt-3" to="/">All</router-link>-->
                <!--          <router-link class="nav-link pr-2 pt-3" to="/upload">Upload</router-link>-->
                <!--          <router-link class="nav-link pr-2 pt-3" to="/test" v-if="node_env === 'development'">Test</router-link>-->
            </b-nav>

            <b-nav-form >
                <b-button href="/" variant="success" size="" class="mr-1">Знаки</b-button>
                <b-button href="/upload" variant="success" size="" class="mr-4">Загрузить</b-button>
                <b-form-group v-slot="{ ariaDescribedby }" v-if="this.$route.name === 'znaki'" class="mr-4">
                    <b-form-radio-group
                            id="btn-radios"
                            v-model="viewMode"
                            :options="options"
                            :aria-describedby="ariaDescribedby"
                            button-variant="primary"
                            size="sm"
                            name="radio-btn-outline"
                            buttons
                            v-on:change="changeViewMode"
                    ></b-form-radio-group>
                </b-form-group>

            </b-nav-form>

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
                node_env: process.env.NODE_ENV,
                selected: "small",
                options: [
                    { text: 'Small', value: 'small' },
                    { text: 'Big', value: 'big' },
                    { text: 'List', value: 'list' },
                ],
                buttons: ['small', 'big', 'list']
            }
        },

        computed: {
            buttonState: {
                return: ['true', 'false', 'false']
            },

            ...mapGetters([
                'user',
            ]),

            // ...mapState([
            //  'viewMode'
            // ]),

            // мы не можем объявить через mapState, потому что viewMode используется в форме и требует двунаправленности
            // см. https://vuex.vuejs.org/ru/guide/forms.html
            viewMode: {
                get () {
                    return this.$store.state.viewMode
                },
                set (e) {
                    this.$store.commit('SET_VIEW_MODE', e)
                }
            },


        },

        methods: {
            changeViewMode(e) {
                console.log('e=', e)
                this.$store.commit('SET_VIEW_MODE', e)
                // this.$store.dispatch('setViewMode', e)

                if (this.$route.name !== 'znaki') this.$router.push('/')
                //   console.log('this.$route.name', this.$route.name)

            },

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
