<template>
    <div class="p-3">
        <div v-for="(group_item, index) in statusList" v-bind:key="index">
            <div class="alert shadow-lg mb-3 block w-full text-black" v-bind:style="'background-color: ' + group_item.group.color">
                <div>
                    <span>{{ group_item.group.label }}</span>
                </div>
            </div>
            <div class="w-full flex justify-center">
                <div v-for="(website_item, windex) in group_item.websites" v-bind:key="windex" class="flex justify-start">
                    <div class="card w-50 bg-base-100 shadow-xl m-3"
                        v-bind:class="{ 'bg-neutral': website_item.success, 'bg-error': !website_item.success }"
                    >
                        <div class="card-body text-black">
                            <h2 class="card-title">{{ website_item.label }}</h2>
                            <p class="text-base">Last Check Time: {{ $dayjs(website_item.lastCheckTime).format('YYYY/MM/DD HH:mm:ss') }}</p>
                            <p class="text-xs">{{ website_item.respondMessage }}</p>
                            <div class="card-actions justify-end">
                                <button class="btn btn-primary mt-3" @click="checkStatus(website_item)">Check</button>
                            </div>
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
                const result = await $fetch( `/api/status/${website.id}`, {
                    method: 'PATCH',
                    headers: useRequestHeaders(['cookie']),
                })
                console.log(result)
            }
        },
        beforeMount() {
            this.fetchData()
        }
    }
</script>