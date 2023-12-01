import killTree from 'tree-kill'

const processSymbol = Symbol('process')

export class AsaDevServer {
  [processSymbol] = null

  constructor (process) {
    this[processSymbol] = process
  }

  get process () {
    return this[processSymbol]
  }

  kill (callbackFunction) {
    if (!this.process) {
      return
    }

    killTree(this.process.pid, () => {
      // if (error) {
      //   console.error('Error killing the tree process', error)
      // }

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

  on (event, eventHandler) {
    if (this.process) {
      this.process.on(event, eventHandler)
    }
  }
}
