<template>
   <div class="flashcard-edit-container">
      <div class="edit-header">
         <button @click="goBack" class="btn-back">← Back</button>
         <h1>{{ set ? set.name : 'Loading...' }}</h1>
         <div class="header-actions">
            <button @click="saveSet" class="btn-save">Save</button>
         </div>
      </div>

      <div v-if="set" class="edit-content">
         <div class="set-info">
            <div class="form-group">
               <label>Set Name</label>
               <input v-model="set.name" type="text" class="input-field" />
            </div>
            <div class="form-group">
               <label>Description</label>
               <textarea v-model="set.description" class="textarea-field"></textarea>
            </div>
         </div>

         <div class="cards-section">
            <div class="section-header">
               <h2>Flashcards ({{ set.cards.length }})</h2>
               <button @click="openAddCardModal" class="btn-add-card">+ Add Card</button>
            </div>

            <div v-if="set.cards.length === 0" class="no-cards">
               <p>No cards yet. Click "Add Card" to get started.</p>
            </div>

            <div v-else class="cards-list">
               <div v-for="(card, index) in set.cards" :key="card.id" class="card-item">
                  <div class="card-item-header">
                     <span class="card-number">{{ index + 1 }}</span>
                     <span class="card-category">{{ card.category }}</span>
                     <button @click="deleteCard_action(card.id)" class="btn-delete">Delete</button>
                  </div>
                  <div class="card-content">
                     <div class="card-field">
                        <label>Question</label>
                        <textarea v-model="card.question" class="textarea-field card-input"
                           @change="updateSetTimestamp"></textarea>
                     </div>
                     <div class="card-field">
                        <label>Answer</label>
                        <textarea v-model="card.answer" class="textarea-field card-input"
                           @change="updateSetTimestamp"></textarea>
                     </div>
                     <div class="card-field">
                        <label>Category</label>
                        <input v-model="card.category" type="text" class="input-field" @change="updateSetTimestamp" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- Add Card Modal -->
      <div v-if="showAddCardModal" class="modal-overlay" @click.self="closeAddCardModal">
         <div class="modal">
            <div class="modal-header">
               <h2>Add New Flashcard</h2>
               <button @click="closeAddCardModal" class="close-btn">×</button>
            </div>
            <div class="modal-body">
               <div class="form-group">
                  <label>Question</label>
                  <textarea v-model="newCard.question" placeholder="Enter question"></textarea>
               </div>
               <div class="form-group">
                  <label>Answer</label>
                  <textarea v-model="newCard.answer" placeholder="Enter answer"></textarea>
               </div>
               <div class="form-group">
                  <label>Category</label>
                  <input v-model="newCard.category" type="text" placeholder="Enter category" />
               </div>
            </div>
            <div class="modal-footer">
               <button @click="closeAddCardModal" class="btn-cancel">Cancel</button>
               <button @click="addNewCard" class="btn-confirm">Add Card</button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getFlashcardSetById, addCardToSet, deleteCard } from '../utils/flashcardStore'
import type { FlashcardSet } from '../utils/flashcardStore'

const router = useRouter()
const route = useRoute()

const set = ref<FlashcardSet | null>(null)
const showAddCardModal = ref(false)
const newCard = ref({
   question: '',
   answer: '',
   category: '',
})

onMounted(() => {
   const setId = route.params.setId as string
   set.value = getFlashcardSetById(setId) || null
})

const openAddCardModal = () => {
   newCard.value = { question: '', answer: '', category: '' }
   showAddCardModal.value = true
}

const closeAddCardModal = () => {
   showAddCardModal.value = false
}

const addNewCard = () => {
   if (!set.value) return
   if (!newCard.value.question.trim() || !newCard.value.answer.trim()) {
      alert('Please fill in both question and answer')
      return
   }
   addCardToSet(
      set.value.id,
      newCard.value.question,
      newCard.value.answer,
      newCard.value.category
   )
   closeAddCardModal()
}

const deleteCard_action = (cardId: string) => {
   if (!set.value) return
   if (confirm('Delete this card?')) {
      deleteCard(set.value.id, cardId)
   }
}

const updateSetTimestamp = () => {
   if (set.value) {
      set.value.updatedAt = new Date()
   }
}

const saveSet = () => {
   alert('Changes saved!')
   goBack()
}

const goBack = () => {
   router.push({ name: 'flashcard-list' })
}
</script>

