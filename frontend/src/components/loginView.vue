<template>
    <div>
      <v-toolbar
    
     app
      color="indigo darken-4"
      dark
    
    >
      <div class="d-flex align-center">
       
        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="../assets/icon-left-font-monochrome-white.png"
          width="200"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="/"
        target=""
        text
      >
        <span class="mr-2">S'inscrire</span>
      </v-btn>

  </v-toolbar>

   <br>
   <v-card max-width = "800" class="mx-auto">     
      <br>

        <v-toolbar color="red darken-2">
            <v-toolbar-title class="white--text">Connectez-vous à votre compte !!!😀 
                 <v-img
          alt="logo groupomania"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="../assets/icon-left-font-monochrome-white.svg"
          width="40"
        /> 
            </v-toolbar-title>
        </v-toolbar>
  
          <v-form
        ref="form"        
        lazy-validation
      >
      <br>
        <v-text-field
          v-model="email"
          type="Email"
          id="mail"
          name="user_mail"
          placeholder="saissisez votre email"          
          label=" E-mail"
          required
          class="pl-5"
                    
        ></v-text-field>
                    
        <v-text-field
          type="password"
          v-model="password"         
          label="Choississez un mot de passe"
          required
          class="pl-5"         
        ></v-text-field>  
        

        <v-container class="mx-auto" >
  
           <v-btn
          color="red darken-2"
          class="mr-4"
          @click.prevent="login"
          
        >
         <span class="white--text">✔️ Se connecter</span>
          
        </v-btn>

        <v-btn
          color="indigo darken-4"
          href="/posts"          
        >

        <span class="white--text"> S'incrire</span>
          
        </v-btn>
         
        </v-container>
      
      </v-form>

       <div class="error" v-if="error">
        {{ error.error }}
      </div>

  </v-card>

     </div>

</template>


<script>
import axios from "axios";

export default {
  name: "loginView",

  data() {
    return {
      token: "",
      email: "",
      password: "",
      userId: "",
      isAdmin:"",
      error: "",
    };
  },

  methods: {
    async login() {
      await axios
        .post("http://localhost:3000/api/auth/login", {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("id", res.data.userId);
            localStorage.setItem("isAdmin", res.data.isAdmin);
          }
          this.$router.push("/posts");
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
  },
};
</script>
