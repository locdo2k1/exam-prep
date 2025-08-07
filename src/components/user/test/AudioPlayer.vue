

<script>
export default {
  name: 'AudioPlayer',
  props: {
    recordings: Array,
    currentRecording: Number
  },
  emits: ['recording-change'],
  methods: {
    getCurrentRecording() {
      return this.recordings.find(r => r.id === this.currentRecording)
    }
  }
}
</script>
    