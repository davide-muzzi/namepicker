<script setup>
import { ref } from "vue";
import PickNames from "./components/PickNames.vue";
import ManageClasses from "./components/ManageClasses.vue";

const tab = ref("pick");
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>Namepicker</h1>

      <nav class="tabs">
        <button :class="{ active: tab === 'pick' }" @click="tab = 'pick'">
          Namen ziehen
        </button>
        <button :class="{ active: tab === 'manage' }" @click="tab = 'manage'">
          Klassen verwalten
        </button>
      </nav>
    </header>

    <main class="card">
      <PickNames v-if="tab === 'pick'" />
      <ManageClasses v-else />
    </main>
  </div>
</template>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 24px; }
.header { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.tabs { display: flex; gap: 8px; }
button { padding: 10px 12px; border-radius: 10px; border: 1px solid #ddd; background: #fff; cursor: pointer; }
button.active { border-color: #111; }
.card { margin-top: 16px; padding: 16px; border: 1px solid #eee; border-radius: 16px; background: #fff; }
</style>
