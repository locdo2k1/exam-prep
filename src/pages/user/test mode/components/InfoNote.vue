<template>
  <div class="bg-red-50 border border-red-200 rounded p-3 mb-6">
    <p class="text-sm text-red-600">
      <slot>
        <strong>Chú ý:</strong> đề được quy đổi sang scaled score (và dy trên thang điểm
      9.0 cho TOEIC hoặc 9.0 cho IELTS), vui lòng chọn chế độ làm FULL TEST
      </slot>
    </p>
  </div>
</template>

<script setup lang="ts">
// This component displays an important note to the user
// It uses a red background to indicate importance
</script>
