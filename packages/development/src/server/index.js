import killTree from 'tree-kill'
import { ChildProcess } from 'child_process'

const processSymbol = Symbol('process')

export class AsaDevServer {
  /**
   * @var {ChildProcess}
   */
  [processSymbol] = null

  /**
   * constructor
   *
   * @param {ChildProcess} process
   */
  constructor (process) {
    if (!(process instanceof ChildProcess)) {
      throw new TypeError('process must to instance of ChildProcess')
    }

    this[processSymbol] = process
  }

  /**
   * @return {ChildProcess}
   */
  get process () {
    return this[processSymbol]
  }

  /**
   * Kill the current process
   * @param {() => void} callbackFunction
   * @returns Error|null
   */
  kill (callbackFunction) {
    if (!this.process) {
      return
    }

    killTree(this.process.pid || -1, 'SIGKILL', (error) => {
      if (error) {
        console.error('Error killing the tree process => \n', error, '\n\n\n\n\n\n')
      }

      try {
        this.process.kill()

        if (typeof callbackFunction === 'function') {
          callbackFunction()
        }
      } catch (err) {
        return err
      }
    })
  }

  /**
   * Add a new event listener
   *
   * @param {string} event
   * @param {() => void} eventHandler
   */
  on (event, eventHandler) {
    if (this.process) {
      this.process.on(event, eventHandler)
    }
  }
}
