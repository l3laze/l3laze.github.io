function bumpScore (what, how, event) {
  let score = parseInt(what.innerText)

  if (typeof how === 'undefined' && score === 4) {
    score = 0
  } else if (how === 'minus') {
    score--

    if(score < 0) {
      score = 4
    }
  } else {
    score++
  }

  what.innerText = score
}

function addRow () {
  const d = document.createElement('div')
  const s = document.createElement('span')
  const c = document.createElement('div')
  const i = document.createElement('div')

  d.classList.add('row')
  s.classList.add('scoreboard')
  c.classList.add('correct')
  i.classList.add('misplaced')

  c.addEventListener('click', function () {
    bumpScore(c)
  })

  i.addEventListener('click', function () {
    bumpScore(i)
  })

  c.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    bumpScore(c, 'minus')
    return false
  })

  i.addEventListener('contextmenu', function (event) {
    event.preventDefault()
    bumpScore(i, 'minus')
    return false
  })

  c.appendChild(document.createTextNode('0'))
  i.appendChild(document.createTextNode('0'))

  s.appendChild(c)
  s.appendChild(i)
  d.appendChild(s)

  const t = document.getElementById('cb_container')

  t.appendChild(document.createElement('br'))

  t.appendChild(d)
}

function removeRow () {
  const ra = Array.from(document.querySelectorAll('.row'))
  const r = ra.slice(-1)[0]

  if (ra.length > 0 && typeof r !== 'undefined') {
    r.remove()

    document.getElementById('cb_container').querySelector('br')?.remove()
  }
}

function addArrow (dir) {
  const r = Array.from(document.querySelectorAll('.row')).slice(-1)[0]
  const d = document.createElement('div')

  d.classList.add(dir)

  r.appendChild(d)
}

function display (panel) {
  const panels = ['about', 'cb_container', 'help', 'settings']

  panels.map((p) => document.getElementById(p))
    .forEach((p) => {
      if (p.id === panel) {
        p.style.display = ''
      } else {
        p.style.display = 'none'
      }
    })
}

function getRow () {
  const r = Array.from(document.querySelectorAll('.row')).slice(-1)[0]

  return r
}

function getScoreboard () {
  const s = Array.from(document.querySelectorAll('.scoreboard')).slice(-1)[0]
  const correct = s.children[0]
  const misplaced = s.children[1]

  return {
    correct,
    misplaced
  }
}

function showStatus (message, type = 'success') {
  const s = document.createElement('div')

  s.classList.add('status', type)

  s.appendChild(document.createTextNode(message))

  document.getElementById('cb_container').appendChild(s)
}

function generatePossibilities (num, alignments) {
  if (num === 1) {
    return alignments.slice(0)
  }

  const suffixes = generatePossibilities(num - 1, alignments)
  const ret = []

  alignments.forEach((a) => {
    suffixes.forEach((s) => {
      ret.push([a].concat(s))
    })
  })

    return ret
  }

function judgeGuess(answer, guess) {
 /**
  * @param answer e.g. ["red", "green", "blue", "blue"]
  * @param guess e.g. ["blue, green", "yellow", "red"]
  * return e.g. { bothCorrect: 1, colorCorrect: 2 }
  */
  const retVal = {
    correct: 0,
    misplaced: 0
  }
  const unaccountedForAnswers = []
  const unaccountedForGuesses = []

  for (let i = 0; i < answer.length; i++) {
    const a = answer[i]
    const g = guess[i]

    if (a === g) {
      retVal.correct++
    } else {
      unaccountedForAnswers.push(answer[i])
      unaccountedForGuesses.push(guess[i])
    }
  }

  unaccountedForAnswers.forEach((a) => {
    const guessIndex = unaccountedForGuesses.indexOf(a)

    if (guessIndex !== -1) {
      retVal.misplaced++
      unaccountedForGuesses.splice(guessIndex, 1)
    }
  })

  return retVal
}

