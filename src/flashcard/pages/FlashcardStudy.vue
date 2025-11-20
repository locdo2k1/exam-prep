<template>
  <div class="flashcard-study-container">
    <div v-if="!set" class="loading">
      <p>Flashcard set not found</p>
      <button @click="goBack" class="btn-back">Back</button>
    </div>

    <div v-else class="study-wrapper">
      <!-- Header -->
      <div class="study-header">
        <button @click="goBack" class="btn-back-arrow">← Back</button>
        <h1>{{ set.name }}</h1>
        <div class="progress-info">
          <span>{{ currentIndex + 1 }} / {{ set.cards.length }}</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Flashcard -->
      <div class="study-content">
        <div v-if="set.cards.length > 0" class="card-container">
          <div
            class="flashcard"
            :class="{ flipped: currentCard?.isFlipped }"
            @click="toggleFlip"
          >
            <div class="card-inner">
              <div class="card-front">
                <div class="card-label">Question</div>
                <p class="card-text">{{ currentCard?.question }}</p>
              </div>
              <div class="card-back">
                <div class="card-label">Answer</div>
                <p class="card-text">{{ currentCard?.answer }}</p>
              </div>
            </div>
          </div>

          <p class="flip-hint">Click card to flip</p>

          <!-- Card Actions -->
          <div class="card-actions">
            <button
              @click="markMastered"
              :class="{ active: currentCard?.mastered }"
              class="btn-action btn-mastered"
            >
              ⭐ {{ currentCard?.mastered ? 'Mastered' : 'Mark as Mastered' }}
            </button>
          </div>

          <!-- Navigation -->
          <div class="navigation">
            <button
              @click="previousCard"
              :disabled="currentIndex === 0"
              class="btn-nav"
            >
              ← Previous
            </button>
            <button
              @click="nextCard"
              :disabled="currentIndex === set.cards.length - 1"
              class="btn-nav"
            >
              Next →
            </button>
          </div>

          <!-- Study Stats -->
          <div class="study-stats">
            <div class="stat">
              <span class="stat-label">Mastered:</span>
              <span class="stat-value">{{ masteredCount }} / {{ set.cards.length }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Remaining:</span>
              <span class="stat-value">{{ set.cards.length - masteredCount }}</span>
            </div>
          </div>
        </div>

        <div v-else class="no-cards">
          <p>No flashcards in this set yet</p>
          <button @click="navigateToEdit" class="btn-edit-set">Add Cards</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getFlashcardSetById, toggleCardFlipped, toggleCardMastered } from '../utils/flashcardStore'
import type { FlashcardSet } from '../utils/flashcardStore'

const router = useRouter()
const route = useRoute()

const set = ref<FlashcardSet | null>(null)
const currentIndex = ref(0)

onMounted(() => {
  const setId = route.params.setId as string
  set.value = getFlashcardSetById(setId) || null
})

const currentCard = computed(() => {
  if (!set.value || set.value.cards.length === 0) {
    return null
  }
  return set.value.cards[currentIndex.value]
})

const masteredCount = computed(() => {
  if (!set.value) return 0
  return set.value.cards.filter(card => card.mastered).length
})

const progressPercent = computed(() => {
  if (!set.value || set.value.cards.length === 0) return 0
  return ((currentIndex.value + 1) / set.value.cards.length) * 100
})

const toggleFlip = () => {
  if (!set.value || !currentCard.value) return
  toggleCardFlipped(set.value.id, currentCard.value.id)
}

const markMastered = () => {
  if (!set.value || !currentCard.value) return
  toggleCardMastered(set.value.id, currentCard.value.id)
}

const nextCard = () => {
  if (!set.value) return
  if (currentIndex.value < set.value.cards.length - 1) {
    currentIndex.value++
    if (currentCard.value) {
      currentCard.value.isFlipped = false
    }
  }
}

const previousCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    if (currentCard.value) {
      currentCard.value.isFlipped = false
    }
  }
}

const goBack = () => {
  router.push({ name: 'flashcard-list' })
}

const navigateToEdit = () => {
  if (!set.value) return
  router.push({ name: 'flashcard-edit', params: { setId: set.value.id } })
}
</script>

<style scoped>
.flashcard-study-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: white;
}

.study-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.study-header {
  margin-bottom: 2rem;
}

.btn-back-arrow {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.btn-back-arrow:hover {
  background: rgba(255, 255, 255, 0.3);
}

.study-header h1 {
  color: white;
  font-size: 2rem;
  margin: 0.5rem 0 1rem 0;
}

.progress-info {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  transition: width 0.3s ease;
}

.study-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-container {
  width: 100%;
}

/* Flashcard 3D Flip Animation */
.flashcard {
  width: 100%;
  height: 400px;
  margin: 2rem 0;
  cursor: pointer;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flashcard.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}

.card-front {
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.card-back {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: rotateY(180deg);
}

.card-label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.7;
  margin-bottom: 1rem;
}

.card-text {
  font-size: 1.5rem;
  line-height: 1.6;
  margin: 0;
}

.flip-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-top: -1rem;
  margin-bottom: 1.5rem;
}

.card-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-action {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-action:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
}

.btn-action.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
}

.btn-mastered {
  min-width: 180px;
}

.navigation {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.btn-nav {
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-nav:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.btn-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.study-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 0.5rem;
  color: white;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.no-cards {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  color: white;
}

.btn-edit-set {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: all 0.2s;
}

.btn-edit-set:hover {
  transform: translateY(-2px);
}

.btn-back {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
