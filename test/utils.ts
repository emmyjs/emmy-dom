export function awaitDidMount(componentName) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (document.querySelector(componentName).didMount) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })
}
