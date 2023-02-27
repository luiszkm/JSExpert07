import Controller from './controller.js';
import Service from './service.js';
import View from './view.js';
import Camera from '../../../lib/camera.js';
import { supportsWorkerType } from '../../../lib/util.js';

async function getWorker() {
  if (supportsWorkerType()) {
    console.log("suporta");
    const worker = new Worker('./src/worker.js', { type: 'module'})
    return worker
  }
  const workerMock = {
    async postMessage(){},
    onmessage(msg) {}
  }
  console.log("Não suporta");
  return workerMock
}

const worker = await getWorker();
console.log({worker});

const camera = await Camera.init()

const [rootPath] = window.location.href.split('/pages/')
const factory = {
  async initalize() {
    return Controller.initialize({
      view: new View({}),
      service: new Service({
      })
    })
  }
}

export default factory