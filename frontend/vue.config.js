module.exports = {
  publicPath: '/chat_app_prod_ready/'
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        @import "@/assets/styles/global.scss";
        `,
      },
    },
  },
};
