export default class Controller {
  #view
  #camera
  #worker
  #blinkCounter = 0
  constructor({ view, worker, camera }) {
    this.#view = view;
    this.#camera = camera;
    this.#worker = this.#configureWorker(worker);

    this.#view.configuresOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('not yet detected eye blink! click in the button to start')
    return controller.init()
  }


  #configureWorker(worker) {
    let ready = false
    worker.onmessage = (msg) => {
      if ('READY' === msg.data) {
        console.log('worker is ready');
        this.#view.enableButton()
        ready = true
        return
      }
      const blinked = data.blinked
      this.#blinkCounter += 1

      console.log('blinked', blinked);
    }

    return {
      send(msg) {
        if (!ready) return;
        worker.postMessage(msg)
      }
    }

  }
  async init() {
    console.log("init");
  }
  loop() {
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video)
    this.#worker.send(img)

    console.log(`detecting eye blink ....`);

    setTimeout(() => this.loop, 100)
  }

  log(text) {
    this.#view.log(`log ${text}`)
  }

  onBtnStart() {
    this.log('initialized detection ...')
    this.#blinkCounter = 0
    this.loop()
  }
}