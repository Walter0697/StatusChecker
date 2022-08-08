<template>
    <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
        <li><a href='/dashboard'>Dashboard</a></li>
        <li><a href='/group'>Group</a></li>
        <li><a href='/website'>Website</a></li>
        <li><a v-on:click="logoutHandler">Logout</a></li>
    </ul>
</template>

<script>
    export default {
        methods: {
            async logoutHandler(evt) {
                const jwt = useCookie('jwt')
                jwt.value = null
                navigateTo({ path: '/' })
            }
        }
    }
</script>
