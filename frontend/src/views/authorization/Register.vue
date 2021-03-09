<template>
  <form @submit.prevent="registerUser" class="form">
    <div class="container register">
      <h2>Sign up</h2>
      <p class="additionalInfo">
        If you already have an account in our service please go
        <router-link to="/login">here</router-link> to sign in.<br />Already
        registered but you didn't confirm please go
        <router-link to="/confirm-register">here</router-link> to confirm your
        registration
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
      <div
        class="formGroup"
        :class="[
          {
            'formGroup--error':
              $v.user.repeatPassword.$error || $v.user.password.$error,
          },
          {
            'formGroup--success':
              !$v.user.repeatPassword.$error &&
              !$v.user.password.$error &&
              $v.user.repeatPassword.$dirty,
          },
        ]"
      >
        <label class="label">confirm password</label>
        <input
          class="input"
          type="password"
          @blur="!$v.user.repeatPassword.$touch()"
          v-model.trim="$v.user.repeatPassword.$model"
        />
        <template v-if="$v.user.repeatPassword.$error">
          <p v-if="!$v.user.repeatPassword.required" class="errorMessage">
            password is required
          </p>
          <p v-if="!$v.user.repeatPassword.sameAsPassword" class="errorMessage">
            password must be identical
          </p>
        </template>
      </div>
      <div
        class="formGroup"
        :class="[
          {
            'formGroup--error':
              $v.user.phone.number.$error || $v.user.phone.countryCode.$error,
          },
          {
            'formGroup--success':
              !$v.user.phone.number.$error &&
              $v.user.phone.number.$dirty &&
              !$v.user.phone.countryCode.$error &&
              $v.user.phone.countryCode.$dirty,
          },
        ]"
      >
        <label class="label">phone number</label>
        <div class="phoneInput">
          <select
            v-model="$v.user.phone.countryCode.$model"
            name="countryCode"
            @blur="!$v.user.phone.countryCode.$touch()"
          >
            <option
              v-for="code in countryCodes"
              :key="code.countryCode"
              :value="code.countryCallingCode"
            >
              +{{ code.countryCallingCode }} {{ code.flag }}
            </option>
          </select>
          <input
            class="input"
            type="text"
            @blur="
              !$v.user.phone.number.$touch();
              !$v.user.phone.countryCode.$touch();
            "
            v-model.trim="$v.user.phone.number.$model"
          />
        </div>

        <template
          v-if="$v.user.phone.number.$error || $v.user.phone.countryCode.$error"
        >
          <p v-if="!$v.user.phone.number.required" class="errorMessage">
            phone number is required
          </p>
          <template v-else>
            <p
              v-if="
                !$v.user.phone.number.numeric &&
                !$v.user.phone.countryCode.$error
              "
              class="errorMessage"
            >
              phone number cannot contain characters other than numbers
            </p>
            <p v-if="!$v.user.phone.number.minLength" class="errorMessage">
              phone number should be at least 3 characters long
            </p>
            <p v-if="!$v.user.phone.countryCode.required" class="errorMessage">
              phone number country code is required
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
        sign up
      </button>
    </div>
  </form>
</template>

<script>
  import { Auth } from 'aws-amplify';
  import { required, alphaNum, email, numeric, minLength, sameAs } from "vuelidate/lib/validators";
  import { mapActions } from 'vuex';
  import notificationMixin from "@/mixins/notificationMixin";
  const countriesData = require('@/assets/constants/countryCodes');

  const mustContainAtLeastOneNum = (value) => /\d/.test(value);
  const mustContainAtLeastOneLet = (value) => /[a-zA-Z]/.test(value);

  export default {
    name: "Register",
    data() {
      return {
        user: {},
      }
    },
    created() {
      this.countryCodes = countriesData;
      this.user = this.createEmptyUserObj();
    },
    mixins: [ notificationMixin ],
    validations: {
      user: {
        name: { required, email },
        password: {
          required, alphaNum, minLength: minLength(8), mustContainAtLeastOneNum,
          mustContainAtLeastOneLet
        },
        repeatPassword: {
          sameAsPassword: sameAs('password')
        },
        phone: {
          countryCode: { required },
          number: { required, numeric, minLength: minLength(3) }
        }
      },
    },
    methods: {
      ...mapActions({ setCurrUser: "user/setCurrentUser" }),
      async registerUser() {
        if (this.user) {
          const randomAvatarNum = this.getRandomAvatarNumber();
          const newUser = {
            username: this.user.name,
            password: this.user.password,
            attributes: {
              email: this.user.name,
              phone_number: `+${this.user.phone.countryCode}${this.user.phone.number}`,
              'custom:avatar_num': `${randomAvatarNum}`
            }
          }
          try {
            await Auth.signUp(newUser);
            this.setCurrUser(this.user.name);
            this.success(
              'success',
              'You have been successfuly registered');
            this.user = this.createEmptyUserObj();
            this.$router.push('/confirm-register');
          } catch (error) {
            this.error('error when registering', error.message);
          }
        }
      },
      getRandomAvatarNumber() {
        const avatarsLength = 20;
        return Math.floor(
          Math.random() * Math.floor(avatarsLength),
        );
      },
      createEmptyUserObj() {
        return {
          name: "",
          password: "",
          repeatPassword: "",
          phone: {
            countryCode: "",
            number: ""
          }
        };
      }
    },
  }
</script>

<style lang="scss" scoped>
  .register .formGroup .phoneInput {
    display: flex;
    .input {
      width: 100%;
      margin-left: 10px;
    }
  }
</style>
