<template>
    <div class="p-3">
        <div v-for="(group_item, index) in statusList" v-bind:key="index">
            <div class="alert shadow-lg mb-3 block w-full text-black" v-bind:style="'background-color: ' + group_item.group.color">
                <div>
                    <span>{{ group_item.group.label }}</span>
                </div>
            </div>
            <div class="w-full">
                <div v-for="(website_item, windex) in group_item.websites" v-bind:key="windex" class="p-3 w-6/12 inline-block">
                    <div class="card w-12/12 bg-base-100 shadow-xl"
                        v-bind:class="{ 'bg-neutral-content': website_item.success, 'bg-error': !website_item.success }"
                    >
                        <div class="card-body text-black">
                            <h2 class="card-title">{{ website_item.label }}</h2>
                            <p class="text-base">Last Check Time: {{ $dayjs(website_item.lastCheckTime).format('YYYY/MM/DD HH:mm:ss') }}</p>
                            <p class="text-xs">{{ website_item.respondMessage }}</p>
                            <div class="card-actions justify-end">
                                <button 
                                    class="btn mt-3" 
                                    v-bind:class="{ 'btn-neutral': website_item.loading, 'btn-primary': !website_item.loading }"
                                    @click="checkStatus(website_item)"
                                >Check</button>
                            </div>
                            <progress v-if="website_item.loading" class="progress w-full progress-primary"></progress>
                            <progress v-else class="progress w-full progress-primary" value="0" max="100"></progress>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                statusList: [],
                loadingWebsite: [],
            }
        },
        methods: {
            async fetchData() {
                const result = await $fetch( '/api/status', {
                    method: 'GET',
                    headers: useRequestHeaders(['cookie']),
                })

                this.statusList = result.statusObject
            },
            async checkStatus(website) {
                for (let i = 0; i < this.statusList.length; i++) {
                    const status = this.statusList[i]
                    for (let j = 0; j < status.websites.length; j++) {
                        if (status.websites[j].id === website.id) {
                            if (status.websites[j].loading) {
                                return
                            }
                            status.websites[j].loading = true
                            break
                        }
                    }
                }

                const result = await $fetch( `/api/status/${website.id}`, {
                    method: 'PATCH',
                    headers: useRequestHeaders(['cookie']),
                })
                
                for (let i = 0; i < this.statusList.length; i++) {
                    const status = this.statusList[i]
                    for (let j = 0; j < status.websites.length; j++) {
                        if (status.websites[j].id === website.id) {
                            status.websites[j].loading = false
                            status.websites[j].lastCheckTime = result.updated.lastCheckTime
                            status.websites[j].success = result.updated.success
                            status.websites[j].respondCode = result.updated.respondCode
                            status.websites[j].respondMessage = result.updated.respondMessage
                            break
                        }
                    }
                }
            }
        },
        beforeMount() {
            this.fetchData()
        }
    }
</script>