function guessContradictsSomeEvidence (guess, evidences) {
  for (let key in evidences) {
    let evidence = evidences[key]
    /*
     * Treat the guess like an answer and the evidence as a guess, and
     * see whether the judgment is the same.
     */

    let judgement = judgeGuess(guess, evidence.guess)

    if ((judgement.correct !== evidence.correct) || (judgement.misplaced !== evidence.misplaced)) {
      //console.log("guess", guess, "contradicts evidence", evidence.guess);

      return true
    }
  }

  return false
}

function quickRemoveFromArray (index, array) {
 /**
  * Removes and returns the element at the provided index from an array.
  * This function may shuffle/reorder the elements of the array for
  * efficiency reasons. For example, if you request to remove the first
  * element of the array, rather than reindexing every element in the
  * array (O(N)), this function may choose to swap the first and last
  * element of the array, and then remove the last element from the
  * array (O(1)).
  */
  const arrayLength = array.length

  if (index >= arrayLength || index < 0) {
    throw new Error("Tried to access index " + index + " from array of length " + arrayLength)
  }

  if (arrayLength === 1) {
    return array.pop()
  }

  const retVal = array[index]
  const lastElement = array.pop()
  array[index] = lastElement

  return retVal
}

function generateGuess (evidence) {
 /**
  * Returns an array e.g. ["red", "green", "blue"] or null to indicate
  * that there are no possible guesses left. It randomly selects one of
  * the guesses from the provided `gameState` parameter, and removes
  * that guess from the list of possible guesses. This function may also
  * "shuffle" or reorder the elements in the possible guesses list for
  * efficiency reasons.
  */

  let guessIndex = Math.floor(Math.random() * possibilities.length)
  let guess = quickRemoveFromArray(guessIndex, possibilities)

  while (guessContradictsSomeEvidence(guess, evidence)) {
    if (possibilities.length < 1) {
      return null
    }

    guessIndex = Math.floor(Math.random() * possibilities.length)

    guess = quickRemoveFromArray(guessIndex, possibilities)
  }

  if (typeof guess !== 'object' || guess.constructor.name !== 'Array') {
    throw new Error("Expected guess to be an array, but it was a(n) " + (typeof guess))
  }

  return guess
}

function addGuess (guess, correct, misplaced) {
  const shortToLong = {
    u: 'up',
    d: 'down',
    l: 'left',
    r: 'right'
  }

  const keys = Object.keys(shortToLong)

  guess.forEach((alignment) => {
    if (keys.indexOf(alignment) < 0) {
      throw new Error('Expected one of up, down, left, or right, but found ' + alignment)
    }

    addArrow(shortToLong[alignment])
  })

  const row = getRow()
  row.dataset.evidence = JSON.stringify({
    guess
  })
}

function nextGuess () {
  const evidence = []

  document.getElementById('cb_container').style.display = ''
  document.getElementById('about').style.display = 'none'
  document.getElementById('help').style.display = 'none'
  document.getElementById('settings').style.display = 'none'

  Array.from(document.getElementsByClassName('status'))
    .forEach((s) => s.remove())

  const lastRow = getRow()

  if (typeof lastRow !== 'undefined' && lastRow.style.display !== 'none') {
    const sb = getScoreboard()
    const correct = parseInt(sb.correct.innerText)
    const misplaced = parseInt(sb.misplaced.innerText)

    if (correct + misplaced > 4) {
      showStatus('The sum of Correct and Misplaced must be less than 4.', 'warning')

      return
    }

    if (correct === 4) {
      showStatus('Success! Try again.', 'success')

      document.getElementById('next').style.display = 'none'

      return
    }

    const e = JSON.parse(getRow().dataset.evidence)

    e['correct'] = correct
    e['misplaced'] = misplaced

    getRow().dataset.evidence = JSON.stringify(e)
  }

  const rows = Array.from(document.getElementById('cb_container').querySelectorAll('.row'))
  
  for(r of rows) {
    if (typeof r.dataset.evidence !== 'undefined') {
      evidence.push(JSON.parse(r.dataset.evidence))
    }
  }

  const next = generateGuess(evidence)

  if (next === null) {
    document.getElementById('next').style.display = 'none'

    showStatus('Ran out of possibilities to guess. There may be a mistake in the data you entered.', 'failure')
  } else {
    addRow()

    const row = getRow()

    row.dataset.guess = next
    row.style.display = 'inline-block'

    addGuess(next)
  }
}

