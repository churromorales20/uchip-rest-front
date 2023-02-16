import { defineStore } from 'pinia';
import { uchipRequest } from '../utils/uchipRequest';
import { Notify } from 'quasar'

export const useImageSelectorStore = defineStore('image_selector', {
    state: () => ({
        image_cropper_info: null,
    }),
    getters: {
        showCropper: (state) => {
            return state.image_cropper_info !== null;
        },
        cropperSrc: (state) => {
            return state.image_cropper_info?.cropper_src;
        },
        productId: (state) => {
            return state.image_cropper_info?.product_id;
        }
    },
    actions: {
        setShowCropper(info){
            this.image_cropper_info = info;
        }
    },
});
