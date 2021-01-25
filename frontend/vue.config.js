module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/chat_app_prod_ready" : "/",
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
