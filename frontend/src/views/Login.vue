<template>
  <form @submit.prevent="loginUser">
    <h3>Sign in</h3>
    <div class="loginForm">
      <div
        class="formGroup"
        :class="{ 'formGroup--error': $v.user.name.$error }"
      >
        <label class="form__label">e-mail</label>
        <input
          placeholder="enter your e-mail"
          class="form__input"
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
        :class="{ 'formGroup--error': $v.user.password.$error }"
      >
        <label class="form__label">password</label>
        <input
          placeholder="enter your password"
          class="form__input"
          type="password"
          @blur="!$v.user.password.$touch()"
          v-model.trim="$v.user.password.$model"
        />
        <template v-if="$v.user.password.$error">
          <p v-if="!$v.user.password.required" class="errorMessage">
            password is required
          </p>
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
      </div>
      <div class="error" v-if="$v.user.$anyError">Form is invalid.</div>
      <button :disabled="$v.user.$anyError" type="submit">submit</button>
    </div>
  </form>
</template>
<script>
  import { Auth } from 'aws-amplify';
  import { required, alphaNum, email, minLength } from "vuelidate/lib/validators";

  const mustContainAtLeastOneNum = (value) => /\d/.test(value);
  const mustContainAtLeastOneLet = (value) => /[a-zA-Z]/.test(value);

  export default {
    name: 'Login',
    data() {
      return {
        user: {
          name: "",
          password: ""
        },
      }
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
      async loginUser() {
        console.log(this.user)
        if (this.user) {
          const user = {
            username: this.user.name,
            password: this.user.password,
          }
          try {
            console.log(user);
            const { userResult } = await Auth.signIn(user);
            console.log(userResult);
          } catch (error) {
            console.log('error signing in:', error);
          }
        }
      }
    },
  }
</script>
<style lang="scss" scoped>
  .loginForm {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: auto;
    .formGroup {
      display: flex;
      flex-direction: column;
      border: 1px solid green;
      .phoneInput {
        display: flex;
        input {
          width: 100%;
          margin-left: 10px;
        }
      }
      &--error {
        background: red;
      }
    }
  }

  @media screen and (min-width: $breakpoint-s) {
    .loginForm {
      width: 60%;
    }
  }
  @media screen and (min-width: $breakpoint-lg) {
    .loginForm {
      width: 40%;
    }
  }
</style>
