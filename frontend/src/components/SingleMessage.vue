<template>
  <div
    :class="[
      message.sender === currentUserName ? 'loggedUserMsg' : '',
      'singleMessage',
    ]"
  >
    <div class="authorAvatar">
      <img src="../assets/avatars/19.svg" alt="" />
    </div>
    <div class="content">
      <span class="author">
        {{ message.sender }}
      </span>
      <div class="text">{{ message.message }}</div>
      <div class="date">{{ idToTimestamp(message._id) }}</div>
    </div>
  </div>
</template>

<script>
  import objectIdToTimestamp from "objectid-to-timestamp";

  export default {
    name: "SingleMessage",
    props: {
      message: {
        type: Object, default: () => {
          return {};
        }
      },
      currentUserName: { type: String, default: "" }
    },
    methods: {
      idToTimestamp(id) {
        const date = new Date(objectIdToTimestamp(id));
        return date.toLocaleString('pl-PL', { timeZone: 'UTC' });
      },
    },
  }
</script>

<style lang="scss" scoped>
  .singleMessage {
    font-family: Arial, Helvetica, sans-serif;
    color: $white;
    &.loggedUserMsg {
      background-color: $melon;
    }
    flex-direction: column;
    align-self: center;
    background-color: $powder-blue;
    padding: 20px;
    border-radius: 50px;
    margin: 20px 0;
    width: 90%;
    display: flex;
    .authorAvatar {
      margin-right: 20px;
      img {
        width: 80px;
        height: 80px;
        background-color: $white;
        box-shadow: 3px 3px 10px $black;
        border-radius: 100%;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;
      text-align: left;
      .text {
        overflow-wrap: anywhere;
        font-size: $font-size-lg;
        margin: 10px 0;
      }
      .date {
        font-size: $font-size-xs;
        text-align: end;
      }
      .author {
        font-size: $font-size-md;
      }
    }
  }

  @media screen and (min-width: $breakpoint-s) {
    .singleMessage {
      width: 80%;
      align-self: flex-start;
      flex-direction: row;
      &.loggedUserMsg {
        align-self: flex-end;
      }
    }
  }
  @media screen and (min-width: $breakpoint-xl) {
    .singleMessage {
      width: 60%;
    }
  }
</style>