function initAutomation () {
  const rows = Array.from(document.querySelectorAll('.row'))
  const cb = document.getElementById('cb_container')

  cb.style.display = ''
  document.getElementById('about').style.display = 'none'
  document.getElementById('help').style.display = 'none'
  document.getElementById('settings').style.display = 'none'

  // Not great, but better than previous garbage. Lol.
  cb.innerHTML = ''
  
  document.getElementById('next').style.display = ''

  possibilities = generatePossibilities(4, ['u', 'd', 'l', 'r'])

  nextGuess()
}

let possibilities = []

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function initCBAI () {
  document.getElementById('auto').addEventListener('click', function () {
    initAutomation()
  })

  document.getElementById('next').addEventListener('click', function () {
    nextGuess()
  })
}

async function selfTest () {
  /*
   * Test framework
   */
  const tests = {
    passed: 0,
    failed: 0,
    total: 0,
    message: ''
  }

  const check = '\u2714'
  const cross = '\u274C'

  const test = async function (label, func) {
    if (typeof func === 'undefined') {
      tests.message += '\n  ' + label + '\n'
    } else {
      tests.total++

      if (await func()) {
        tests.passed++
        tests.message += '    ' + check + ' ' + label + '\n'
      } else {
        tests.failed++
        tests.message += '    ' + cross + ' ' + label + '\n'
      }
    }
  }

  /*
   * Tests
   */
  
  const clickEvent = new MouseEvent('click')
  const shiftClickEvent = new MouseEvent('click', {'shiftKey': true})

  test('User Interface')

  const settings = document.getElementById('settings')

  test('Shows settings', function showSettings () {
    display('settings')

    return settings.style.display !== 'none'
  })

  /*
  const dark = document.getElementById('dark')
  const light = document.getElementById('light')

  await test('Changes theme', async function changesTheme () {
    return true
  })
  */

  const help = document.getElementById('help')

  test('Shows help', function showHelp () {
    display('help')

    return help.style.display !== 'none'
  })

  const about = document.getElementById('about')

  test('Shows about', function showAbout () {
    display('about')

    return about.style.display !== 'none'
  })

  const auto = document.getElementById('auto')

  test('Resets board and makes a first guess', function initTest () {
    initAutomation()

    return typeof JSON.parse(Array.from(
      document.querySelectorAll('.row')).slice(-1)[0].dataset.evidence
    ).correct === 'undefined'
  })

  let row = Array.from(document.querySelectorAll('.row')).slice(-1)[0]
  let score = Array.from(row.querySelectorAll('.score')).slice(-1)[0]

  test('Increases score on click', function incScores () {
    for (let i = 0; i < 4; i ++) {
      score.children[0].dispatchEvent(clickEvent)
      score.children[1].dispatchEvent(clickEvent)
    }

    return parseInt(score.children[0].innerText) === 4
  })

  test('Score wraps from 4 to 0', function loopsAroundMax () {
    score.children[0].dispatchEvent(clickEvent)

    return parseInt(score.children[0].innerText) === 0
  })

  test('Decreases score on shift-click', function decScores () {
    for (let j = 0; j < 4; j ++) {
      score.children[1].dispatchEvent(shiftClickEvent)
    }

    return parseInt(score.children[1].innerText) === 0
  })

  test('Score wraps from 0 to 4', function loopsAroundMin () {
    score.children[1].dispatchEvent(shiftClickEvent)

    return parseInt(score.children[1].innerText) === 4
  })

  const next = document.getElementById('next')

  await test('Hides next after success', async function hidesNextOnSuccess () {
    score.children[0].dispatchEvent(shiftClickEvent)
    score.children[1].dispatchEvent(clickEvent)
    next.dispatchEvent(clickEvent)

    return next.style.display === 'none'
  })

  const res = document.getElementById('testResults')

  res.value = tests.message + '\n  ' + ((tests.passed / tests.total * 100) + '').substring(0, 5) +
  '% of tests passed (' + tests.passed + '/' + tests.total + ').'

  // Has to be actively displayed to be scrolled.
  display('settings')
  res.scrollTop = res.scrollHeight
}

initCBAI()