<style scoped>
.flashcard-edit-container {
   padding: 2rem;
   max-width: 1000px;
   margin: 0 auto;
   background: #f8f9fa;
   min-height: 100vh;
}

.edit-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 2rem;
   background: white;
   padding: 1.5rem;
   border-radius: 0.75rem;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-header h1 {
   font-size: 1.8rem;
   margin: 0;
   flex: 1;
   text-align: center;
}

.btn-back {
   background: #f0f0f0;
   border: none;
   padding: 0.75rem 1rem;
   border-radius: 0.5rem;
   cursor: pointer;
   font-size: 1rem;
   transition: all 0.2s;
}

.btn-back:hover {
   background: #e0e0e0;
}

.header-actions {
   display: flex;
   gap: 1rem;
}

.btn-save {
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   color: white;
   border: none;
   padding: 0.75rem 1.5rem;
   border-radius: 0.5rem;
   cursor: pointer;
   font-size: 1rem;
   transition: all 0.2s;
}

.btn-save:hover {
   opacity: 0.9;
}

.edit-content {
   display: flex;
   flex-direction: column;
   gap: 2rem;
}

.set-info {
   background: white;
   padding: 2rem;
   border-radius: 0.75rem;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
   margin-bottom: 1.5rem;
}

.form-group:last-child {
   margin-bottom: 0;
}

.form-group label {
   display: block;
   margin-bottom: 0.5rem;
   font-weight: 600;
   color: #333;
}

.input-field,
.textarea-field {
   width: 100%;
   padding: 0.75rem;
   border: 1px solid #ddd;
   border-radius: 0.5rem;
   font-size: 1rem;
   font-family: inherit;
}

.textarea-field {
   resize: vertical;
   min-height: 100px;
}

.input-field:focus,
.textarea-field:focus {
   outline: none;
   border-color: #667eea;
   box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.cards-section {
   background: white;
   padding: 2rem;
   border-radius: 0.75rem;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 2rem;
}

.section-header h2 {
   margin: 0;
   font-size: 1.3rem;
   color: #333;
}

.btn-add-card {
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   color: white;
   border: none;
   padding: 0.75rem 1.5rem;
   border-radius: 0.5rem;
   cursor: pointer;
   font-size: 1rem;
   transition: all 0.2s;
}

.btn-add-card:hover {
   opacity: 0.9;
}

.no-cards {
   text-align: center;
   padding: 2rem;
   color: #999;
   font-style: italic;
}

.cards-list {
   display: flex;
   flex-direction: column;
   gap: 1.5rem;
}

.card-item {
   border: 1px solid #ddd;
   border-radius: 0.5rem;
   padding: 1.5rem;
   background: #fafafa;
}

.card-item-header {
   display: flex;
   align-items: center;
   gap: 1rem;
   margin-bottom: 1rem;
   padding-bottom: 1rem;
   border-bottom: 1px solid #eee;
}

.card-number {
   display: flex;
   align-items: center;
   justify-content: center;
   width: 30px;
   height: 30px;
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   color: white;
   border-radius: 50%;
   font-weight: bold;
   font-size: 0.9rem;
}

.card-category {
   background: #e8eaf6;
   color: #667eea;
   padding: 0.25rem 0.75rem;
   border-radius: 1rem;
   font-size: 0.85rem;
   font-weight: 600;
}

.btn-delete {
   margin-left: auto;
   background: #ff6b6b;
   color: white;
   border: none;
   padding: 0.5rem 1rem;
   border-radius: 0.5rem;
   cursor: pointer;
   font-size: 0.9rem;
   transition: all 0.2s;
}

.btn-delete:hover {
   background: #ff5252;
}

.card-content {
   display: flex;
   flex-direction: column;
   gap: 1rem;
}

.card-field {
   display: flex;
   flex-direction: column;
}

.card-field label {
   font-weight: 600;
   color: #666;
   margin-bottom: 0.5rem;
   font-size: 0.95rem;
}

.card-input {
   padding: 0.75rem;
   border: 1px solid #ddd;
   border-radius: 0.5rem;
   font-size: 1rem;
   font-family: inherit;
}

.card-input:focus {
   outline: none;
   border-color: #667eea;
   box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

.modal-footer {
   padding: 1.5rem;
   border-top: 1px solid #eee;
   display: flex;
   gap: 1rem;
   justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
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

.btn-confirm {
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   color: white;
}

.btn-confirm:hover {
   opacity: 0.9;
}
</style>
