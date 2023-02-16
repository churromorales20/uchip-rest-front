<template>
    <!----template-file
        accept=".jpg,.jpeg,.png,.bmp,.gif"
        :max-size="2048"
        @input="onFileChange"
        v-model="fileImage">-->
        <div @click="choosepicture">
            <q-img v-if="imagePath !== null" :src="imagePath">
                <template v-slot:error>
                    <div class="absolute-full flex flex-center admin-menu-product-item-image-error">
                        <q-icon name="fa-solid fa-circle-exclamation" />
                        <h5>Error cargando imagen</h5>
                    </div>
                </template>
            </q-img>
            <div v-else class="flex flex-center admin-menu-product-item-image-uploader">
                <q-icon name="fa-solid fa-cloud-arrow-up" />
                <h5>Cagar imagen</h5>
            </div>
            <input hidden accept="image/*" class="file-input" ref="fileInput" type="file" @input="onFileChange" />
        </div>
    <!--</q-file>-->
</template>

<script>
//import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import { ref } from 'vue'
//import { useAdminMenuStore } from 'stores/admin_menu'
import { useImageSelectorStore } from 'stores/image_selector'
export default {
    name: 'AdminProductImage',
    props: ['imagePath', 'productId'],
    components: {

    },
    computed: {
        
    },
    methods: {
        onFileChange(file) {
            const input = this.$refs.fileInput;
            const files = input.files;
            //this.FileImage = files[0];
            if (files && files[0]) {
                const reader = new FileReader();
                reader.onload = e => {
                    this.imageData = e.target.result;
                    console.log(String(e.target.result));
                    this.imgSelectorStore.setShowCropper({
                        cropper_src: String(e.target.result),
                        product_id: this.productId,
                    });
                };
                reader.readAsDataURL(files[0]);
                //this.$emit("input", files[0]);
            }
        },
        choosepicture() {
            this.$refs.fileInput.click();
        },
    },
    setup() {
        const imgSelectorStore = useImageSelectorStore();
        //const uAMenuStore = useAdminMenuStore();
        //uAMenuStore.loadMenuInformation();
        return {
            //uAMenuStore,
            imgSelectorStore,
            fileImage: ref(null),
        }
    }
}
</script>