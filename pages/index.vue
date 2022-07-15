<script setup>
  import IconAccountBox from '~icons/mdi/account-box'
</script>

<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>
      <form class="mt-8 space-y-6" v-on:submit="loginHandler">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Username</label>
            <label v-if="error.username" class="flex justify-center text-red-700">{{error.username}}</label>
            <input id="email-address" v-model="username" name="email" required="" 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              v-bind:class="{ 'border-red-500': error.username }"
              placeholder="Username" 
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" v-model="password" name="password" type="password" required="" 
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
              v-bind:class="{ 'border-red-500': error.password }"
              placeholder="Password" 
            />
             <label v-if="error.password" class="flex justify-center text-red-700">{{error.password}}</label>
          </div>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <icon-account-box style="font-size: 2em; color: white" />
            </span>
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: {
          username: null,
          password: null,
        }
      }
    },
    watch: {
      username() {
        this.error.username = null
      },
      password() {
        this.error.password = null
      }
    },
    methods: {
      async loginHandler(evt) {
        evt.preventDefault()
        try {
          const result = await $fetch( '/api/login', {
              method: 'POST',
              body: {
                username: this.username,
                password: this.password,
              }
          })
          if (result.token) {
            const jwt = useCookie('jwt')
            jwt.value = result.token
            navigateTo({ path: '/dashboard' })
          }
        } catch (e) {
          this.error = {
            username: 'Fail to login',
            password: e.message
          }
        }
      },
      async checkLogin() {
        try {
          const result = await $fetch( '/api/me', {
            method: 'GET',
            headers: useRequestHeaders(['cookie']),
          })

          navigateTo({ path: '/dashboard' })
        } catch (e) {

        }
      }
    },
    beforeMount() {
      this.checkLogin()
    }
  }

</script>