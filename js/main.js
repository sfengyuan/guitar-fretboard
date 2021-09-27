document.addEventListener('DOMContentLoaded', start, false)

const MAX_FRET = 19
const ROWS = ['e', 'b', 'g', 'd', 'a', 'e']
const INIT_WIDTH = 70

const layouts = {}
layouts.standard = [
  ["e'", "f'", "f#'", "g'", "g#'", "a'", "a#'", "b'", "c''", "c#''", "d''", "d#''", "e''", "f''", "f#''", "g''", "g#''", "a''", "a#''", "b''"],
  ["b", "c'", "c#'", "d'", "d#'", "e'", "f'", "f#'", "g'", "g#'", "a'", "a#'", "b'", "c''", "c#''", "d''", "d#''", "e''", "f''", "f#''"],
  ["g", "g#", "a", "a#", "b", "c'", "c#'", "d'", "d#'", "e'", "f'", "f#'", "g'", "g#'", "a'", "a#'", "b'", "c''", "c#''", "d''"],
  ["d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c'", "c#'", "d'", "d#'", "e'", "f'", "f#'", "g'", "g#'", "a'"],
  ["A", "A#", "B", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c'", "c#'", "d'", "d#'", "e'"],
  ["E", "F", "F#", "G", "G#", "A", "A#", "B", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"]
]

const choose = 'standard'
const style = 2
const layout = layouts[choose]
function start () {
  const fretboard = document.querySelector('#fretboard')
  for (let i = 0; i < layout.length; i++) {
    const row = document.createElement('div')
    row.classList.add('row')
    row.classList.add('row-' + i)
    const frets = layout[i]


    for (let j = 0; j < frets.length; j++) {
      const name = frets[j]
      const fret = document.createElement('div')
      fret.classList.add('fret')
      fret.classList.add('fret-' + j)
      const scientific = scientificNote(name)
      const common = /([^\d]+)/.exec(scientific)[0].toLowerCase()
      const octave = /(\d)/.exec(scientific)[1]
      fret.classList.add('fret-' + scientific)
      fret.classList.add('fret-' + common)
      fret.classList.add('fret-octave-' + octave)
      fret.classList.add(/#/.test(name) ? 'fret-accidents' : 'fret-natural')

      fret.style.width = `${INIT_WIDTH - j}px`
      const noteContainer = document.createElement('span')
      noteContainer.classList.add('note-container')
      noteContainer.dataset.note = common
      let precede = null
      name.split('').forEach(char => {
        const span = document.createElement('span')
        span.innerText = char
        span.classList.add(char === "'"
        ? 'quote'
        : char === "#"
          ? 'accidents'
          : 'letter'
        )
        span.classList.add(precede === "'"
        ? 'following-quote'
        : precede === "#"
          ? 'following-sharp'
          : precede
            ? 'following-letter'
            : 'following-none'
        )
        noteContainer.appendChild(span)
        precede = char
      })
      // noteContainer.style.top = '-18px'
      // noteContainer.style.left = `${21 - name.length}px`

      if (j === 0) {
        fret.style.width = '10px'
        noteContainer.style.left = `-30px`
      }
      if (j >= 11) {
        noteContainer.style.left = '10px'
      }
      if (j >= 16) {
        noteContainer.style.left = '5px'
      }

      fret.appendChild(noteContainer)
      row.appendChild(fret)
    }
    fretboard.appendChild(row)
  }
  registerHandlers()
}

function registerHandlers () {
  const fb = document.querySelector('#fretboard')
  fb.addEventListener('click', ev => {
    if (ev.target.className !== 'note-container' && ev.target.parentNode.className !== 'note-container') {
      return
    }
    ev.stopPropagation()
    const note = ev.target.dataset.note || ev.target.parentNode.dataset.note
    document.querySelectorAll('.fret-' + note).forEach(f => f.classList.add('highlight'))
  })

  document.querySelector('#mode-switcher').addEventListener('click', ev => {
    fb.classList.toggle('simple-mode')
  })

  document.body.addEventListener('click', ev => {
    document.querySelectorAll('.highlight').forEach(f => f.classList.remove('highlight'))
  })
}

/*
  rules:
  x'' -> x5
  x'  -> x4
  x   -> x3
  X   -> x2
  # -> sharp
*/
function scientificNote (note) {
  const base = /[^']+/.exec(note)[0]
  const count = (note.match(/'/g) || []).length

  const ret = count === 2
  ? base + '5'
  : count === 1
    ? base + '4'
    : note.toLowerCase() === note
      ? base + '3'
      : base + '2'
  return ret.replace('#', '-sharp').toLowerCase()
}

function css(element, style) {
  for (const property in style) {
    element.style[property] = style[property]
  }
}

function adjustColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}
