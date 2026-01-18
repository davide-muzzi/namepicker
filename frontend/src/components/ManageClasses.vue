<script setup>
import { onMounted, ref } from "vue";
import { apiDelete, apiGet, apiPost, apiPut } from "../api";

const classes = ref([]);
const selectedClassId = ref("");
const students = ref([]);

const newClassName = ref("");
const renameClassName = ref("");
const newStudentName = ref("");

const error = ref("");
const busy = ref(false);

async function loadClasses() {
  classes.value = await apiGet("/classes");
  if (!selectedClassId.value && classes.value.length) {
    selectedClassId.value = String(classes.value[0].id);
  }
}

async function loadStudents() {
  students.value = [];
  if (!selectedClassId.value) return;
  students.value = await apiGet(`/students/class/${selectedClassId.value}`);
}

async function createClass() {
  if (!newClassName.value.trim()) return;
  busy.value = true;
  error.value = "";
  try {
    await apiPost("/classes", { name: newClassName.value.trim() });
    newClassName.value = "";
    await loadClasses();
  } catch (e) {
    error.value = e?.message || String(e);
  } finally {
    busy.value = false;
  }
}

async function renameClass() {
  if (!selectedClassId.value || !renameClassName.value.trim()) return;
  busy.value = true;
  error.value = "";
  try {
    await apiPut(`/classes/${selectedClassId.value}`, { name: renameClassName.value.trim() });
    renameClassName.value = "";
    await loadClasses();
  } catch (e) {
    error.value = e?.message || String(e);
  } finally {
    busy.value = false;
  }
}

async function deleteClass() {
  if (!selectedClassId.value) return;
  busy.value = true;
  error.value = "";
  try {
    await apiDelete(`/classes/${selectedClassId.value}`);
    selectedClassId.value = "";
    await loadClasses();
    await loadStudents();
  } catch (e) {
    error.value = e?.message || String(e);
  } finally {
    busy.value = false;
  }
}

async function addStudent() {
  if (!selectedClassId.value || !newStudentName.value.trim()) return;
  busy.value = true;
  error.value = "";
  try {
    await apiPost("/students", {
      name: newStudentName.value.trim(),
      class_id: Number(selectedClassId.value),
    });
    newStudentName.value = "";
    await loadStudents();
  } catch (e) {
    error.value = e?.message || String(e);
  } finally {
    busy.value = false;
  }
}

async function deleteStudent(studentId) {
  busy.value = true;
  error.value = "";
  try {
    await apiDelete(`/students/${studentId}`);
    await loadStudents();
  } catch (e) {
    error.value = e?.message || String(e);
  } finally {
    busy.value = false;
  }
}

onMounted(async () => {
  await loadClasses();
  await loadStudents();
});
</script>

<template>
  <div>
    <h2>Klassen verwalten</h2>

    <p v-if="error" class="error">{{ error }}</p>

    <section class="grid">
      <div class="panel">
        <h3>Klassen</h3>

        <label>
          Auswahl
          <select v-model="selectedClassId" @change="loadStudents">
            <option value="" disabled>— Klasse wählen —</option>
            <option v-for="c in classes" :key="c.id" :value="String(c.id)">
              {{ c.name }}
            </option>
          </select>
        </label>

        <div class="row">
          <input v-model="newClassName" placeholder="Neue Klasse (z.B. 3IA)" />
          <button @click="createClass" :disabled="busy">Erstellen</button>
        </div>

        <div class="row">
          <input v-model="renameClassName" placeholder="Neuer Name für Klasse" />
          <button @click="renameClass" :disabled="busy || !selectedClassId">Umbenennen</button>
        </div>

        <button class="danger" @click="deleteClass" :disabled="busy || !selectedClassId">
          Klasse löschen
        </button>
      </div>

      <div class="panel">
        <h3>Schüler*innen</h3>

        <div class="row">
          <input v-model="newStudentName" placeholder="Name hinzufügen" />
          <button @click="addStudent" :disabled="busy || !selectedClassId">Hinzufügen</button>
        </div>

        <ul v-if="students.length">
          <li v-for="s in students" :key="s.id" class="student">
            <span>{{ s.name }}</span>
            <button class="ghost" @click="deleteStudent(s.id)" :disabled="busy">Löschen</button>
          </li>
        </ul>

        <p v-else class="muted">
          {{ selectedClassId ? "Noch keine Schüler*innen in dieser Klasse." : "Wähle zuerst eine Klasse." }}
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 800px) { .grid { grid-template-columns: 1fr; } }

.panel { border: 1px solid #eee; border-radius: 16px; padding: 14px; }
.row { display: flex; gap: 10px; margin: 12px 0; flex-wrap: wrap; }
input, select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  min-width: 240px;
  background-color: #fff;
  color: #111;
}
select:focus, input:focus { outline: none; border-color: #111; }
button { padding: 10px 12px; border-radius: 10px; border: 1px solid #111; background: #111; color: #fff; cursor: pointer; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
.danger { background: #b00020; border-color: #b00020; }
.ghost { background: transparent; color: #111; border: 1px solid #ddd; }
.student { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f2f2f2; }
.error { color: #b00020; }
.muted { opacity: 0.7; }
</style>
