<template>
    <div>
        <div>
            <p>Upload an image to Firebase:</p>
            <input type="file" @change="previewImage" accept="application/pdf">
<!--            <input type="file" @change="previewImage" accept="image/*">-->
        </div>
        <div>
            <p>Progress: {{uploadValue.toFixed()+"%"}}
                <progress id="progress" :value="uploadValue" max="100"></progress>
            </p>
        </div>
        <div v-if="imageData!=null">
            <pdf :src="imageSrc" style="width: 200px"></pdf>
<!--            <img class="preview" :src="picture">-->
            <br>
            <button @click="onUpload">Upload</button>
        </div>

<!--        <template>-->
<!--            <pdf :src="imageSrc"></pdf>-->
<!--        </template>-->

    </div>
</template>


<script>
    import {storage} from '../firebase';
    import {logosCollection} from '../firebase';
    import pdf from 'vue-pdf'


    export default {
        name: 'Upload',
        components: {
            pdf
        },
        data() {
            return {
                imageData: null,
                picture: null,
                uploadValue: 0,
                imageSrc: ""
            }
        },
        methods: {
            previewImage(event) {
                this.uploadValue = 0;
                this.picture = null;
                this.imageData = event.target.files[0];
            },

            onUpload() {
                this.picture = null;
                const storageRef = storage.ref(`${this.imageData.name}`).put(this.imageData);
                storageRef.on(`state_changed`, snapshot => {
                        this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    }, error => {
                        console.log(error.message)
                    },
                    () => {
                        this.uploadValue = 100;
                        storageRef.snapshot.ref.getDownloadURL().then((url) => {
                            this.picture = url;
                            console.log(storageRef.snapshot.ref)

                            logosCollection.add({
                                name: `${this.imageData.name}`,
                                comment: '',
                                filename: `${this.imageData.name}`,
                                url_jpg: url,
                                url_pdf: url
                            });

                            this.imageSrc = url
                            console.log('url=', url)

                        });
                    }
                );
            }

        }
    }
</script>