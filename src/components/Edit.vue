<template>
    <div>
        <h1>Edit {{ znak.name }}</h1>
        <div>
            <b-img :src="`${id}` | jpegURL"  thumbnail fluid center></b-img>
        </div>

        <b-form @submit="updateZnak">
            <b-form-group label="Название:" >
                <b-form-input v-model="znak.name" class="mb-2" required></b-form-input>
            </b-form-group>

            <b-form-group label="Тэги:" >
            <!--        <label for="tags-basic">Type a new tag and press enter</label>-->
            <b-form-tags input-id="tags-basic" v-model="znak.tags" class="mb-2"></b-form-tags>
            </b-form-group>

            <b-form-group label="Описание:" >
                <b-form-input v-model="znak.description" placeholder="Description"></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">Save</b-button>
        </b-form>

    </div>
</template>

<script>
import { logosCollection } from '../firebase'
export default {

    name: 'Edit',

    data() {
        return {
            znak: null,
        }
    },

    props: {
        id: {
            type: String,
            required: true
        }
    },

    mounted() {
        this.fetchZnak()
    },

    methods: {
        fetchZnak() {
            logosCollection.doc(this.id).get().then(snapshot => {
                if (snapshot.exists) {
                    this.znak = snapshot.data()
                } else {
                    console.log("No such document!");
                }
            })
        },

        updateZnak(event) {
            event.preventDefault();
            logosCollection
                .doc(this.id)
                .update(this.znak)
                .then(() => {
                    console.log("Updated document with ID: ", this.id);
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                    this.$bvToast.toast(error.message, {
                        title: 'Вы должны быть зарегестрированы:',
                        solid: true,
                        variant: 'danger',
                        autoHideDelay: 5000
                    })
                });
            this.$router.push("/");
        },
    },
}
</script>