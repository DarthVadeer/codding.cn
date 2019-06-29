class Algo {
  constructor(d = {}) {
    this.d = d

    d.type = d.type || {}
    d.type.list = d.type.list || []

    const nodeList = document.querySelector('#box-algo > .list')
    
    nodeList.innerHTML = d.type.list.map((v) => {
      return `
        <section class="algo-item">
          <div class="box-btn">
            <button class="btn btn-primary">${v.name}</button>
          </div>
          <div class="box-canvas">
            <canvas data-title="${v.name}"></canvas>
          </div>
        </section>
      `
    }).join('')

    const len = 20
    let randArr = [].rnd(len, 1, len * 5)
    // randArr = new Array(len).fill().map((_, idx) => idx)

    randArr = randArr.map(n => new Node(n))

    nodeList.querySelectorAll('canvas').forEach((canvas, idx) => {
      const typeItem = d.type.list[idx]
      console.time(typeItem.cons.name)
      const o = new typeItem.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        typeItem,
      })

      o[typeItem.startFn](typeItem.arg)
      o.setPos()
      o.render()
      o.log && o.log()
      console.timeEnd(typeItem.cons.name)
    })
  }
}

Algo.conf = {
  itemWidth: 30,
  itemHeight: 18,
  levelHeight: 36,
  paddingH: 15,
  paddingV: 15,
  paddingTop: 0,
  lineHeight: 14 * 1.5,
  scale: devicePixelRatio,
  font: '14px Arial',
  fontSm: '12px Arial',
  fontLg: '16px Arial',
}

Algo.color = {
  red: '#F44336',
  pink: '#E91E63',
  purple: '#9C27B0',
  deepPurple: '#673AB7',
  indigo: '#3F51B5',
  blue: '#2196F3',
  lightBlue: '#03A9F4',
  cyan: '#00BCD4',
  teal: '#009688',
  green: '#4CAF50',
  lightGreen: '#8BC34A',
  lime: '#CDDC39',
  yellow: '#FFEB3B',
  amber: '#FFC107',
  orange: '#FF9800',
  deepOrange: '#FF5722',
  brown: '#795548',
  grey: '#9E9E9E',
  blueGrey: '#607D8B',
  black: '#000000',
  white: '#FFFFFF',
}