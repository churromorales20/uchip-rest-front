<template>
    <TransitionGroup appear enter-active-class="animated flash">
        <div class="additional-item-container" v-show="!additional.blink" v-for="(additional, index_additional) in pStore.product_featured.sell.additionals" :key="index_additional">
            <div class="additional-item-header">
                <h4>{{ additional.name }}</h4>
                <span class="additional-item-header-required">
                    {{ !additional.required ? 'Opcional' : 'Obligatorio' }}
                </span>
            </div>
            <div class="additional-item-options">
                <div :class="'additional-item-option' + (additional.numeric_selector ? '-numeric' : '')" v-for="(additional_option, index_option) in additional.items_data" :key="index_option">
                    <template v-if="additional.numeric_selector">
                        <div class="additional-item-option-price">
                            <span>{{ additional_option.name }}</span>
                            <span v-if="additional_option?.price > 0">S/. {{ additional_option?.price }}</span>
                        </div>
                        <div class="additional-item-option-numeric-selector">
                            <q-btn @click="minusBtnAction(index_additional, index_option)" size="sm" push color="accent" round
                                icon="fa-solid fa-minus" />
                            <q-input v-model.number="additional_option.selected" type="number" filled />
                            <q-btn @click="plusBtnAction(index_additional, index_option)" size="sm" push color="green" round
                                icon="fa-regular fa-plus" />
                        </div>
                    </template>
                    <template v-else>
                        <div>
                            <q-checkbox :disable="isCheckboxDisabled(index_additional, index_option)"
                                v-on:click="checkAditionalQty(index_additional)" v-model="additional_option.selected" />
                        </div>
                        <div class="additional-item-option-price">
                            <span>{{ additional_option.name }}</span>
                            <span v-if="additional_option.price > 0">S/. {{ additional_option?.price }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </TransitionGroup>
    
</template>
<script>
import { defineComponent } from 'vue'
import { useProductsStore } from 'stores/products';
export default defineComponent({
    name: 'ProductAdditionals',
    methods: {
        checkAditionalQty(index){
            this.pStore.checkAdditionalExceeded(index);
        },
        isCheckboxDisabled(index_additional, index_option){
            return this.pStore.isCheckboxDisabled(index_additional, index_option);
        },
        minusBtnAction(index_additional, index_item){
            this.pStore.minusAdditionalItem(index_additional, index_item);
        },
        plusBtnAction(index_additional, index_item){
            this.pStore.plusAdditionalItem(index_additional, index_item);
        }
    },
    setup() {
        const pStore = useProductsStore();
        return {
            pStore
        }
    }
})
</script>