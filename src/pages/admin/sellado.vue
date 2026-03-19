<template>
    <div>
        <!-- Modal ZONE -->
        <Modal v-model="showModal" title="Agregar un artículo" @update:model-value="editSeal({}, false)">
            <div class="flex flex-row gap-4">
                <form @submit.prevent="" class="gap-3 flex flex-col">
                    <div>
                        <span> Titulo <span v-if="fieldIsEmpty(formulario.name)"
                                class="font-bold text-xs text-red-600">(requerido)</span></span>
                        <InputField v-model="formulario.name" @keyup.enter="" placeholder="Lorwyn Eclipsed Booster Box"
                            type="text" />
                    </div>
                    <div>
                        <span> Descripcion <span v-if="fieldIsEmpty(formulario.description)"
                                class="font-bold text-xs text-red-600">(requerido)</span></span>
                        <InputField v-model="formulario.description" @keyup.enter=""
                            placeholder="Esto es una playbooster" type="text" />
                    </div>
                    <div>
                        <span> Precio <span v-if="fieldIsEmpty(formulario.price)"
                                class="font-bold text-xs text-red-600">(requerido)</span></span>
                        <InputField v-model="formulario.price" @keyup.enter="" placeholder="100" type="text" />
                    </div>
                    <div>
                        <span> Cantidad disponible <span v-if="fieldIsEmpty(formulario.stock)"
                                class="font-bold text-xs text-red-600">(requerido)</span></span>
                        <InputField v-model="formulario.stock" @keyup.enter="" placeholder="1" type="text" />
                    </div>
                    <div>
                        <div class="bg-gt-dark-500 h-16 w-full flex flex-row items-center justify-center">
                            <input type="file" accept="image/*" id="imagepicker" />
                        </div>
                    </div>
                    <Button @click="saveSealed" :disabled="saveDisabled" :loading="uploading">{{ formulario.id ?
                        'Guardar' : 'Agregar'
                    }}</Button>

                </form>
                <div class="border-l-2 border-black pl-2 w-[600px] ">
                    <span>Previsualizacion</span>
                    <Sealed :value="formulario" show />
                </div>
            </div>
        </Modal>
        <Modal v-model="deleting" title="Borrando articulo" close-disabled>
            <div class="flex flex-col items-center gap-5 w-full">
                <span>Deseas realmente borrar este articulo?</span>
                <div class="flex fles-row gap-2 justify-around w-full">
                    <Button size="xsmall" @click="deleting = null" :loading="uploading">No</Button><Button size="xsmall"
                        color="#C44F3D" @click="deleteSeal(_, true)" :loading="uploading">Si</Button>
                </div>
            </div>
        </Modal>
        <!-- Modal ZONE -->
        <div>
            <h1 class="text-2xl font-bold mb-5">{{ `Panel de Admin > ${capitalizeFirstLetter(route.query.game)} >
                Sellados`}}</h1>
            <Button size="small mb-10" @click="showModal = true">Agregar nuevo artículo</Button>
            <div v-if="loadingSealed || uploading" class="w-full mt-10">
                <Loader />
            </div>
            <div v-else class="sealed-wrap">
                <Empty v-if="!sealed?.rows.length && !loadingSealed" />
                <div v-for="(value, index) in sealed?.rows" class="sealed-wrap-items">
                    <Sealed class="" :key="index" :value="value" edit />
                    <div class="flex fles-row gap-2 w-full">
                        <Button size="xsmall" color="#C44F3D" @click="deleteSeal(value)"
                            :loading="uploading">Delete</Button>
                        <Button size="xsmall" @click="editSeal(value)" :loading="uploading">Edit</Button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import Sealed from '@/components/shop/Sealed.vue';
import useShop from '@/composables/useShop';
import Modal from '@/components/atomic/Modal.vue';
import { fieldIsEmpty } from '@/utils/utils';
import Button from '@/components/atomic/Button.vue';
import InputField from '@/components/atomic/InputField.vue';
import { useToast } from "primevue/usetoast";
import useFile from '@/composables/useFile';
import Empty from '@/components/atomic/Empty.vue';
import Loader from '@/components/atomic/Loader.vue';
import { useRoute } from 'vue-router';
import { capitalizeFirstLetter } from '@/utils/utils';


const route = useRoute();

const {
    sealed,
    fetchSealedProducts,
    updateProduct,
    createProduct,
    deleteProduct,
    loading: loadingSealed
} = useShop(route.query.game);
const { uploadImage } = useFile();
const toast = useToast();
const showModal = ref(false);
const uploading = ref(false);
const deleting = ref(null);
const formulario = ref({});
const saveDisabled = computed(() => [
    formulario.value.name,
    formulario.value.description,
    formulario.value.price,
    formulario.value.stock,
].some(x => fieldIsEmpty(x)))

const saveSealed = async (edit = false) => {
    try {
        uploading.value = true;
        const elem = document?.getElementById("imagepicker");
        const filesToUpload = elem?.files?.length;
        let imageUrl = null
        if (filesToUpload) {
            const form = new FormData();
            form.append("file", elem.files[0])
            imageUrl = await uploadImage(form);
        }

        if (formulario.value.id) {
            if (imageUrl) {
                formulario.value.image = imageUrl;
            }
            await updateProduct(formulario.value);
            await fetchSealedProducts();
            showModal.value = false;
            uploading.value = false;
            toast.removeAllGroups();
            return toast.add({
                severity: "success",
                summary: "Guardado",
                detail: "Se ha actualizado correctamente el articulo",
                life: 3000,
            })
        } else {
            if (!imageUrl) {
                toast.removeAllGroups();
                uploading.value = false;
                return toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Imagen requerida",
                    life: 3000,
                })
            } else {
                formulario.value.image = imageUrl;
                await createProduct({ ...formulario.value, type: route.query.game });
                await fetchSealedProducts();
                showModal.value = false;
                uploading.value = false;
                toast.removeAllGroups();
                return toast.add({
                    severity: "success",
                    summary: "Creado",
                    detail: "Se ha creado correctamente el articulo",
                    life: 3000,
                })
            }
        }
    } catch (error) {
        console.error(error);
        uploading.value = false;
    }
}

const editSeal = (seal, show = true) => {
    formulario.value = { ...seal }
    showModal.value = show;
}
const deleteSeal = async (seal, confirmed = false) => {
    if (confirmed) {
        await deleteProduct(deleting.value);
        await fetchSealedProducts();
        deleting.value = null;
        toast.removeAllGroups();
        return toast.add({
            severity: "success",
            summary: "Borrado",
            detail: "Se ha borrado correctamente el articulo",
            life: 3000,
        });
    }
    deleting.value = seal;
}

onMounted(async () => {
    await fetchSealedProducts();
});
</script>

<style lang="scss" scoped>
.sealed-wrap {

    @include breakpoint(nm) {
        @include grid($columns: 1, $gap: 40px);
    }

    @include breakpoint(hd2) {
        @include grid($columns: 2, $gap: 40px);
    }

    @include breakpoint(fhd) {
        @include grid($columns: 3, $gap: 40px);
    }

    @include breakpoint(fhd2) {
        @include grid($columns: 3, $gap: 40px);
    }

    @include breakpoint(fhd3) {
        @include grid($columns: 4, $gap: 40px);
    }

    &-items {
        // flex flex-col gap-2
        @include flex(column, flex-start, flex-start);
        gap: 12px;
    }
}
</style>
