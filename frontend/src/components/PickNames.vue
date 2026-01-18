<script setup>
import { onMounted, ref, computed } from "vue";
import { apiGet, apiPost } from "../api";

const classes = ref([]);
const selectedClassId = ref("");
const count = ref(1);
const picked = ref([]);
const error = ref("");
const loading = ref(false);

const selectedClass = computed(() =>
  classes.value.find((c) => String(c.id) === String(selectedClassId.value))
);

async function loadClasses() {
  classes.value = await apiGet("/classes");
  if (!selectedClassId.value && classes.value.length) {
    selectedClassId.value = String(classes.value[0].id);
  }
}

async function pick() {
  error.value = "";
  picked.value = [];
  loading.value = true;
  try {
    const res = await apiPost("/pick", {
      class_id: Number(selectedClassId.value),
      count: Number(count.value),
    });
    picked.value = res;
  } catch (e) {
    error.value = e?.message || String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(loadClasses);
</script>

<template>
  <div>
    <h2>Namen ziehen</h2>

    <div class="row">
      <label>
        Klasse
        <select v-model="selectedClassId">
          <option v-for="c in classes" :key="c.id" :value="String(c.id)">
            {{ c.name }}
          </option>
        </select>
      </label>

      <label>
        Anzahl
        <input type="number" min="1" v-model.number="count" />
      </label>

      <button @click="pick" :disabled="loading || !selectedClassId">
        {{ loading ? "Picken..." : "Picken" }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="picked.length">
      <h3>Gezogen aus: {{ selectedClass?.name }}</h3>
      <ul>
        <li v-for="s in picked" :key="s.id">{{ s.name }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.row { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; margin: 12px 0; }
label { display: grid; gap: 6px; }
select, input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  min-width: 200px;
  background-color: #fff;
  color: #111;
}
select:focus, input:focus { outline: none; border-color: #111; }
button { padding: 10px 12px; border-radius: 10px; border: 1px solid #111; background: #111; color: #fff; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: #b00020; }
</style>
