<template>
<div>
       <v-toolbar
    
     app
      color="indigo darken-4"
      dark
    
    >
      <div class="d-flex align-center">
       
        <v-img
          alt="logo groupomania"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="../assets/icon-left-font-monochrome-white.png"
          width="200"
        />
      </div>

      <v-spacer></v-spacer>
      
      <v-btn
        href="/profil"
        target=""
        text
      >
        <span class="mr-2">profil</span>
              </v-btn>
  
      <v-btn
        @click.prevent="logout()"
        href="/login"        
        text
      >
        <span class="mr-2">déconnexion</span>
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
  </v-toolbar>

   <br>
  
        <div class="container">
              <div class="hero">

                <newMessage />
              </div>
              <br><br>
                <div>
                <postCard />
              </div>
              
        </div>
        
</div>

</template>

  <script>
import postCard from "../components/postCard.vue";
import newMessage from "../components/newMessage";


export default {
  name: "postPage",
  components: {
    postCard,
    newMessage,
   
  },
  data() {
    return {
      token: "",
      allMessages: [],
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>