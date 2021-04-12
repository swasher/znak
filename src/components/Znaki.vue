/* eslint-enable */
<template>
    <div>

<!--        <b-form class="mb-2" v-on:submit.prevent="getData">-->

<!--        Card state is: {{cardState}}-->

        <b-form class="mb-2">
            <b-input
                    v-model="searchQuery"
                    id="inline-form-input-name"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="search"
                    autocomplete="off"
            ></b-input>
        </b-form>

        <b-card-group v-if=cardStateStore deck class="px-3">
            <div v-for="(logo) in filteredLogos" :key="logo.id">
                <b-card border-variant="dark" align="center" :header="logo.name" class="m-1">

                    <b-img :src="`${logo.id}` | jpegURL" class="thumb1"></b-img>
                    <div style="max-width: 120px">
                    <b-card-text>{{ logo.description }}</b-card-text>
                    </div>


                    <p></p>
                    <b-button :to="{ name: 'edit', params: { id: logo.id } }" class="mr-1 mb-1" variant="primary" size="sm"><b-icon icon="pencil"></b-icon></b-button>
                    <b-button v-on:mouseup="removeLogo(logo.id, index)" class="mr-1 mb-1" href="#" variant="primary" size="sm" ><b-icon icon="trash-fill"></b-icon></b-button>
                    <b-button v-on:click="downloadLogo(logo.id, logo.name)" title="Download file" class="mr-1 mb-1" variant="primary" size="sm" ><b-icon icon="cloud-download"></b-icon></b-button>
                    <div style="max-width: 120px">
                        <b-form-tags  v-if="logo.tags" size="sm" placeholder=""  v-model="logo.tags" ></b-form-tags>
                    </div>
                </b-card>
            </div>
        </b-card-group>

        <b-card-group v-else deck>
            <div v-for="(logo) in logos" :key="logo.id">
                <b-img thumbnail :src="`${logo.id}` | jpegURL" class="thumb1"></b-img>
            </div>
        </b-card-group>



<!--&lt;!&ndash;        <h3>Combined logos</h3>&ndash;&gt;-->
<!--&lt;!&ndash;        <div v-for="log in logos" :key="log.id">{{ log.name }}</div>&ndash;&gt;-->
<!--        <h5>logos by name</h5>-->
<!--        <div v-for="logo in logosByName" :key="logo.id">{{ logosByName.name }} {{ logosByName.tags }}</div>-->
<!--        <h5>logos by tag</h5>-->
<!--        <div v-for="logo in logosByTag" :key="logo.id">{{ logosByTag.name }} {{ logosByTag.tags }}</div>-->

    </div>
</template>

<script>

    import {mapState} from "vuex";
    import { logosCollection } from '../firebase'
    import { storage } from '../firebase'
    import { JPEG_EXT } from '../const'
    import { PDF_EXT } from '../const'
    // import { URL } from '../const'
    // import { pdfURL } from '../utils'


    function saveBlob(blob, fileName) {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.dispatchEvent(new MouseEvent('click'));
    }

    export default {

        name: 'Znaki',

        props: {
          // bigCard: Boolean,
        },

        computed: {
            ...mapState({
                cardStateStore: "cardIsBig"
            }),
            // URL: () => URL,
            filteredLogos: function () {
                if (this.searchQuery) {
                    return this.logos.filter(logo => {
                        if ((logo.tags && logo.tags.includes(this.searchQuery)) || logo.name.includes(this.searchQuery)) {
                            return logo
                        }
                    })
                } else {
                    return this.logos
                }
            },
        },

        data() {
            return {
                searchQuery: '',
                logosByName: [],
                logosByTag: [],
                logos: [],
            }
        },

        firestore: {
            logos: logosCollection
        },

        methods: {

            removeLogo: function (id, index) {
                console.log('id=', id)
                // let fn = this.logos[index].filename
                // console.log('fn=', fn)
                let jpgRef = storage.ref(id+JPEG_EXT);
                let pdfRef = storage.ref(id+PDF_EXT);

                jpgRef.delete().then(function() {
                    console.log('Delete jpg success:', jpgRef.name)
                }).catch((error) => {
                    console.error('Delete jpg ERROR:', jpgRef.name, error)
                });

                pdfRef.delete().then(function() {
                    console.log('Delete pdf success:', pdfRef.name)
                }).catch((error) => {
                    console.error('Delete pdf ERROR:', pdfRef.name, error)
                });

                logosCollection.doc(id).delete().then(() =>{
                        this.$bvToast.toast(this.logos[index].name, {
                            title: 'Delete:',
                            autoHideDelay: 3000
                        })
                        this.$delete(this.logos, index);
                })
                    .catch((error) => {
                        console.error(error);
                    })
            },

            downloadLogo (id, name) {
                console.log('Start download:', id, '=>', name)
                let pdf_filename = id+PDF_EXT
                let pdfRef = storage.ref(pdf_filename);
                pdfRef.getDownloadURL().then(function(url) {
                    let xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    /*eslint-disable no-unused-vars*/
                    xhr.onload = function(event) {
                        let blob = xhr.response;
                        saveBlob(blob, name+PDF_EXT);
                    };
                    xhr.open('GET', url);
                    xhr.send();
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
    }
</script>

<style>
.card-text {
    font-size: 10pt;
}
.thumb1 {
    width: auto;
    height: 80px;
    margin: 2px;
}
.thumb_big {
    max-height: 40px;
}
.card-header {
    font-weight: 600;
    padding: 8px;
}
</style>