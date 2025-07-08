import {defineStore} from "pinia";

const useR18ModeStore = defineStore('r18-mode', {
    state: () => {
        return {isR18: false}
    },
    actions: {
        changeR18Mode(value) {
            this.isR18 = value
        }
    },
    persist: true
})


export {useR18ModeStore}