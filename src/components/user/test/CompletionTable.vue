<template>
    <div class="mb-8">
      <div class="mb-4">
        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mr-2">15</span>
        <p class="inline font-medium">{{ tableData.instruction }}</p>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-50">
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Activity</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Day(s)</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Duration</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Contact person</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData.rows" :key="index">
              <td class="border border-gray-300 px-4 py-3">
                <div v-if="row.activity.match(/^\d+$/)" class="flex items-center gap-2">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    {{ row.activity }}
                  </span>
                  <input
                    type="text"
                    :id="`question-${row.activity}`"
                    :value="answers[row.activity] || ''"
                    @input="$emit('answer-change', parseInt(row.activity), $event.target.value)"
                    class="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your answer..."
                  />
                </div>
                <div v-else-if="row.activity.includes('19')" class="flex items-center gap-2">
                  <input
                    type="text"
                    :id="`question-19`"
                    :value="answers[19] || ''"
                    @input="$emit('answer-change', 19, $event.target.value)"
                    class="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Answer"
                  />
                  <span>Weekends</span>
                </div>
                <div v-else>{{ row.activity }}</div>
              </td>
              
              <td class="border border-gray-300 px-4 py-3">{{ row.days }}</td>
              
              <td class="border border-gray-300 px-4 py-3">
                <div v-if="row.duration.match(/^\d+$/)" class="flex items-center gap-2">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    {{ row.duration }}
                  </span>
                  <input
                    type="text"
                    :id="`question-${row.duration}`"
                    :value="answers[parseInt(row.duration)] || ''"
                    @input="$emit('answer-change', parseInt(row.duration), $event.target.value)"
                    class="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your answer..."
                  />
                </div>
                <div v-else>{{ row.duration }}</div>
              </td>
              
              <td class="border border-gray-300 px-4 py-3">
                <div v-if="row.contactPerson.match(/^\d+$/)" class="flex items-center gap-2">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    {{ row.contactPerson }}
                  </span>
                  <input
                    type="text"
                    :id="`question-${row.contactPerson}`"
                    :value="answers[parseInt(row.contactPerson)] || ''"
                    @input="$emit('answer-change', parseInt(row.contactPerson), $event.target.value)"
                    class="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your answer..."
                  />
                </div>
                <div v-else>{{ row.contactPerson }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CompletionTable',
    props: {
      tableData: Object,
      answers: Object
    },
    emits: ['answer-change']
  }
  </script>