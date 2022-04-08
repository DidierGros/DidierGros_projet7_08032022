<template>
    <v-card max-width = "900" class="mx-auto">

        <v-toolbar color="indigo darken-4">
            <v-toolbar-title class="white--text">Poster votre message ici !!!😀 
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
            v-model="title"
            label="title"
            placeholder="Ici le titre de votre message"
            solo
          ></v-text-field>
       
             <v-textarea
          v-model="content"   
          filled
          name="content"
          label="message"
          value=""
          placeholder="saisissez votre message ici 😀 "
        ></v-textarea>                
       
        <v-file-input
            v-model="file"
            name="picture"
            label="File"
            filled
            prepend-icon="mdi-camera"
            placeholder="déposez votre image ici 😀 "
            @change="selectFile()"
        ></v-file-input>        

        <v-container class="mx-auto" >
  
           <v-btn
          color="indigo darken-4"
          class="mr-4"
          @click.prevent="newMessage"
          
        >
         <span class="white--text">✔️ Valider votre message</span>
          
        </v-btn>
         
        </v-container>
      
      </v-form>

       <div class="error" v-if="error">
        {{ error.error }}
      </div>

  </v-card>

</template>


<script>
import axios from "axios";

export default {
  name: "newPost",

  data() {
    return {
      title: "",
      content: "",
      file: null,
      error: "",
    };
  },

  methods: {
    newMessage() {
      let token = localStorage.getItem("token");
      const data = new FormData();
      if (this.file == null) {
        data.append("title", this.title);
        data.append("content", this.content);
      } else {
        data.append("title", this.title);
        data.append("content", this.content);
        data.append("image", this.file, this.file.name);
      }

      axios
        .post("http://localhost:3000/api/messages/", data, {
          headers: { Authorization: "Bearer " + token },
        })
        .then(() => {
          alert("Votre message a bien été envoyé !");
          document.location.reload();
          this.$router.push("/posts");
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },

    selectFile() {
      this.file = this.$refs.file.files[0];
    },
  },
};
</script>