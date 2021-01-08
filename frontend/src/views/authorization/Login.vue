<template>
  <form @submit.prevent="loginUser" class="form">
    <div class="container login">
      <h2>Sign in</h2>
      <p class="additionalInfo">
        If you don't have an account in our service please go
        <router-link to="/register">here</router-link> to sign up
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
            'formGroup--error': $v.user.password.$error,
          },
          {
            'formGroup--success':
              !$v.user.password.$error && $v.user.password.$dirty,
          },
        ]"
      >
        <label class="label">password</label>
        <input
          class="input"
          type="password"
          @blur="!$v.user.password.$touch()"
          v-model.trim="$v.user.password.$model"
        />
        <template v-if="$v.user.password.$error">
          <p v-if="!$v.user.password.required" class="errorMessage">
            password is required
          </p>
          <template v-else>
            <p v-if="!$v.user.password.alphaNum" class="errorMessage">
              password cannot contain characters other than numbers and letters
            </p>
            <p v-if="!$v.user.password.minLength" class="errorMessage">
              password should be at least 8 characters long
            </p>
            <p
              v-if="!$v.user.password.mustContainAtLeastOneNum"
              class="errorMessage"
            >
              password must contain at least one number
            </p>
            <p
              v-if="!$v.user.password.mustContainAtLeastOneLet"
              class="errorMessage"
            >
              password must contain at least one letter
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
        sign in
      </button>
    </div>
  </form>
</template>
<script>
  import { Auth } from 'aws-amplify';
  import { required, alphaNum, email, minLength } from "vuelidate/lib/validators";
  import { mapActions } from 'vuex'
  import notificationMixin from "../../mixins/notificationMixin";

  const mustContainAtLeastOneNum = (value) => /\d/.test(value);
  const mustContainAtLeastOneLet = (value) => /[a-zA-Z]/.test(value);

  export default {
    name: 'Login',
    data() {
      return {
        user: {},
      }
    },
    mixins: [ notificationMixin ],
    created() {
      this.user = this.createEmptyUserObj();
    },
    validations: {
      user: {
        name: { required, email },
        password: {
          required, alphaNum, minLength: minLength(8), mustContainAtLeastOneNum,
          mustContainAtLeastOneLet
        }
      },
    },
    methods: {
      ...mapActions({ setCurrUser: "user/setCurrentUser" }),
      async loginUser() {
        if (this.user) {
          const user = {
            username: this.user.name,
            password: this.user.password,
          }
          try {
            const result = await Auth.signIn(user);
            this.setCurrUser({ userName: result.attributes.email, avatarNum: result.attributes[ "custom:avatar_num" ] });
            this.success(
              'success',
              'You have been successfuly logged in');
            this.user = this.createEmptyUserObj();
            this.$router.push('/');
          } catch (error) {
            this.error('error when logging in', error.message);
          }
        }
      },
      createEmptyUserObj() {
        return { name: "", password: "" };
      }
    },
  }
</script>
<style lang="scss" scoped>
</style>
