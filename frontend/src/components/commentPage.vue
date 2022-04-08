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
    <v-card
    max-width="900"
    class="mx-auto"
  >
    <v-toolbar
      color="indigo darken-4"
      dark
    >     

      <v-toolbar-title>Tous vos commentaires </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list-item  id="comment-card" v-for="comment in Comments" :key="comment.id">
      <v-list-item-content>
        <v-list-item-title>{{ comment.User.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ moment(comment.createdAt).fromNow() }} : {{ comment.comment }}</v-list-item-subtitle>
        <v-divider></v-divider>
        <v-btn icon v-if="comment.idUsers == userId || isAdmin == true">
        <v-icon>mdi-delete-sweep-outline</v-icon>
        <div v-if="comment.idUsers == userId || isAdmin == true">
        <deleteComment :id ="comment.id" />
        supprimer ce commentaire
        </div>
        </v-btn>

        <v-divider></v-divider>
        
      </v-list-item-content>
    </v-list-item>

  </v-card>

  </div>
  
</template>

<script>
let moment = require("moment");
import "moment/locale/fr";
import axios from "axios";

export default {
  name: "commentPage",  
    components: {
    
    
  },
  data() {
    return {
      moment: moment,
      token: "",
      isAdmin: "",
      id: "",
      userId: localStorage.getItem("id"),
      Comments:[],
      
    };
  },
    methods: {

     logout() {      
      localStorage.clear();
      this.$router.push("/login");
    },

    displayComments(id) {

      id = this.$route.params.id

     axios
        .get("http://localhost:3000/api/messages/" + id + "/comments/", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token")},
        })
        .then((res) => {   
          this.Comments = res.data;         
        })
        .catch((error) => {
          console.log({ error });
        });
    },

    deleteComment() {
      let token = localStorage.getItem("token");
      axios
        .delete(
          "http://localhost:3000/api/messages/" + this.id + "/comment/" +
            this.idComm,
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then(() => {
          alert("Votre commentaire a bien été supprimé !");
          document.location.reload();
        })
        .catch((error) => {
          console.log({ error });
        });
    },

  },
   
  mounted() {
    this.displayComments();
  
  },
};
</script>
