const element = document.querySelector('#yourElementId');

element.animate([
  { transform: 'translate(0, 0)' },
  { transform: 'translate(400px, 0)' },
  { transform: 'translate(400px, -100px)' },
  { transform: 'translate(500px, -100px)' },
  { transform: 'translate(500px, 0)' }
], {
  duration: 2000, // Animation duration in milliseconds
  iterations: 1, // Number of times the animation should repeat
  fill: 'forwards' // The element will retain the style values from the last keyframe when the animation ends
});