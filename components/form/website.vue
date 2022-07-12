<template>
    <form @submit.prevent="">
        <input type="checkbox" id="website-modal" class="modal-toggle" />
        <label for="website-modal" class="modal cursor-pointer">
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

                <!-- groupid select -->
                <div class="form-control w-full mb-3">
                    <label class="label">
                        <span class="label-text">Group</span>
                    </label>
                    <select 
                        class="select select-bordered w-full max-w-xs"
                        v-bind:class="{ 'border-red-500': error.groupId }"
                        v-model="groupId"
                    >
                        <option value="-1">Please Select</option>
                        <option v-for="(group_item, index) in groupList" v-bind:key="index" v-bind:value="group_item.id">
                            {{ group_item.label }}
                        </option>
                    </select>
                    <label v-if="error.groupId" class="flex justify-start text-red-700">{{error.groupId}}</label>
                </div>

                <!-- check url -->
                <div class="form-control w-full mb-3">
                    <label class="label">
                        <span class="label-text">Check URL</span>
                    </label>
                    <div class="grid grid-cols-2 gap-2 items-center justify-start">
                        <input type="text" 
                            placeholder="Type here" v-model="checkURL" 
                            class="input input-bordered w-full max-w-xs" 
                            v-bind:class="{ 'border-red-500': error.checkURL }"
                        />
                        <button class="btn btn-primary w-20" @click="checkResponseFromURL()">CHECK</button>
                    </div>
                    
                    <label v-if="error.checkURL" class="flex justify-start text-red-700">{{error.checkURL}}</label>
                    <label v-if="checkURLResponse.raw != null" 
                        class="flex justify-start"
                        v-bind:class="{ 'text-red-700': checkURLResponse.error }"
                    >{{ checkURLResponse.message }}</label>
                </div>

                <!-- checkKey -->
                <div class="form-control w-full mb-3">
                    <label class="label">
                        <span class="label-text">Check Key</span>
                    </label>
                    <input type="text" 
                        placeholder="Type here" v-model="checkKey" 
                        class="input input-bordered w-full max-w-xs" 
                        v-bind:class="{ 'border-red-500': error.checkKey }"
                    />
                    <label v-if="error.checkKey" class="flex justify-start text-red-700">{{error.checkKey}}</label>
                </div>

                <!-- checkObject -->
                <div class="form-control w-full mb-3">
                    <label class="label">
                        <span class="label-text">Check Object</span>
                    </label>
                    <input type="text" 
                        placeholder="Type here" v-model="checkObject" 
                        class="input input-bordered w-full max-w-xs" 
                        v-bind:class="{ 'border-red-500': error.checkObject }"
                    />
                    <label v-if="error.checkObject" class="flex justify-start text-red-700">{{error.checkObject}}</label>
                </div>

                <!-- checkType select -->
                <div class="form-control w-full mb-3">
                    <label class="label">
                        <span class="label-text">Check Type</span>
                    </label>
                    <select 
                        class="select select-bordered w-full max-w-xs"
                        v-bind:class="{ 'border-red-500': error.checkType }"
                        v-model="checkType"
                    >
                        <option value="">Please Select</option>
                        <option value="startwith">Start With</option>
                        <option value="equalexact">Equal Exact</option>
                        <option value="statuscode">Status Code</option>
                    </select>
                    <label v-if="error.checkType" class="flex justify-start text-red-700">{{error.checkType}}</label>
                </div>

                <!-- enabled select -->
                <div class="form-control w-full mb-3">
                    <label class="label">
                        <span class="label-text">Enabled</span>
                    </label>
                    <select 
                        class="select select-bordered w-full max-w-xs"
                        v-model="enabled"
                    >
                        <option :value="true">Enabled</option>
                        <option :value="false">Disabled</option>
                    </select>
                </div>

                <!-- model action -->
                <div class="modal-action">
                    <button class="btn btn-active btn-primary" @click="submitHandler()">Save</button>
                    <label for="website-modal" class="btn btn-active">Close</label>
                </div>
            </label>
        </label>
    </form>
</template>

