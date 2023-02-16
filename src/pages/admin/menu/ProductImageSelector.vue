<template>
    <q-dialog ref="_product_image_selector_" v-model="showSelector" persistent>
        <q-card class="admin-image-selector-dialog">
            <q-card-section class="row items-center">
                <div class="admin-image-selector-cropper">
                    <VuePictureCropper 
                        :boxStyle="{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#f8f8f8',
                            margin: 'auto',
                        }" 
                        :img="imgSelectorStore.cropperSrc" 
                        :options="{
                            viewMode: 1,
                            dragMode: 'crop',
                            aspectRatio: 16 / 16,
                        }" />
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="admin-warning" v-close-popup />
                <q-btn 
                    :loading="saving"
                    :disable="saving"
                    label="Continuar (Borrar)" 
                    outline
                    @click="cropAndSave"
                    color="admin-warning" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import { ref } from 'vue'
import { useImageSelectorStore } from 'stores/image_selector'
import { useAdminMenuStore } from 'stores/admin_menu'
export default {
    name: 'ProductImageSelector',
    components: {
        VuePictureCropper
    },
    computed: {
        showSelector: {
            get() {
                return this.imgSelectorStore.showCropper;
            },
            set(newMap) {
                this.imgSelectorStore.setShowCropper(null);
            }
        },
    },
    methods: {
        async cropAndSave() {
            if (!cropper) return
            this.saving = true;
            //const base64 = cropper.getDataURL();
            await this.uAMenuStore.updateImage(cropper.getDataURL(), this.imgSelectorStore.productId);
            this.imgSelectorStore.setShowCropper(null);
            this.saving = false;
            /*const blob = await cropper.getBlob()
            if (!blob) return
            const file = await cropper.getFile({
                fileName: locales.fileName,
            })
            console.log({ base64, blob, file })
            result.dataURL = base64
            result.blobURL = URL.createObjectURL(blob)
            //isShowModal.value = false*/
        },
    },
    setup() {
        const imgSelectorStore = useImageSelectorStore();
        const uAMenuStore = useAdminMenuStore();
        return {
            imgSelectorStore,
            uAMenuStore,
            saving: ref(false),
        }
    }
}
</script>