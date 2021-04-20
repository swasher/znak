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


        <b-form-tags
                placeholder=""
                no-add-on-enter
                input-id="tags-basic"
                v-model="genereateTagCloud"
                class="mb-2"
        >
            <template v-slot="{ tags }">
                <div class="d-inline-block" style="font-size: 1.2rem;">
                    <b-form-tag
                            v-for="tag in tags"
                            no-remove
                            :key="tag"
                            variant="primary"
                            class="mr-1"
                    >
                        <div v-on:click="tagCloudClick(tag)">
                            {{ tag }}
                        </div>
                    </b-form-tag>
                </div>
            </template>

        </b-form-tags>


        <b-card-group v-if="viewMode === 'big'" deck class="px-3">

            <div v-for="(logo, index) in filteredLogos" :key="logo.id">
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

                    <!-- Попытка рендерить теги самостоятельно; выглядит уебански
                    <div style="max-width: 100px">
                        <b-badge v-for="tag in logo.tags" :key="tag"  variant="secondary" size="sm">{{ tag }}</b-badge>
                    </div>-->

                </b-card>
            </div>
        </b-card-group>

        <b-card-group v-else-if="viewMode === 'small'" deck>
            <div v-for="(logo) in filteredLogos" :key="logo.id" class="hover1">
                        <b-img  thumbnail v-on:click="downloadLogo(logo.id, logo.name)" :src="`${logo.id}` | jpegURL" class="thumb1" style="cursor: pointer"></b-img>
            </div>
        </b-card-group>

        <b-card-group v-else-if="viewMode === 'list'" deck>
            <div>
                <b-table-simple hover small caption-top >
                    <!--<caption>CAPTION:</caption>-->
                    <b-thead head-variant="light">
                        <b-tr>
                            <b-th>Pict</b-th>
                            <b-th>Name</b-th>
                            <b-th>Desc</b-th>
                            <b-th style="{ width: 10px }">Tags</b-th>
                        </b-tr>
                    </b-thead>
                    <b-tbody>

                        <b-tr v-for="(logo) in filteredLogos" :key="logo.id">
                            <b-td><b-img :src="`${logo.id}` | jpegURL" class="thumb1"></b-img></b-td>
                            <b-td>{{ logo.name }} </b-td>
                            <b-td>{{ logo.description }} </b-td>
                            <b-td><b-form-tags  v-if="logo.tags" size="sm" placeholder=""  v-model="logo.tags" ></b-form-tags></b-td>
                        </b-tr>

                    </b-tbody>
                </b-table-simple>
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

        firestore: {
            logos: logosCollection
        },

        props: {
        },

        data() {
            return {
                searchQuery: '',
                logosByName: [],
                logosByTag: [],
                logos: [],
                tagCloud: [],
            }
        },

        computed: {
            ...mapState({
                viewMode: "viewMode"
            }),
            // URL: () => URL,
            filteredLogos: function () {
                console.log('start filtering')
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

            genereateTagCloud: function () {
                // let tagCloud = [];
                let cloud1 = []
                this.logos.forEach(element => cloud1.push(element.tags))
                // console.log(cloud1)


                // Объеденяем "массив массивов" в один плоский массив (каждый логотип имеет массив тегов)
                let cloud = [].concat(...cloud1);
                console.log(cloud)

                // удаляем пустые теги
                cloud = cloud.filter(elem => !!elem)
                console.log(cloud)

                // удаляем повторяющиеся теги
                cloud = Array.from(new Set(cloud))
                console.log(cloud)

                // сортируем
                cloud.sort()

                return cloud
            }
        },


        methods: {

            tagCloudClick (tag) {
                console.log(tag)
                this.searchQuery = tag
            },

            removeLogo (id, index) {
                console.log('id=', id)
                console.log('index=', index)
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
                    console.log('Debug value:', this.logos[index])
                    this.$bvToast.toast(this.logos[index].name, {
                        title: 'Удален значок:',
                        variant: 'success',
                        autoHideDelay: 3000
                    })
                    this.$delete(this.logos, index);
                })
                    .catch((error) => {
                        console.error('Error delete:', error);
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

.thumb_big {
    max-height: 40px;
}
.card-header {
    font-weight: 600;
    padding: 8px;
}

.thumb1 {
    width: auto;
    height: 80px;
    margin: 2px;
}
.thumb1:hover {
    opacity: .8;
}
.hover1 figure {
}
.hover1 img {
    opacity: 1;
    -webkit-transition: .3s ease-in-out;
    transition: .3s ease-in-out;
}
.hover1:hover {
    background: #e5bb77;
}
.hover1 figure:hover img {
    /*background: #b44545;*/
    opacity: .9;
}

</style>