<template>
    <div class="row justify-content-center">
        <div class="col-md-5">
            <h3 class="text-center">Login</h3>
            <form @submit.prevent="userLogin">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" v-model="user.email" required>
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control" v-model="user.password" required>
                </div>

                <div class="form-group">
                    <button class="btn btn-primary btn-block">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { auth } from "../firebase";

export default {
    name: 'Login',

    data() {
        return {
            user: {
               email: '',
               password: '',
            }
        }
    },
    methods: {
        userLogin() {
            auth
            .signInWithEmailAndPassword(this.user.email, this.user.password)
            .then(() => {
                console.log('Auth ok')
                this.$router.push('/')
            })
            .catch((error) => {
              alert(error.message);
            });
        }
    }
}
</script>