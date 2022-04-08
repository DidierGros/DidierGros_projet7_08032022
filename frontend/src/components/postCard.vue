  <template>
    <div>
        <v-card 
      v-for="message in messages" 
      :key="message.id" 
      class="mx-auto"
      max-width="900"
    >
    
    <v-card-title>{{message.title }}</v-card-title>
    <v-card-subtitle class="pb-0">{{ moment(message.createdAt).fromNow() }} <span>de : </span>  {{message.User.name }} </v-card-subtitle>
    
    <v-img
              :src="message.image"
              :alt="message.image"
              v-if="message.image != null"              
              height="400"
              class="grey darken-4"
    ></v-img>

      <v-card-text>{{ message.content }}</v-card-text>
      
      <v-card-actions>

        <div >
          <v-btn
          text
          color="red darken-2"
          v-if="message.idUsers == userId || isAdmin == true "       
          @click="deletePost(message.id)"
        >     
        
        <v-icon>mdi-delete</v-icon>
          supprimer
          
        </v-btn>
        </div>
    
      </v-card-actions>

      <v-card-actions>

        <v-btn
          color="indigo darken-4"
          text      
        >
        Poster un commentaire</v-btn>
        <v-spacer></v-spacer>

        <v-btn
          icon        
          @click="show = !show"        
        ><v-icon>{{ show ? 'mdi-comment-text-outline' : 'mdi-message-reply-text' }}</v-icon></v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>

      <v-form class="mx-auto" >
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="comment"           
                label="Poster votre commentaire"            
              ></v-text-field>
            </v-col>        
            <div class="error" v-if="error">{{ error.error }}</div>
          </v-row>
              <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text
                v-model="comment"           
                label="Poster un commentaire"                         
              > 
              </v-text>
            </v-col>        
            <div class="error" v-if="error">{{ error.error }}</div>
          </v-row>

          <v-btn
            color="red darken-2"
            class="mr-4"
            @click.prevent="newComment(message.id)"
                
          >        
          <span class="white--text">✔️ Valider</span>         
          </v-btn> 

          <div><router-link class="comment" :to="'/comment/' + message.id">
            Voir les commentaires</router-link></div>

    </v-container>
  </v-form>

<v-divider></v-divider>
      </div>
    </v-expand-transition>
  </v-card>

  </div>

</template>

<script>

let moment = require("moment");
import "moment/locale/fr";

import axios from "axios";

export default {
  name: "loadMessages",
  components: {
   
  },
   data() {
    return {
      moment: moment,
      token: "",
      userId: localStorage.getItem("id"),
      isAdmin: localStorage.getItem("isAdmin"),
      messages: [],
      id:"",
      idUsers: "",      
      title: "",
      content: "",
      createAt: "",
      User : {
        name : "",
        firstname : ""
      },
      show: false,
      comment: "",
      error: "",
      comments: []
    };

    
  },
  // Permet d'afficher des posts
  methods: {
    DisplayPosts() {
      
        axios
        .get("http://localhost:3000/api/messages/", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token")},
        })
        .then((res) => {
          
          this.messages = res.data;        
          

        })
        .catch((error) => {
          console.log({ error });
        });
    },
    // Permet de supprimer des posts
    deletePost(id) {                      
      const postId = id;
      axios
        .delete("http://localhost:3000/api/messages/" + postId, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token")},
        })
        .then(() => {
          alert("Votre message a bien été supprimé !");
          document.location.reload();
        })
        .catch((error) => {
          console.log({ error });
        });
    },


    // Permet de créer un nouveau commentaire
    newComment(id) {     
      const postId = id;     
      
      axios
        .post(
          "http://localhost:3000/api/messages/" + postId + "/comment/" , 
          {
            comment: this.comment,},          
          {
            headers: { Authorization: "Bearer " + localStorage.getItem("token")},
          }  
        ) 

        .then((res) => {
          console.log(res);
          this.$router.push("/posts");
          document.location.reload();
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },

  },
  mounted() {
    this.DisplayPosts();
  },
};
</script>
