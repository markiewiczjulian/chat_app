<template>
  <form @submit.prevent="confirmSignUp" class="form">
    <div class="container confirmRegister">
      <h2>Confirm sign up</h2>
      <p class="additionalInfo">
        You should find email with one time code on email which you specified
        when registering. If you didn't get it you can resend it
        <router-link to="/resend-confirmation">here</router-link>.
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
      <div
        class="formGroup"
        :class="[
          {
            'formGroup--error': $v.user.oneTimeCode.$error,
          },
          {
            'formGroup--success':
              !$v.user.oneTimeCode.$error && $v.user.oneTimeCode.$dirty,
          },
        ]"
      >
        <label class="label">one time code</label>
        <input
          class="input"
          type="text"
          @blur="!$v.user.oneTimeCode.$touch()"
          v-model.trim="$v.user.oneTimeCode.$model"
        />
        <template v-if="$v.user.oneTimeCode.$error">
          <p v-if="!$v.user.oneTimeCode.required" class="errorMessage">
            one time code is required
          </p>
          <template v-else>
            <p v-if="!$v.user.oneTimeCode.numeric" class="errorMessage">
              one time code should be composed of number only
            </p>
            <p v-if="!$v.user.oneTimeCode.minLength" class="errorMessage">
              one time code should have 8 characters
            </p>
          </template>
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
  import { required, numeric, email, minLength } from "vuelidate/lib/validators";
  import { mapGetters, mapActions } from 'vuex';
  import notificationMixin from "@/mixins/notificationMixin";

  export default {
    name: 'ConfirmRegister',
    data() {
      return {
        user: {},
      }
    },
    mixins: [ notificationMixin ],
    validations: {
      user: {
        name: { required, email },
        oneTimeCode: {
          required, numeric, minLength: minLength(6)
        }
      },
    },
    created() {
      this.user = this.createEmptyUserObj();
      this.user.name = this.getCurrentUser();
    },
    methods: {
      ...mapGetters({ getCurrentUser: 'user/getCurrentUser' }),
      ...mapActions({ setCurrUser: "user/setCurrentUser" }),
      async confirmSignUp() {
        if (this.user) {
          try {
            await Auth.confirmSignUp(this.user.name, this.user.oneTimeCode);
            this.setCurrUser(this.user.name);
            this.success(
              'success',
              'You have successfuly confirmed your registeration and logged in');
            this.user = this.createEmptyUserObj();
            this.$router.push('/').catch(() => { });;
          } catch (error) {
            this.error('error when confirming registration', error.message)
          }
        }
      },
      createEmptyUserObj() {
        return { name: "", oneTimeCode: "" };
      }
    },
  }
</script>
<style lang="scss" scoped>
</style>
