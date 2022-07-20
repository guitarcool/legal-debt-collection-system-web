export default {
    /**
     * 防抖绑定方法
     * @param {Object} el - The element the directive is bound to.
     * @param {Object} binding - An vue directive object
     */
    // inserted: function (el, binding) {
    //     el.addEventListener("click", () => {
    //         if (!el.disabled) {
    //             el.disabled = true
    //             setTimeout(() => {
    //                 el.disabled = false
    //             }, binding.value || 2000)
    //         }
    //     });
    // }
    inserted: function (el, binding) {
        let timer;
        el.addEventListener("click", () => {
            if (!el.disabled) {
                if (timer) {
                    clearTimeout(timer);
                }
                el.disabled = true
                timer = setTimeout(() => {
                    el.disabled = false
                }, binding.value || 2000)
            }
        });
    }
}
