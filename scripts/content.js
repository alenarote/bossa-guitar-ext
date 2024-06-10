const CHORD_CHART_WIDTH = 65;
const CHORD_CHART_HEIGHT = 85;
const CHECK_CHORD_READY_INTERVAL = 500;
const RESIZE_DEBOUNCE_INTERVAL = 100;
const CHECK_LINES_ALIGNED_INTERVAL = 1000;

// The first set of chord name elements are replaced after a few seconds, 
// so we have to wait for the correct elements to be loaded.
chordNamesReadyInterval = setInterval(showChordsIfReady, CHECK_CHORD_READY_INTERVAL);

function showChordsIfReady() {
  const chordNames = document.getElementsByClassName('chord');
  // Only the second/persistent set of chord elements have styling 
  if (chordNames.length > 0 && chordNames[0].style.color) {
    showChords();
    clearInterval(chordNamesReadyInterval);
  }
}

function showChords() {
  const lines = document.getElementsByTagName('pre');
  for (line of lines) {
    line.style.marginTop = CHORD_CHART_HEIGHT + 'px';
  }

  const chordNames = document.getElementsByClassName('chord');
  for (let i = 0; i < chordNames.length; i++) {

    if (i > 0 && chordChartsWillOverlap(chordNames[i], chordNames[
        i - 1])) {
      chordNames[i - 1].style.paddingRight = (
        CHORD_CHART_WIDTH / 2) + 'px';
    }

    const event = new MouseEvent('mouseover');
    // Trigger the chord chart which is usually only displayed on mouseover
    chordNames[i].dispatchEvent(event);
  }
}

// Sometimes the line elements are refreshed and the chords get
// out of alignment
setInterval(checkLinesAligned, CHECK_LINES_ALIGNED_INTERVAL);

function checkLinesAligned() {
  const lines = document.getElementsByTagName('pre');
  for (line of lines) {
    if (line.style.marginTop < CHORD_CHART_HEIGHT) {
      replaceChords();
    }
  }
}

window.addEventListener('resize', debounce(replaceChords, RESIZE_DEBOUNCE_INTERVAL));

window.navigation.addEventListener('navigate', (event) => {
  clearChords();
  chordNamesReadyInterval = setInterval(showChordsIfReady, CHECK_CHORD_READY_INTERVAL);
})

function replaceChords() {
  clearChords();
  showChords();
}

function clearChords() {
  const chordShapes = document.getElementsByClassName('chordshape');
  while (chordShapes.length > 0) {
    chordShapes[0].remove();
  }
}

// Approximate, based on boundaries of chord name elements
function chordChartsWillOverlap(chordName, prevChordName) {
  if (!chordsOnSameRow(chordName, prevChordName)) {
    return false;
  }
  if (chordName.getBoundingClientRect().left - prevChordName
    .getBoundingClientRect().right < CHORD_CHART_WIDTH / 2) {
    return true;
  }
}

// Although checking y-coords with a bit of tolerance is slightly messy, 
// I prefer this to checking for HTML structure (i.e. same parent), which 
// could change.
function chordsOnSameRow(elementA, elementB) {
  if (Math.abs(elementA.getBoundingClientRect().bottom - elementB
      .getBoundingClientRect().bottom) < 5) {
    return true;
  }
}

// https://stackoverflow.com/a/52256801/5212698
function debounce(func, time) {
  var timer;
  return function(event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, time, event);
  };
}
