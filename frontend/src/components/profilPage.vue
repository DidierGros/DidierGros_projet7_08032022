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
        href="/posts"
        target=""
        text
      >
        <span class="mr-2">accueil</span>

      </v-btn>
    <v-btn
        @click="logout()"
        href="/login"        
        text
      >
        <span class="mr-2">déconnexion</span>
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>

  </v-toolbar>

   <br>

    <v-card max-width = "900" class="mx-auto">

      <br>

        <v-toolbar color="red darken-2">
            <v-toolbar-title class="white--text">Bonjour :  {{ dataProfile.name }}

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
        <v-content class="pl-5">Votre email est :  <span class="indigo--text">{{ dataProfile.email }}</span></v-content>
        <v-text-field
          v-model="email"
          type="hidden"
          id="mail"
          name="user_mail"
          placeholder="Modifier votre email"                  
          class="pl-5"                    
        ></v-text-field>                    
     
    <v-content class="pl-5">Votre nom est : <span class="indigo--text">{{ dataProfile.name }}</span></v-content>
        <v-text-field
          v-model="name"         
          label=" Modifier Votre nom"          
          class="pl-5"
        ></v-text-field>

    <v-content class="pl-5">Votre prénom est : <span class="indigo--text">{{ dataProfile.firstname }}</span></v-content>
    
        <v-text-field
          v-model="firstname" 
          label=" Modifier Votre prenom"
          required
          class="pl-5"
        ></v-text-field>

        <v-container class="mx-auto" >
  
           <v-btn
          color="red darken-2"
          class="mr-4"
          @click.prevent="updateProfile"
          
        >
         <span class="white--text">✔️ Valider vos modifications</span>
          
        </v-btn>

          <v-btn
          color="indigo darken-4"
          class="mr-4"
          @click.prevent="deleteProfile"
          
        >
         <span class="white--text">😭 Supprimer votre compte</span>
          
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
  name: "profilPage",

  data() {
    return {
      token: "",
      error: "",
      userId: "",
      dataProfile: [],
      email: "",
      name: "",
      firstname: "",
      file : ""
    };
  },

  methods: {
    loadProfile() {
      let token = localStorage.getItem("token");
      let userId = localStorage.getItem("id");
      axios
        .get("http://localhost:3000/api/auth/profile/" + userId, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          this.dataProfile = res.data;
        })
        .catch((error) => {
          console.log({ error });
        });
    },

    updateProfile() {
      let token = localStorage.getItem("token");
      let userId = localStorage.getItem("id");
      const data = {
        email: this.email,
        name: this.name,
        firstname: this.firstname,
        file : this.file
      };
      axios
        .put("http://localhost:3000/api/auth/profile/" + userId, data, {
          headers: { Authorization: "Bearer " + token },
        })
        .then(() => {
          alert("Votre profil a bien été mis à jour !");
          document.location.reload();
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },

    deleteProfile() {
      let token = localStorage.getItem("token");
      let userId = localStorage.getItem("id");
      axios
        .delete("http://localhost:3000/api/auth/profile/" + userId, {
          headers: { Authorization: "Bearer " + token },
        })
        .then(() => {
          alert("Votre compte est supprimé !");
          localStorage.clear();
          this.$router.push("/");
        })
        .catch((error) => {
          console.log({ error });
        });
    },
  },
   logout() {
      localStorage.clear();
      this.$router.push("/login");
    },

    mounted() {
    this.loadProfile();
  },
};
</script>
