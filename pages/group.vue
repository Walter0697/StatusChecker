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
                <a class="btn btn-ghost normal-case text-xl">Group</a>
            </div>
            <div class="navbar-end">
                <label for="group-modal" class="btn btn-ghost btn-circle text-lg modal-button" @click="openForm()">
                    +
                </label>
            </div>
        </div>

        <div v-for="(group_item, index) in groupList" v-bind:key="index" class="flex justify-center">
            <div class="alert shadow-lg mb-3 w-11/12" v-bind:style="'background-color: ' + group_item.color">
                <div class="flex justify-between w-full grid grid-cols-3 gap-2">
                    <div>{{ group_item.label }}</div>
                    <div>{{ group_item.displayOrder }}</div>
                    <div class="self-end">
                        <label for="group-modal" class="btn btn-primary btn-sm mr-3 modal-button" @click="editForm(group_item)">Update</label>
                        <label class="btn btn-secondary btn-sm" @click="deleteForm(group_item)">Delete</label>
                    </div>
                </div>
            </div>
        </div>
        <FormGroup v-bind:currentEdit="editingGroup" />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                groupList: [],
                editingGroup: null,
            }
        },
        methods: {
            openForm() {
                this.editingGroup = null
            },
            editForm(item) {
                this.editingGroup = item
            },
            async deleteForm(item) {
                if (!(confirm('Are you sure you want to delete ' + item.label))) return

                const result = await $fetch( `/api/group/${item.id}`, {
                    method: 'DELETE',
                    headers: useRequestHeaders(['cookie']),
                })

                window.location.reload(true)
            },
            async fetchData() {
                const result = await $fetch( '/api/groups', {
                    method: 'GET',
                    headers: useRequestHeaders(['cookie']),
                })

                this.groupList = result.groups.sort((a, b) => {
                    return a.displayOrder - b.displayOrder
                })
            }
        },
        beforeMount() {
            this.fetchData()
        }
    }
</script>