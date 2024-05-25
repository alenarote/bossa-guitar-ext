const CHORD_CHART_WIDTH = 60;
const CHORD_CHART_HEIGHT = 80;

// The first set of chord elements loaded are replaced after 
// a few seconds. Doesn't seem worth it to figure out why, so
// just waiting a few seconds
setTimeout(() => {showChords();}, 5000);


function showChords() {
  let lines = document.getElementsByTagName('pre');
  for (line of lines) {
    line.style.marginTop = CHORD_CHART_HEIGHT + 'px';
  }

  let chordNames = document.getElementsByClassName('chord');
  for (let i = 0; i < chordNames.length; i++) {
   
    if (i > 0 && chordChartsWillOverlap(chordNames[i], chordNames[i - 1])) {
      chordNames[i - 1].style.paddingRight = (CHORD_CHART_WIDTH / 2) + 'px';  
    }

    var event = new MouseEvent('mouseover', {
      'bubbles': true
    });
    chordNames[i].dispatchEvent(event);
  }
}

// Approximate, based on boundaries of chord name elements
function chordChartsWillOverlap(chordName, prevChordName) {
  if (!chordsOnSameRow(chordName, prevChordName)) {
    return false;
  }
  if (chordName.getBoundingClientRect().left - prevChordName.getBoundingClientRect().right < CHORD_CHART_WIDTH / 2) {
    return true;
  }
}  

// Although checking y-coords with a bit of tolerance is slightly
// messy, I prefer this to checking for HTML structure (i.e. same
// parent), which could change.
function chordsOnSameRow(elementA, elementB) {
  if (Math.abs(elementA.getBoundingClientRect().bottom - elementB.getBoundingClientRect().bottom) < 5) {
    return true;
  } 
}
  

