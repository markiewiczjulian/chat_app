<template>
  <div>
    <form @submit.prevent="registerUser">
      <h3>Sign up</h3>
      <div class="registerForm">
        <div
          class="formGroup"
          :class="{ 'formGroup--error': $v.user.name.$error }"
        >
          <label class="form__label">e-mail</label>
          <input
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
        <div
          class="formGroup"
          :class="{
            'formGroup--error':
              $v.user.phone.number.$error || $v.user.phone.countryCode.$error,
          }"
        >
          <label class="form__label">phone number</label>
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
              class="form__input"
              type="text"
              @blur="
                !$v.user.phone.number.$touch();
                !$v.user.phone.countryCode.$touch();
              "
              v-model.trim="$v.user.phone.number.$model"
            />
          </div>

          <template
            v-if="
              $v.user.phone.number.$error || $v.user.phone.countryCode.$error
            "
          >
            <p v-if="!$v.user.phone.number.required" class="errorMessage">
              phone number is required
            </p>
            <p
              v-if="
                !$v.user.phone.number.numberic &&
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
        </div>
        <div class="error" v-if="$v.user.$anyError">Form is invalid.</div>
        <button
          :disabled="
            $v.user.$anyError || !$v.user.$anyDirty || $v.user.$invalid
          "
          type="submit"
        >
          submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { Auth } from 'aws-amplify';
  const countriesData = require('../assets/constants/countryCodes');
  import { required, alphaNum, email, numeric, minLength } from "vuelidate/lib/validators";

  const mustContainAtLeastOneNum = (value) => /\d/.test(value);
  const mustContainAtLeastOneLet = (value) => /[a-zA-Z]/.test(value);

  export default {
    name: "Register",
    data() {
      return {
        user: {
          name: "",
          password: "",
          phone: {
            countryCode: "",
            number: ""
          }
        },
      }
    },
    created() {
      this.countryCodes = countriesData;
    },
    validations: {
      user: {
        name: { required, email },
        password: {
          required, alphaNum, minLength: minLength(8), mustContainAtLeastOneNum,
          mustContainAtLeastOneLet
        },
        phone: {
          countryCode: { required },
          number: { required, numeric, minLength: minLength(3) }
        }
      },
    },
    methods: {
      async registerUser() {
        console.log(this.user)
        if (this.user) {
          const newUser = {
            username: this.user.name,
            password: this.user.password,
            attributes: {
              email: this.user.name,
              // phone_number: `${this.user.phone.countryCode} ${this.user.phone.number}`,
              phone_number: `+${this.user.phone.countryCode}${this.user.phone.number}`,
            }
          }
          try {
            console.log(newUser)
            console.log(Auth)
            const { userResult } = await Auth.signUp(newUser);
            console.log(userResult);
          } catch (error) {
            console.log('error signing up:', error);
          }
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .registerForm {
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
    .registerForm {
      width: 60%;
    }
  }
  @media screen and (min-width: $breakpoint-lg) {
    .registerForm {
      width: 40%;
    }
  }
</style>
