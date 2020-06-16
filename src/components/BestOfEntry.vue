<template>
    <div>
        <slot>Best <span class="capitalize">{{ category }}</span></slot>
        <div @drop="onDrop($event, 'theme')"
             @dragover.prevent
             @dragenter.prevent
             class="relative h-16 rounded border-dashed border-2 border-gray-600 flex justify-center items-center">
            <div draggable @dragstart="startDrag($event, entry)" @click="$emit('selected', entry)" class="w-full bg-blue-100 rounded h-16 text-black text-xl flex flex-col justify-center items-center" v-if="entry">
                <div @click="$emit('update:entry', null)" class="cursor-pointer absolute top-0 right-0 px-2 py-2"><span class="text-black"><svg class="h-2 w-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/></svg></span></div>
                <h2 class="text-xs font-semibold">{{ entry.name }}</h2>
                <span class="text-xs text-gray-600">by&nbsp;{{ entry.author }}</span>
            </div>
            <span v-else class="text-lg text-gray-600">Drop Entry Here</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            category: String,
            entry: Object,
            entries: Array,
        },
        name: "BestOfEntry",
        methods: {
            startDrag: (evt, entry) => {
                evt.dataTransfer.dropEffect = 'move'
                evt.dataTransfer.effectAllowed = 'move'
                evt.dataTransfer.setData('entry', entry.name)
            },
            onDrop (evt) {
                let entryName = evt.dataTransfer.getData('entry')
                let entry = this.entries.filter(entry => entry.name === entryName)[0]
                this.$emit('update:entry', entry)
            },
        }
    }
</script>

<style scoped>

</style>