<template>
  <form @submit.prevent="confirmSignUp">
    <h3>Confirm sign up</h3>
    <div class="form confirmRegister">
      <p class="additionalInfo">
        You should find email with one time code on email which you specified
        when registering. If you didn't get it you can
        <a @click="resendConfirmationCode">resend it</a> now.
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
          <p v-if="!$v.user.oneTimeCode.numeric" class="errorMessage">
            one time code should be composed of number only
          </p>
          <p v-if="!$v.user.oneTimeCode.minLength" class="errorMessage">
            one time code should have 8 characters
          </p>
        </template>
      </div>
      <div class="error" v-if="$v.user.$anyError">Form is invalid.</div>
      <button class="submitBtn" :disabled="$v.user.$anyError" type="submit">
        confirm
      </button>
    </div>
  </form>
</template>
<script>
  import { Auth } from 'aws-amplify';
  import { required, numeric, email, minLength } from "vuelidate/lib/validators";
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'ConfirmRegister',
    data() {
      return {
        user: {
          name: "",
          oneTimeCode: ""
        },
      }
    },
    validations: {
      user: {
        name: { required, email },
        oneTimeCode: {
          required, numeric, minLength: minLength(6)
        }
      },
    },
    created() {
      this.user.name = this.getCurrentUser();
    },
    methods: {
      ...mapGetters({ getCurrentUser: 'user/getCurrentUser' }),
      ...mapActions({ setCurrUser: "user/setCurrentUser" }),
      async confirmSignUp() {
        if (this.user) {
          try {
            const { userResult } = await Auth.confirmSignUp(this.user.name, this.user.oneTimeCode);
            console.log(userResult);
            this.setCurrUser(this.user.name);
            this.user = this.createEmptyUserObj();
            this.$router.push('/');
          } catch (error) {
            this.user = this.createEmptyUserObj();
            this.$v.$reset();
            console.log('error confirming sign up:', error);
            alert('error confirming sign up:', error);
          }
        }
      },
      async resendConfirmationCode() {
        try {
          await Auth.resendSignUp(this.user.name);
          console.log('code resent successfully');
        } catch (err) {
          console.log('error resending code: ', err);
          alert('error resending code:', err);
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
