import hasRole from './hasRole'
import hasPermi from './hasPermi'
import debounce from './debounce'

const install = function(Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('debounce', debounce)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  window['debounce'] = debounce
  Vue.use(install); // eslint-disable-line
}

export default install
