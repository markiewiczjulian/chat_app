<template>
  <form @submit.prevent="resendConfirmationCode" class="form">
    <div class="container resendConfirmation">
      <h2>Resend confirmation code</h2>
      <p class="additionalInfo">
        If you didn't register yet please go
        <router-link to="/register">here</router-link>.
      </p>
      <div
        class="formGroup"
        :class="[
          {
            'formGroup--error': $v.user.name.$error,
          },
          {
            'formGroup--success': !$v.user.name.$error && $v.user.name.$dirty,
          },
        ]"
      >
        <label class="label">e-mail</label>
        <input
          class="input"
          type="text"
          @blur="!$v.user.name.$touch()"
          v-model.trim="$v.user.name.$model"
        />
        <template v-if="$v.user.name.$error">
          <p v-if="!$v.user.name.required" class="errorMessage">
            e-mail is required
          </p>
          <p v-if="!$v.user.name.email" class="errorMessage">
            this is not correct e-mail address
          </p>
        </template>
      </div>
      <div class="error" v-if="$v.user.$anyError">Form is invalid.</div>
      <button
        class="submitBtn"
        :disabled="$v.user.$anyError || !$v.user.$anyDirty || $v.user.$invalid"
        type="submit"
      >
        confirm
      </button>
    </div>
  </form>
</template>
<script>
  import { Auth } from 'aws-amplify';
  import { required, email } from "vuelidate/lib/validators";
  import { mapActions } from 'vuex';
  import notificationMixin from "@/mixins/notificationMixin";

  export default {
    name: 'ResendConfirmation',
    data() {
      return {
        user: {},
      }
    },
    validations: {
      user: {
        name: { required, email }
      },
    },
    created() {
      this.user = this.createEmptyUserObj();
    },
    mixins: [ notificationMixin ],
    methods: {
      ...mapActions({ setCurrUser: "user/setCurrentUser" }),
      async resendConfirmationCode() {
        try {
          await Auth.resendSignUp(this.user.name);
          this.setCurrUser(this.user.name);
          this.success(
            'success',
            'You have successfuly resend the confirmation code');
          this.user = this.createEmptyUserObj();
          this.$router.push('/confirm-register').catch(() => {});
        } catch (error) {
          this.error('error when resending confirmation code', error.message);
        }
      },
      createEmptyUserObj() {
        return { name: "" };
      }
    },
  }
</script>
<style lang="scss" scoped>
</style>
