<template>
    <form @submit.prevent="">
        <input type="checkbox" id="group-modal" class="modal-toggle" />
        <label for="group-modal" class="modal cursor-pointer">
            <label class="modal-box relative" for="">
                <h3 class="text-lg font-bold flex justify-center">{{displayTitle}}</h3>
                <!-- label -->
                <div class="form-control w-full mb-3">
                    <label class="label">
                        <span class="label-text">Label</span>
                    </label>
                    <input type="text" 
                        placeholder="Type here" v-model="label" 
                        class="input input-bordered w-full max-w-xs" 
                        v-bind:class="{ 'border-red-500': error.label }"
                    />
                    <label v-if="error.label" class="flex justify-start text-red-700">{{error.label}}</label>
                </div>

                <!-- color -->
                <div class="form-control w-full mb-3">
                    <label class="label">
                        <span class="label-text">Color</span>
                    </label>
                    <div class="grid grid-cols-3 gap-2 items-center justify-start">
                        <button class="btn w-24" v-bind:style="displayColor"></button>
                        <input type="text" 
                            placeholder="Type here" v-model="color" 
                            class="input input-bordered w-full max-w-xs" 
                            v-bind:class="{ 'border-red-500': error.color }"
                        />
                    </div>
                    <label v-if="error.label" class="flex justify-start text-red-700">{{error.color}}</label>
                </div>

                <!-- display order -->
                <div class="form-control w-full mb-3">
                    <label class="label">
                        <span class="label-text">Display Order</span>
                    </label>
                    <input type="text" 
                        placeholder="Type here" v-model="displayOrder" 
                        class="input input-bordered w-full max-w-xs" 
                        v-bind:class="{ 'border-red-500': error.displayOrder }"
                    />
                    <label v-if="error.label" class="flex justify-start text-red-700">{{error.displayOrder}}</label>
                </div>

                <!-- model action -->
                <div class="modal-action">
                    <button class="btn btn-active btn-primary" @click="submitHandler()">Save</button>
                    <label for="group-modal" class="btn btn-active">Close</label>
                </div>
            </label>
        </label>
    </form>
</template>

<script>
    export default {
        props: ['currentEdit'],
        data() {
            return {
                id: null,
                label: '',
                color: '#194d33',
                displayOrder: 100,
                error: {
                    label: null,
                    color: null,
                    displayOrder: null,
                }
            }
        },
        computed: {
            displayColor() {
                if (/^#[0-9A-F]{6}$/i.test(this.color)) {
                    return 'background-color: ' + this.color
                }
                return 'background-color: #000000'
            },
            displayTitle() {
                if (this.id) {
                    return 'Update Group'
                }
                return 'Create Group'
            }
        },
        watch: {
            currentEdit: function(val) {
                if (val) {
                    this.id = val.id
                    this.label = val.label
                    this.color = val.color
                    this.displayOrder = val.displayOrder
                } else {
                    this.id = null
                    this.label = ''
                    this.color = '#194d33'
                    this.displayOrder = 100
                }
            },
            label: function() {
                this.error.label = null
            },
            color: function() {
                this.error.color = null
            },
            displayOrder: function() {
                this.error.displayOrder = null
            }
        },
        methods: {
            async submitHandler(evt) {
                evt.preventDefault()
                try {
                    let hasError = false
                    if (!this.label) {
                        hasError = true
                        this.error.label = 'label is missing'
                    }
                    if (!this.color) {
                        hasError = true
                        this.error.color = 'color is missing'
                    } else if (!/^#[0-9A-F]{6}$/i.test(this.color)) {
                        hasError = true
                        this.error.color = 'invalid color'
                    }
                    if (!this.displayOrder) {
                        hasError = true
                        this.error.displayOrder = 'display order is missing'
                    } else if (!/^\d+$/.test(this.displayOrder)) {
                        hasError = true
                        this.error.displayOrder = 'display order should only be number'
                    }

                    if (hasError) {
                        return
                    }
                    
                    if (this.id) {
                        // if id has value, then it is updating
                        const result = await $fetch( `/api/group/${this.id}`, {
                            method: 'PATCH',
                            body: {
                                label: this.label,
                                color: this.color,
                                displayOrder: parseInt(this.displayOrder),
                            }, 
                            headers: useRequestHeaders(['cookie'])
                        })

                        window.location.reload(true)
                        return
                    }
                    const result = await $fetch( '/api/group', {
                        method: 'POST',
                        body: {
                            label: this.label,
                            color: this.color,
                            displayOrder: parseInt(this.displayOrder),
                        }, 
                        headers: useRequestHeaders(['cookie'])
                    })

                    window.location.reload(true)
                } catch(e) {
                    this.error = {
                        label: 'Fail to submit',
                        color: '.',
                        displayOrder: e.message,
                    }
                }
            }
        }
    }
</script>
