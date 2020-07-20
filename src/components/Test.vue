<template>
    <div>
        TEST COMPONENT
        <b-form class="mb-2">
            <b-input
                    v-model="searchQuery"
                    id="inline-form-input-name"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="search"
                    autocomplete="off"
            ></b-input>
            <b-button type="submit" @click="doSearch">Search</b-button>
        </b-form>

        <div v-for="log in logos" :key="log.id">{{ log.name }}</div>

    </div>
</template>

<script>
    import {logosCollection} from "../firebase";

    export default {
        name: 'Test',
        data() {
            return {
                searchQuery: '',
                logos: [],
            }
        },

        methods: {
            doSearch (evt) {
                evt.preventDefault()
                console.log(this.searchQuery)
                // this.$bind('logos', logosCollection.orderBy('name').startAt([this.searchQuery]))
                this.$bind('logos', logosCollection
                    .where("name", '>=', this.searchQuery)
                    .where("name", '<=', this.searchQuery+'\uf8ff')
                    .orderBy('name')
                )
            }
        }

    }
</script>