<template>
  <div class="flashcard-list-container">
    <div class="header">
      <h1>My Flashcard Sets</h1>
      <button @click="openCreateModal" class="btn-create">
        <span class="icon">+</span> Create New Set
      </button>
    </div>

    <div v-if="flashcardSets.length === 0" class="no-data">
      <p>No flashcard sets yet. Create one to get started!</p>
    </div>

    <div v-else class="sets-grid">
      <div v-for="set in flashcardSets" :key="set.id" class="set-card">
        <div class="set-header">
          <h3>{{ set.name }}</h3>
          <button class="btn-options" @click="deleteSet(set.id)">×</button>
        </div>
        <p class="description">{{ set.description }}</p>
        <div class="set-stats">
          <span class="card-count">{{ set.cards.length }} cards</span>
          <span v-if="set.cards.length > 0" class="mastered-count">
            {{ getmasteredCount(set.id) }} mastered
          </span>
        </div>
        <div class="set-actions">
          <button @click="navigateToStudy(set.id)" class="btn-study">
            Study Now
          </button>
          <button @click="navigateToEdit(set.id)" class="btn-edit">
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Create Set Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Create New Flashcard Set</h2>
          <button @click="closeCreateModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Set Name</label>
            <input v-model="newSetName" type="text" placeholder="Enter set name" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newSetDescription" placeholder="Enter description"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeCreateModal" class="btn-cancel">Cancel</button>
          <button @click="createNewSet" class="btn-create-confirm">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getAllFlashcardSets,
  createFlashcardSet,
  deleteFlashcardSet,
  getFlashcardSetById,
} from '../utils/flashcardStore'

const router = useRouter()

const flashcardSets = computed(() => getAllFlashcardSets.value)
const showCreateModal = ref(false)
const newSetName = ref('')
const newSetDescription = ref('')

const openCreateModal = () => {
  newSetName.value = ''
  newSetDescription.value = ''
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const createNewSet = () => {
  if (newSetName.value.trim() === '') {
    alert('Please enter a set name')
    return
  }
  createFlashcardSet(newSetName.value, newSetDescription.value)
  closeCreateModal()
}

const deleteSet = (setId: string) => {
  if (confirm('Are you sure you want to delete this set?')) {
    deleteFlashcardSet(setId)
  }
}

const getmasteredCount = (setId: string) => {
  const set = getFlashcardSetById(setId)
  if (!set) return 0
  return set.cards.filter(card => card.mastered).length
}

const navigateToStudy = (setId: string) => {
  router.push({ name: 'flashcard-study', params: { setId } })
}

const navigateToEdit = (setId: string) => {
  router.push({ name: 'flashcard-edit', params: { setId } })
}
</script>

<style scoped>
.flashcard-list-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.btn-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s;
}

.btn-create:hover {
  transform: translateY(-2px);
}

.btn-create .icon {
  font-size: 1.2rem;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.1rem;
}

.sets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.set-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.set-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.set-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.set-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.btn-options {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.btn-options:hover {
  color: #ff6b6b;
}

.description {
  color: #666;
  font-size: 0.95rem;
  margin: 0.5rem 0 1rem 0;
  line-height: 1.4;
}

.set-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #777;
}

.card-count,
.mastered-count {
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 1rem;
}

.set-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.btn-study,
.btn-edit {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-study {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-study:hover {
  opacity: 0.9;
}

.btn-edit {
  background: #f0f0f0;
  color: #333;
}

.btn-edit:hover {
  background: #e0e0e0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-create-confirm {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-create-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-create-confirm:hover {
  opacity: 0.9;
}
</style>
