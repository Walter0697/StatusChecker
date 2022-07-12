<template>
    <div>
        <div class="navbar bg-base-100">
            <div class="navbar-start">
                <div class="dropdown">
                    <label tabindex="0" class="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </label>
                    <Menu />
                </div>
            </div>
            <div class="navbar-center">
                <a class="btn btn-ghost normal-case text-xl">Website</a>
            </div>
            <div class="navbar-end">
                <label for="website-modal" class="btn btn-ghost btn-circle text-lg modal-button" @click="openForm()">
                    +
                </label>
            </div>
        </div>

        <div v-for="(website_item, index) in websiteList" v-bind:key="index" class="flex justify-center">
            <div class="alert shadow-lg mb-3 w-11/12" v-bind:style="'background-color: ' + getColorFromGroupId(website_item.groupId)">
                <div class="flex justify-between w-full grid grid-cols-2 gap-2">
                    <div>{{ website_item.label }} <span v-if="!website_item.enabled">(Inactive)</span></div>
                    <div>{{ website_item.checkURL }}</div>
                    <div>{{ getDescription(website_item) }}</div>
                    <div class="self-end">
                        <label for="website-modal" class="btn btn-primary btn-sm mr-3 modal-button" @click="editForm(website_item)">Update</label>
                        <label class="btn btn-secondary btn-sm" @click="deleteForm(websiteitem)">Delete</label>
                    </div>
                </div>
            </div>
        </div>
        <FormWebsite v-bind:currentEdit="editingWebsite" v-bind:groupList="groupList" />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                websiteList: [],
                groupList: [],
                editingWebsite: null,
            }
        },
        methods: {
            getColorFromGroupId(groupId) {
                const group = this.groupList.find(s => s.id === groupId)
                return group.color
            },
            getDescription(item) {
                if (item.checkType === 'startwith') {
                    return 'Starts With ' + item.checkObject
                } else if (item.checkType === 'equalexact') {
                    return 'Equals to ' + item.checkObject
                } else {
                    return 'Request Success'
                }
            },
            openForm() {
                this.editingWebsite = null
            },
            editForm(item) {
                this.editingWebsite = item
            },
            async deleteForm(item) {
                if (!(confirm('Are you sure you want to delete ' + item.label))) return

                const result = await $fetch( `/api/website/${item.id}`, {
                    method: 'DELETE',
                    headers: useRequestHeaders(['cookie']),
                })

                window.location.reload(true)
            },
            async fetchGroupData() {
                const result = await $fetch( '/api/groups', {
                    method: 'GET',
                    headers: useRequestHeaders(['cookie']),
                })

                this.groupList = result.groups.sort((a, b) => {
                    return a.displayOrder - b.displayOrder
                })
            },
            async fetchData() {
                const result = await $fetch( '/api/websites', {
                    method: 'GET',
                    headers: useRequestHeaders(['cookie']),
                })

                this.websiteList = result.websites
            }
        },
        beforeMount() {
            this.fetchGroupData()
            this.fetchData()
        }
    }
</script>