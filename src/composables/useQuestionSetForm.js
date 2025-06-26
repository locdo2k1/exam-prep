import { ref } from 'vue';
import { questionSetApi } from '@/api/questionSet';

export function useQuestionSetForm() {
  const formData = ref({
    title: '',
    description: '',
    questionIds: [],
    audioFiles: [],
    order: 0
  });

  const isLoading = ref(false);
  const error = ref(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    formData.value.audioFiles = [...formData.value.audioFiles, ...files];
  };

  const removeFile = (index) => {
    formData.value.audioFiles.splice(index, 1);
  };

  const submitForm = async () => {
    if (!formData.value.title) {
      error.value = 'Title is required';
      return null;
    }

    if (formData.value.questionIds.length === 0) {
      error.value = 'At least one question is required';
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await questionSetApi.create({
        ...formData.value,
        order: parseInt(formData.value.order) || 0,
      });
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create question set';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetForm = () => {
    formData.value = {
      title: '',
      description: '',
      questionIds: [],
      audioFiles: [],
      order: 0
    };
    error.value = null;
  };

  return {
    formData,
    isLoading,
    error,
    handleFileUpload,
    removeFile,
    submitForm,
    resetForm
  };
}
