<script setup>
import { ref } from 'vue'
import Login from '../pages/user/Login.vue'
import Signup from '../pages/user/Signup.vue'

const components = { Login, Signup }
</script>

<template>
  <Login />
  <Signup />
</template>
