import Vue from "vue";

export default {
  data() {
    return {
      notificationObj: {
        group: "notifications",
        duration: 10000,
      },
    };
  },
  methods: {
    error(title, msg) {
      Vue.notify({
        ...this.notificationObj,
        type: "error",
        text: msg,
        title: title,
      });
    },
    success(title, msg) {
      Vue.notify({
        ...this.notificationObj,
        type: "success",
        text: msg,
        title: title,
      });
    },
    warning(title, msg) {
      Vue.notify({
        ...this.notificationObj,
        type: "warning",
        text: msg,
        title: title,
      });
    },
  },
};
