import { ref, computed } from "vue";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  isFlipped: boolean;
  mastered: boolean;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
}

// Store for flashcard sets (in-memory storage without database)
const flashcardSets = ref<FlashcardSet[]>([]);

// Initialize with sample data
const initializeSampleData = () => {
  flashcardSets.value = [
    {
      id: "1",
      name: "Basic English Vocabulary",
      description: "Common English words and their meanings",
      cards: [
        {
          id: "card-1",
          question: 'What does "abundant" mean?',
          answer: "Existing or available in large quantities; plentiful",
          category: "Vocabulary",
          isFlipped: false,
          mastered: false,
        } as Flashcard,
        {
          id: "card-2",
          question: 'What does "benevolent" mean?',
          answer: "Kind, generous, and doing good",
          category: "Vocabulary",
          isFlipped: false,
          mastered: false,
        } as Flashcard,
        {
          id: "card-3",
          question: 'What does "candid" mean?',
          answer: "Truthful and straightforward; frank",
          category: "Vocabulary",
          isFlipped: false,
          mastered: false,
        } as Flashcard,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Math Formulas",
      description: "Essential mathematical formulas",
      cards: [
        {
          id: "card-4",
          question: "What is the formula for the area of a circle?",
          answer: "A = πr²",
          category: "Formulas",
          isFlipped: false,
          mastered: false,
        } as Flashcard,
        {
          id: "card-5",
          question: "What is the Pythagorean theorem?",
          answer: "a² + b² = c²",
          category: "Formulas",
          isFlipped: false,
          mastered: false,
        } as Flashcard,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

// Initialize on first load
initializeSampleData();

// Getters
export const getAllFlashcardSets = computed(() => flashcardSets.value);

export const getFlashcardSetById = (id: string) => {
  return flashcardSets.value.find((set) => set.id === id);
};

// Actions
export const createFlashcardSet = (name: string, description: string) => {
  const newSet: FlashcardSet = {
    id: Date.now().toString(),
    name,
    description,
    cards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  flashcardSets.value.push(newSet);
  return newSet;
};

export const addCardToSet = (setId: string, question: string, answer: string, category: string) => {
  const set = getFlashcardSetById(setId);
  if (!set) return null;

  const newCard: Flashcard = {
    id: `card-${Date.now()}`,
    question,
    answer,
    category,
    isFlipped: false,
    mastered: false,
  };
  set.cards.push(newCard);
  set.updatedAt = new Date();
  return newCard;
};

export const updateCard = (setId: string, cardId: string, question: string, answer: string, category: string) => {
  const set = getFlashcardSetById(setId);
  if (!set) return null;

  const card = set.cards.find((c) => c.id === cardId);
  if (!card) return null;

  card.question = question;
  card.answer = answer;
  card.category = category;
  set.updatedAt = new Date();
  return card;
};

export const deleteCard = (setId: string, cardId: string) => {
  const set = getFlashcardSetById(setId);
  if (!set) return false;

  const index = set.cards.findIndex((c) => c.id === cardId);
  if (index === -1) return false;

  set.cards.splice(index, 1);
  set.updatedAt = new Date();
  return true;
};

export const deleteFlashcardSet = (setId: string) => {
  const index = flashcardSets.value.findIndex((set) => set.id === setId);
  if (index === -1) return false;

  flashcardSets.value.splice(index, 1);
  return true;
};

export const toggleCardMastered = (setId: string, cardId: string) => {
  const set = getFlashcardSetById(setId);
  if (!set) return null;

  const card = set.cards.find((c) => c.id === cardId);
  if (!card) return null;

  card.mastered = !card.mastered;
  set.updatedAt = new Date();
  return card;
};

export const toggleCardFlipped = (setId: string, cardId: string) => {
  const set = getFlashcardSetById(setId);
  if (!set) return null;

  const card = set.cards.find((c) => c.id === cardId);
  if (!card) return null;

  card.isFlipped = !card.isFlipped;
  return card;
};