<script>
    export default {
        props: ['currentEdit', 'groupList'],
        data() {
            return {
                id: null,
                label: '',
                checkURL: '',
                checkKey: '',
                checkObject: '',
                checkType: '',
                groupId: -1,
                enabled: true,
                error: {
                    label: null,
                    checkURL: null,
                    checkObject: null,
                    checkType: null,
                    checkKey: null,
                    groupId: null,
                },
                checkURLResponse: {
                    raw: null,
                    message: '',
                    error: false,
                }
            }
        },
        computed: {
            displayTitle() {
                if (this.id) {
                    return 'Update Website'
                }
                return 'Create Website'
            }
        },
        watch: {
            currentEdit: function(val) {
                if (val) {
                    this.id = val.id
                    this.label = val.label
                    this.checkURL = val.checkURL
                    this.checkObject = val.checkObject
                    this.checkType = val.checkType
                    this.checkKey = val.checkKey
                    this.groupId = val.groupId
                    this.enabled = val.enabled
                } else {
                    this.id = null
                    this.label = ''
                    this.checkURL = ''
                    this.checkObject = ''
                    this.checkType = ''
                    this.checkKey = ''
                    this.groupId = -1
                    this.enabled = true
                }
            },
            checkKey: function(val) {
                if (val) {
                    if (this.checkURLResponse.raw && this.checkURLResponse.raw[val]) {
                        this.checkObject = this.checkURLResponse.raw[val]
                    }
                }
            },
            label: function() {
                this.error.label = null
            },
            checkURL: function() {
                this.error.checkURL = null
            },
            checkObject: function() {
                this.error.checkObject = null
            },
            checkType: function() {
                this.error.checkType = null
            },
            groupId: function() {
                this.error.groupId = null
            }
        },
        methods: {
            async checkResponseFromURL() {
                if (!this.checkURL) {
                    this.error.checkURL = 'url is missing'
                    return
                }

                try {
                    const result = await $fetch(this.checkURL, {
                        method: 'GET',
                    })

                    this.checkURLResponse.raw = result
                    this.checkURLResponse.message = JSON.stringify(result)
                    this.checkURLResponse.error = false
                } catch (e) {
                    this.checkURLResponse.raw = e
                    this.checkURLResponse.message = JSON.stringify(e.message)
                    this.checkURLResponse.error = true
                }
            },
            async submitHandler() {
                try {
                    let hasError = false
                    if (!this.label) {
                        hasError = true
                        this.error.label = 'label is missing'
                    }
                    if (!this.checkURL) {
                        hasError = true
                        this.error.checkURL = 'check URL is missing'
                    }
                    if (!this.checkType) {
                        hasError = true
                        this.error.checkType = 'check type is missing'
                    } else {
                        if (this.checkType === 'startwith' || this.checkType === 'equalexact') {
                            if (!this.checkObject) {
                                hasError = true
                                this.error.checkObject = 'check object is missing'
                            }
                        }
                    }

                    if (this.checkKey) {
                        if (this.checkURLResponse.raw && !this.checkURLResponse.raw[this.checkKey]) {
                            hasError = true
                            this.error.checkKey = 'check key is not a key for this response'
                        }
                    }

                    if (this.groupId === -1) {
                        hasError = true
                        this.error.groupId = 'group is missing'
                    }

                    if (hasError) {
                        return
                    }

                    if (this.id) {
                        // if id has value, then it is updating
                        const result = await $fetch (`/api/website/${this.id}`, {
                            method: 'PATCH',
                            body: {
                                label: this.label,
                                checkURL: this.checkURL,
                                checkObject: this.checkObject,
                                checkType: this.checkType,
                                checkKey: this.checkKey,
                                groupId: this.groupId,
                                enabled: this.enabled,
                            },
                            headers: useRequestHeaders(['cookie'])
                        })

                        window.location.reload(true)
                        return
                    } else {
                        const result = await $fetch('/api/website', {
                            method: 'POST',
                            body: {
                                label: this.label,
                                checkURL: this.checkURL,
                                checkObject: this.checkObject,
                                checkType: this.checkType,
                                checkKey: this.checkKey,
                                groupId: this.groupId,
                                enabled: this.enabled,
                            }, 
                            headers: useRequestHeaders(['cookie'])
                        })

                        window.location.reload(true)
                    }

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
